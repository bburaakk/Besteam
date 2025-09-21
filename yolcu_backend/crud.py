# crud.py (GÜNCELLENMİŞ HALİ)

from sqlalchemy.orm import Session
from . import models, schemas
from yolcu_backend.auth import get_password_hash # Import get_password_hash


# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password) # Hash the password
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        password_hash=hashed_password # Use the hashed password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Hackathon CRUD
def get_hackathon(db: Session, hackathon_id: int):
    return db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()

def get_hackathons(db: Session):
    return db.query(models.Hackathon).all()


def create_hackathon(db: Session, hackathon: schemas.HackathonCreate):
    db_hackathon = models.Hackathon(**hackathon.dict())
    db.add(db_hackathon)
    db.commit()
    db.refresh(db_hackathon)
    return db_hackathon


# Team CRUD
def get_team(db: Session, team_id: int):
    return db.query(models.Team).filter(models.Team.id == team_id).first()


def create_team_for_hackathon(db: Session, team: schemas.TeamCreate, hackathon_id: int, user_id: int):
    db_team = models.Team(
        name=team.name,
        hackathon_id=hackathon_id,
        created_by_user_id=user_id
    )
    db.add(db_team)

    # db.commit() yerine db.flush() kullanarak yeni takımın ID'sini alıyoruz.
    # Bu sayede işlem veritabanına tam olarak işlenmeden ID'ye erişebiliriz.
    db.flush()

    team_member = models.TeamMember(user_id=user_id, team_id=db_team.id)
    db.add(team_member)

    db.commit()

    db.refresh(db_team)

    return db_team


def add_user_to_team(db: Session, team_id: int, user_id: int):
    new_member = models.TeamMember(user_id=user_id, team_id=team_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


# ChatMessage CRUD
def create_chat_message(db: Session, content: str, user_id: int, hackathon_id: int = None, team_id: int = None):
    db_message = models.ChatMessage(content=content, user_id=user_id, hackathon_id=hackathon_id, team_id=team_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


# --- YENİ EKLENEN FONKSİYONLAR ---
def get_hackathon_messages(db: Session, hackathon_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ChatMessage).filter(models.ChatMessage.hackathon_id == hackathon_id).offset(skip).limit(
        limit).all()


def get_team_messages(db: Session, team_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ChatMessage).filter(models.ChatMessage.team_id == team_id).offset(skip).limit(limit).all()