from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import tempfile
import os
from typing import Annotated
from .database import engine, Base
from .models import User, Roadmap, CV
from .schemas import UserCreate, UserOut, TopicRequest, RoadmapOut, CVOut, ProjectSuggestionResponse
from .auth import get_password_hash, verify_password, create_access_token, get_current_user, get_db
from .settings import settings
from .services import GeminiService
from .generators import RoadmapGenerator, CVAnalyzer, ProjectSuggestionGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .services import db_service

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
project_suggestion_generator = ProjectSuggestionGenerator(ai_service=gemini_service)

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

@app.post("/login")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == form_data.username) | (User.username == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

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
    generator = RoadmapGenerator(ai_service=gemini_service)
    roadmap_json = generator.create_roadmap(request.field)

    roadmap = Roadmap(user_id=current_user.id, content=roadmap_json)
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap

# ---------- CV Analyze ----------
@app.post("/api/cv/analyze", response_model=CVOut)
async def analyze_cv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF or TXT files allowed.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB).")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name

        cv_text = cv_analyzer.read_cv(temp_path)

        keywords_result = cv_analyzer.extract_keywords(cv_text)
        basic_score = cv_analyzer.ats_score_basic(cv_text, keywords_result["found"])
        advanced_score = cv_analyzer.ats_score_advanced(cv_text, keywords_result["found"])
        language = cv_analyzer.detect_language(cv_text)
        tips = cv_analyzer.get_ats_optimization_tips(advanced_score)
        feedback = cv_analyzer.generate_ai_feedback(cv_text, advanced_score)

        os.unlink(temp_path)

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

# ---------- Project Suggestions ----------
@app.get("/project-suggestions", response_model=ProjectSuggestionResponse)
def get_project_suggestions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # 1. Fetch titles from the user's latest roadmap
        titles = db_service.get_centralnode_titles(db, user_id=current_user.id)
        if not titles:
            raise HTTPException(status_code=404, detail="No roadmap titles found for the current user. Please create a roadmap first.")

        # 2. Generate suggestions using the generator
        suggestions_str = project_suggestion_generator.generate_suggestions(titles)
        suggestions_list = [s.strip() for s in suggestions_str.split('\n') if s.strip()]

        # 3. Return the suggestions
        return {"suggestions": suggestions_list}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(f"Error generating project suggestions: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating project suggestions.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("yolcu_backend.main:app", host="0.0.0.0", port=8000, reload=True)
