from pydantic import BaseModel
from datetime import datetime
from typing import Any, Dict,List, Optional

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

class TokenUserResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str

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

class CVBase(BaseModel):
    file_name: str
    content: str
    basic_score: Optional[float] = None
    advanced_score: Optional[float] = None
    final_score: Optional[float] = None
    found_keywords: Optional[List[str]] = None
    missing_keywords: Optional[List[str]] = None
    feedback: Optional[str] = None
    tips: Optional[List[str]] = None
    language: Optional[str] = None


class CVCreate(CVBase):
    pass


class CVOut(CVBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ---------- Project Suggestion Schemas ----------
class ProjectSuggestion(BaseModel):
    title: str
    description: str

class ProjectSuggestionResponse(BaseModel):
    suggestions: List[ProjectSuggestion]
