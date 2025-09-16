from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ---------- User Schemas ----------
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: str
    biography: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



class LoginSchema(BaseModel):
    email_or_username: str
    password: str


# ---------- Roadmap Request/Response ----------
class TopicRequest(BaseModel):
    field: str  # veya topic yerine field kullanıyoruz


class RoadmapOut(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

