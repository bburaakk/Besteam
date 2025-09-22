import os
import json
import traceback
import tempfile
from typing import List, Annotated

from fastapi import FastAPI, UploadFile, File, Path, Body, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from yolcu_backend.auth import get_password_hash, verify_password, create_access_token, get_current_user, get_db
from yolcu_backend.settings import settings
from yolcu_backend.services.ai_service import GeminiService
from yolcu_backend.generators.roadmap_generator import RoadmapGenerator
from yolcu_backend.generators.cv_analyzer import CVAnalyzer
from yolcu_backend.generators.summary_creator import SummaryCreator
from yolcu_backend.generators.roadmap_chat_service import RoadmapChatService
from yolcu_backend.generators.project_suggestion_generator import ProjectSuggestionGenerator
from yolcu_backend.generators.project_evaluator import ProjectEvaluator
from yolcu_backend.generators.quiz_generator import QuizGenerator
from yolcu_backend.prompts.motivational_prompt import MOTIVATIONAL_PROMPT
from yolcu_backend.schemas import UserCreate, UserOut, TopicRequest, RoadmapOut, CVOut, LoginSchema, TokenUserResponse, ProjectOut, ProjectSuggestionResponse, ProjectLevel, ProjectIdea, QuizRequest, QuizResponse
from yolcu_backend.models import User, Roadmap, CV, Project, Quiz
from yolcu_backend.services import db_service

# Hackathon ile ilgili importlar
from yolcu_backend.websocket_manager import manager
from yolcu_backend import models, schemas, crud
from yolcu_backend.database import engine as hackathon_engine, SessionLocal, Base as HackathonBase
from yolcu_backend.database import engine as yolcu_engine, Base as YolcuBase

import uvicorn

# --- Veritabanı Tablolarını Oluşturma ---
YolcuBase.metadata.create_all(bind=yolcu_engine)
HackathonBase.metadata.create_all(bind=hackathon_engine)

app = FastAPI(
    title="Yolcu Backend API",
    description="Service for Roadmaps, CVs, Hackathons, Teams, and Chat."
)

# --- CORS Middleware ---
origins = [
    "https://yolcu-app.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Servislerin Başlatılması ---
gemini_service = GeminiService(api_key=settings.GEMINI_API_KEY)
roadmap_generator = RoadmapGenerator(ai_service=gemini_service)
cv_analyzer = CVAnalyzer(ai_service=gemini_service)
summary_creator = SummaryCreator(ai_service=gemini_service)
chat_service = RoadmapChatService(ai_service=gemini_service)
project_suggestion_generator = ProjectSuggestionGenerator(ai_service=gemini_service)
project_evaluator = ProjectEvaluator(ai_service=gemini_service)
quiz_generator = QuizGenerator(ai_service=gemini_service)

# --- Endpoint'ler ---

# --- Kimlik Doğrulama ---
@app.post("/signup", response_model=TokenUserResponse, tags=["Authentication"])
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
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"user": db_user, "access_token": access_token, "token_type": "bearer"}

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

@app.get("/users/{user_id}", response_model=UserOut, tags=["Users"])
def get_user_by_id(user_id: int = Path(..., description="ID of the user to retrieve"), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Roadmap ---
@app.post("/api/roadmaps/generate", response_model=RoadmapOut, tags=["Roadmaps"])
def generate_roadmap(request: TopicRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap_json = roadmap_generator.create_roadmap(request.field)
    roadmap = Roadmap(user_id=current_user.id, content=roadmap_json)
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return roadmap

@app.get("/api/roadmaps/{roadmap_id}/summaries", tags=["Roadmaps"])
def summarize_item(roadmap_id: int, item_id: str = Query(..., description="Left or right item ID"), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    topic_title, center_node_title = None, None
    for stage in roadmap.content.get("mainStages", []):
        for node in stage.get("subNodes", []):
            for side in ["leftItems", "rightItems"]:
                for item in node.get(side, []):
                    if item.get("id") == item_id:
                        topic_title = item.get("name")
                        center_node_title = node.get("centralNodeTitle")
                        break
                if topic_title: break
            if topic_title: break
        if topic_title: break
    
    if not topic_title:
        raise HTTPException(status_code=404, detail="Item not found in roadmap.")
    
    summary = summary_creator.generate_summary(roadmap_json=roadmap.content, item_id=item_id)
    return {"roadmap_id": roadmap.id, "center_node": center_node_title, "item_id": item_id, "topic": topic_title, "summary": summary}

@app.post("/api/roadmaps/{roadmap_id}/chat", tags=["Roadmaps"])
def roadmap_chat(roadmap_id: int, question: str = Body(..., embed=True), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found or you don't have access.")
    
    try:
        # Hackathon branch'inin daha gelişmiş mantığı
        topics = chat_service.extract_topics(roadmap.content)
        matched_topic = chat_service.match_question_to_topic(question, topics)
        if not matched_topic:
            answer = "Sorry, I can't answer questions outside the roadmap topics. How can I assist you with the topics in your roadmap?"
        else:
            answer = chat_service.generate_answer(question, matched_topic, roadmap.content)
        return {"roadmap_id": roadmap.id, "question": question, "answer": answer}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# --- CV Analizi ---
@app.post("/api/cv/analyze", response_model=CVOut, tags=["CV"])
async def analyze_cv(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF or TXT files allowed.")
    
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB).")
    
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
        
        cv_text = cv_analyzer.read_cv(temp_path)
        keywords_result = cv_analyzer.extract_keywords(cv_text)
        advanced_score = cv_analyzer.ats_score_advanced(cv_text, keywords_result["found"])
        feedback = cv_analyzer.generate_ai_feedback(cv_text, advanced_score)
        
        cv_entry = CV(
            user_id=current_user.id,
            file_name=file.filename,
            content=cv_text,
            final_score=advanced_score["final_score"],
            found_keywords=advanced_score["found_keywords"],
            missing_keywords=advanced_score["missing_keywords"],
            feedback=feedback,
            tips=cv_analyzer.get_ats_optimization_tips(advanced_score),
            language=cv_analyzer.detect_language(cv_text),
        )
        db.add(cv_entry)
        db.commit()
        db.refresh(cv_entry)
        return cv_entry
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"CV analysis failed: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)

# --- Projeler ---
@app.get("/project-suggestions", response_model=ProjectSuggestionResponse, tags=["Projects"])
def get_project_suggestions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        titles = db_service.get_centralnode_titles(db, user_id=current_user.id)
        if not titles:
            raise HTTPException(status_code=404, detail="No roadmap found for user. Create a roadmap first.")
        
        suggestions_json_str = project_suggestion_generator.generate_suggestions(titles)
        suggestions_data = json.loads(suggestions_json_str)
        
        response_levels = []
        for level in suggestions_data.get("project_levels", []):
            created_projects = []
            for project_idea in level.get("projects", []):
                if "title" in project_idea and "description" in project_idea:
                    new_project = Project(
                        user_id=current_user.id,
                        title=project_idea["title"],
                        description=project_idea["description"]
                    )
                    db.add(new_project)
                    db.flush()
                    db.refresh(new_project)
                    created_projects.append(ProjectIdea(
                        id=new_project.id,
                        title=new_project.title,
                        description=new_project.description
                    ))
            response_levels.append(ProjectLevel(level_name=level["level_name"], projects=created_projects))
            
        db.commit()
        return ProjectSuggestionResponse(project_levels=response_levels)
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while generating project suggestions.")

@app.post("/api/projects/{project_id}/evaluate", response_model=dict, tags=["Projects"])
async def evaluate_specific_project(project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project_suggestion = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    
    if not project_suggestion:
        raise HTTPException(status_code=404, detail="Project suggestion not found or you don't have access.")
    
    temp_path = None
    try:
        content = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
        
        project_text = project_evaluator.read_project_file(temp_path, file.filename)
        if not project_text or len(project_text) < 50:
            raise HTTPException(status_code=400, detail="The content of the file is too short to evaluate.")
        
        suggestion_data = ProjectOut.from_orm(project_suggestion).dict()
        evaluation_json_str = project_evaluator.evaluate_project(project_code=project_text, original_suggestion=suggestion_data)
        evaluation_data = json.loads(evaluation_json_str)
        evaluation_data["project_id"] = project_id
        
        return evaluation_data
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An internal error occurred during project evaluation.")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)

@app.get("/api/projects", response_model=list[ProjectOut], tags=["Projects"])
def get_user_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db_service.get_projects_by_user(db=db, user_id=current_user.id)
    return projects

# --- Motivasyon Mesajı ---
@app.get("/motivational-message", tags=["Utilities"])
async def get_motivational_message():
    try:
        raw_response = gemini_service.generate_content(MOTIVATIONAL_PROMPT)
        formatted_response = " ".join(raw_response.replace("**", " ").split())
        return {"message": formatted_response}
    except Exception as e:
        print(f"Motivational Message Error: {e}")
        raise HTTPException(status_code=500, detail="Great projects are waiting for you, let's get started!")

# --- Quiz ---
@app.post("/api/quizzes/generate", response_model=QuizResponse, tags=["Quizzes"])
def generate_quiz(request: QuizRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        roadmap = db.query(Roadmap).filter(Roadmap.id == request.roadmap_id, Roadmap.user_id == current_user.id).first()
        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found or access denied.")
        
        left_items = []
        right_items = []
        for stage in roadmap.content.get("mainStages", []):
            for node in stage.get("subNodes", []):
                left_items.extend(node.get("leftItems", []))
                right_items.extend(node.get("rightItems", []))
        
        if not left_items and not right_items:
            raise HTTPException(status_code=404, detail="No items found in roadmap to generate a quiz.")
        
        quiz_data = quiz_generator.create_quiz(roadmap_id=request.roadmap_id, rightItems=right_items, leftItems=left_items)
        
        for level_data in quiz_data.get("levels", []):
            level_title = level_data.get("levelTitle", "Unknown Level")
            for question_data in level_data.get("questions", []):
                new_question = Quiz(
                    roadmap_id=request.roadmap_id,
                    question=question_data.get("question"),
                    level=level_title,
                    options=question_data.get("options"),
                    answer=question_data.get("answer")
                )
                db.add(new_question)
        
        db.commit()
        return quiz_data
    except ValueError as ve:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the quiz: {e}")

# --- Hackathon, Takım ve Sohbet ---
@app.get("/hackathons/", response_model=List[schemas.HackathonSchema], tags=["Hackathons"])
def get_hackathons(db: Session = Depends(get_db)):
    return crud.get_hackathons(db)

@app.post("/hackathons/{hackathon_id}/teams/", response_model=schemas.TeamSchema, status_code=status.HTTP_201_CREATED, tags=["Teams"])
def create_team(hackathon_id: int, team: schemas.TeamCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_team_for_hackathon(db=db, team=team, hackathon_id=hackathon_id, user_id=current_user.id)

@app.post("/teams/{team_id}/join/", status_code=status.HTTP_200_OK, tags=["Teams"])
def join_team(team_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_team = crud.get_team(db, team_id=team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")
    if len(db_team.members) >= 5:
        raise HTTPException(status_code=400, detail="Team is full (max 5 members)")
    if any(member.user_id == current_user.id for member in db_team.members):
        raise HTTPException(status_code=400, detail="User is already in this team")
    
    crud.add_user_to_team(db, team_id=team_id, user_id=current_user.id)
    return {"message": f"Successfully joined team '{db_team.name}'"}

@app.get("/hackathons/{hackathon_id}/messages", response_model=List[schemas.MessageSchema], tags=["Chat"])
def read_hackathon_messages(hackathon_id: int, db: Session = Depends(get_db)):
    return crud.get_hackathon_messages(db, hackathon_id=hackathon_id)

@app.get("/teams/{team_id}/messages", response_model=List[schemas.MessageSchema], tags=["Chat"])
def read_team_messages(team_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    team = crud.get_team(db, team_id=team_id)
    if not team or not any(member.user_id == current_user.id for member in team.members):
        raise HTTPException(status_code=403, detail="You are not authorized to view this team's messages.")
    return crud.get_team_messages(db, team_id=team_id)

@app.websocket("/ws/{chat_type}/{item_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, chat_type: str, item_id: int, user_id: int):
    db = SessionLocal()
    try:
        user = crud.get_user(db, user_id)
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        room_name = f"{chat_type}-{item_id}"
        
        if chat_type == "team":
            team = crud.get_team(db, item_id)
            if not team or not any(member.user_id == user_id for member in team.members):
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Not a team member")
                return
        
        await manager.connect(websocket, room_name)
        try:
            while True:
                data = await websocket.receive_text()
                crud.create_chat_message(
                    db,
                    content=data,
                    user_id=user_id,
                    hackathon_id=item_id if chat_type == 'hackathon' else None,
                    team_id=item_id if chat_type == 'team' else None
                )
                broadcast_message = f"[{user.username}]: {data}"
                await manager.broadcast(broadcast_message, room_name)
        except WebSocketDisconnect:
            manager.disconnect(websocket, room_name)
        except Exception as e:
            print(f"WebSocket Error: {e}")
            manager.disconnect(websocket, room_name)
    finally:
        db.close()

# --- Uygulamayı Başlatma ---
if __name__ == "__main__":
    # Eğer test amaçlı eski veritabanı varsa silinir
    if os.path.exists("hackathon.db"):
        os.remove("hackathon.db")
        print("Old hackathon database file removed.")
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)