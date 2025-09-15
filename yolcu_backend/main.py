from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from database import SessionLocal, engine, Base
from models import User, Roadmap
from schemas import UserCreate, UserOut, LoginSchema, TopicRequest, RoadmapOut
from auth import get_password_hash, verify_password, create_access_token, get_current_user, get_db

from settings import settings
from services.ai_service import GeminiService
from generators.roadmap_generator import RoadmapGenerator

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
def login(login_data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(

        (User.email == login_data.email_or_username) |
        (User.username == login_data.email_or_username)
    ).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}



# ---------- Get User by ID ----------
@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------- Roadmap Generator ----------
gemini_service = GeminiService(api_key=settings.GEMINI_API_KEY)
roadmap_generator = RoadmapGenerator(ai_service=gemini_service)


@app.post("/api/roadmaps/generate", response_model=RoadmapOut)
def generate_roadmap(
        request: TopicRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        # Gemini'den roadmap oluştur
        roadmap_content = roadmap_generator.create_roadmap(request.field)

        # DB'ye kaydet (login yapan kullanıcının ID'si ile)

        db_roadmap = Roadmap(
            user_id=current_user.id,
            content=json.dumps(roadmap_content)
        )
        db.add(db_roadmap)
        db.commit()
        db.refresh(db_roadmap)

        return db_roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))