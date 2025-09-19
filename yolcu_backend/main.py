from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import tempfile
import os
from database import SessionLocal, engine, Base
from models import User, Roadmap, CV
from schemas import UserCreate, UserOut, LoginSchema, TopicRequest, RoadmapOut, CVOut
from auth import get_password_hash, verify_password, create_access_token, get_current_user, get_db
from settings import settings
from services.ai_service import GeminiService
from generators.roadmap_generator import RoadmapGenerator
from generators.cv_analyzer import CVAnalyzer
from prompts.cv_prompts import CV_FEEDBACK_PROMPT

# DB tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Services ----------
gemini_service = GeminiService(api_key=settings.GEMINI_API_KEY)
roadmap_generator = RoadmapGenerator(ai_service=gemini_service)
cv_analyzer = CVAnalyzer(gemini_api_key=settings.GEMINI_API_KEY)

# ---------- Signup ----------
@app.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ---------- Login ----------
@app.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == data.email_or_username) | (User.username == data.email_or_username)
    ).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email/username or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# ---------- Get User by ID ----------
@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ---------- Roadmap Generator ----------
@app.post("/api/roadmaps/generate", response_model=RoadmapOut)
def generate_roadmap(
    request: TopicRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    generator = RoadmapGenerator(ai_service=gemini_service)  # gemini_service DI yapılmalı
    roadmap_json = generator.create_roadmap(request.field)   # dict döner

    roadmap = Roadmap(user_id=current_user.id, content=roadmap_json)
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap

@app.post("/api/cv/analyze", response_model=CVOut)
async def analyze_cv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # --- Dosya kontrolü ---
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF or TXT files allowed.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB).")

    try:
        # --- Geçici dosya oluştur ---
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name

        # --- CV içeriğini oku ---
        cv_text = cv_analyzer.read_cv(temp_path)

        # --- ATS analizleri ---
        keywords_result = cv_analyzer.extract_keywords(cv_text)
        basic_score = cv_analyzer.ats_score_basic(cv_text, keywords_result["found"])
        advanced_score = cv_analyzer.ats_score_advanced(cv_text, keywords_result["found"])
        language = cv_analyzer.detect_language(cv_text)
        tips = cv_analyzer.get_ats_optimization_tips(advanced_score)
        feedback = cv_analyzer.generate_ai_feedback(cv_text, advanced_score)

        # --- temp dosya temizliği ---
        os.unlink(temp_path)

        # --- DB'ye kaydet ---
        cv_entry = CV(
            user_id=current_user.id,
            file_name=file.filename,
            content=cv_text,
            basic_score=basic_score["basic_score"],
            advanced_score=advanced_score["basic_score"],
            final_score=advanced_score["final_score"],
            found_keywords=advanced_score["found_keywords"],
            missing_keywords=advanced_score["missing_keywords"],
            feedback=feedback,
            tips=tips,
            language=language,
        )
        db.add(cv_entry)
        db.commit()
        db.refresh(cv_entry)

        return cv_entry

    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        raise HTTPException(status_code=500, detail=f"CV analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
