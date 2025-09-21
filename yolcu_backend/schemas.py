from pydantic import BaseModel
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict
from typing import Optional

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
    field: str  # Kullanıcıdan gelen konu


class RoadmapOut(BaseModel):
    id: int
    user_id: int
    content: Dict[str, Any]  # JSONB için dict tipinde
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
class ProjectIdea(BaseModel):
    id: int
    title: str
    description: str

class ProjectLevel(BaseModel):
    level_name: str
    projects: List[ProjectIdea]

class ProjectSuggestionResponse(BaseModel):
    project_levels: List[ProjectLevel]


# ---------- Project Evaluation Schemas ----------
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# ---------- Quiz Schemas ----------
class RoadmapItem(BaseModel):
    id: str
    name: str

class QuizRequest(BaseModel):
    roadmap_id: int
    rightItems: List[RoadmapItem]
    leftItems: List[RoadmapItem]

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str

class QuizLevel(BaseModel):
    level: int
    levelTitle: str
    questions: List[Question]

class QuizResponse(BaseModel):
    quizTitle: str
    levels: List[QuizLevel]
