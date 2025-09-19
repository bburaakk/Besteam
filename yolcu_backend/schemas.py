from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import Any, Dict

# ---------- User Schemas ----------
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password_hash: str

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
    field: str   # Kullanıcıdan gelen konu

class RoadmapOut(BaseModel):
    id: int
    user_id: int
    content: Dict[str, Any]   # JSONB için dict tipinde
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True