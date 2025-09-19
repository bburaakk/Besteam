from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import Any, Dict,List, Optional

class UserCreate(BaseModel):
    full_name: str
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    username: str
    email: str

    class Config:
        orm_mode = True


class LoginSchema(BaseModel):
    email_or_username: str
    password: str


# ---------- Roadmap Request/Response ----------
class TopicRequest(BaseModel):
    field: str   # Kullanıcıdan gelen konu

class RoadmapOut(BaseModel):
    id: int
    user_id: int
    content: Dict[str, Any]   # JSONB için dict tipinde
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True