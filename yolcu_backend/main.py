from fastapi import FastAPI, Depends, HTTPException, status ,UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from prompts.motivational_prompt import MOTIVATIONAL_PROMPT
from prompts.project_evaluation_prompt import EVALUATION_PROMPT


from database import SessionLocal, engine, Base
from models import User, Roadmap
from schemas import UserCreate, UserOut, LoginSchema, TopicRequest, RoadmapOut
from auth import get_password_hash, verify_password, create_access_token

from settings import settings
from services.ai_service import GeminiService
from services import db_service
from generators.roadmap_generator import RoadmapGenerator
from generators.evaluate_project_generator import ProjectEvaluator
from generators.project_suggestion_generator import ProjectSuggestionGenerator


from auth import get_current_user

# DB tablolarını oluştur
Base.metadata.create_all(bind=engine)
gemini_service = GeminiService(api_key=settings.GEMINI_API_KEY)
roadmap_generator = RoadmapGenerator(ai_service=gemini_service)
project_evaluator = ProjectEvaluator(ai_service=gemini_service)
project_suggestion_generator = ProjectSuggestionGenerator(ai_service=gemini_service)

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",  # regex ile herkese izin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- DB dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
        full_name=user.full_name,
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
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

# ---------- Project Suggestions ----------
@app.get("/project-suggestions")
def get_project_suggestions(db: Session = Depends(get_db)):
    try:
        # 1. Fetch titles from the database
        titles = db_service.get_centralnode_titles(db)
        if not titles:
            raise HTTPException(status_code=404, detail="No roadmap titles found to generate suggestions.")

        # 2. Generate suggestions using the generator
        suggestions = project_suggestion_generator.generate_suggestions(titles)

        # 3. Return the suggestions
        return {"suggestions": suggestions}

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(f"Error generating project suggestions: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating project suggestions.")


# ---------- Motivational ----------
@app.get("/motivational-message")
async def get_motivational_message():
    try:
        response = gemini_service.generate_content(MOTIVATIONAL_PROMPT)

        return {"message": response}

    except Exception as e:
        print(f"Motivasyon Mesajı Hatası: {e}")
        raise HTTPException(
            status_code=500,
            detail="Harika projeler seni bekliyor, haydi başlayalım!"
        )


# ---------- ProjectEvaluation ----------
@app.post("/evaluate-project")
async def evaluate_project(
    projectTitle: str = Form(...),
    projectDescription: str = Form(...),
    projectFile: UploadFile = File(...)
):
    try:
        project_code = await projectFile.read()
        project_code_str = project_code.decode('utf-8')

        evaluation_result = project_evaluator.evaluate(
            project_title=projectTitle,
            project_description=projectDescription,
            project_code=project_code_str
        )

        return {'feedback': evaluation_result}

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Yapay zeka yanıtı JSON formatında değil."
        )
    except Exception as e:
        print(f"Sunucu Hatası: {e}")
        raise HTTPException(
            status_code=500,
            detail="Yapay zeka değerlendirmesi sırasında bir sunucu hatası oluştu."
        )


