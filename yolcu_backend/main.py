from typing import Annotated

from fastapi import FastAPI, UploadFile, File, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from rich import status
from sqlalchemy.orm import Session
import tempfile
import os
import json
import traceback
from yolcu_backend.generators.project_evaluator import ProjectEvaluator
from yolcu_backend.generators.roadmap_chat_service import RoadmapChatService
from yolcu_backend.generators.summary_creator import SummaryCreator
from yolcu_backend.prompts.motivational_prompt import MOTIVATIONAL_PROMPT
from yolcu_backend.schemas import UserCreate, UserOut, TopicRequest, RoadmapOut, CVOut, LoginSchema, TokenUserResponse , ProjectOut, ProjectSuggestionResponse, ProjectLevel, ProjectIdea, QuizRequest, QuizResponse
from yolcu_backend.auth import get_password_hash, verify_password, create_access_token, get_current_user, get_db
from yolcu_backend.settings import settings
from yolcu_backend.services.ai_service import GeminiService
from yolcu_backend.generators.roadmap_generator import RoadmapGenerator
from yolcu_backend.generators.cv_analyzer import CVAnalyzer
from yolcu_backend.generators.project_suggestion_generator import ProjectSuggestionGenerator
from yolcu_backend.generators.quiz_generator import QuizGenerator
from yolcu_backend.services import db_service
from yolcu_backend.models import User, Roadmap, CV, Project, Quiz
from yolcu_backend.database import engine, Base


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
cv_analyzer = CVAnalyzer(ai_service=gemini_service)
summary_creator = SummaryCreator(ai_service=gemini_service)
# Chat servisi artık RAG veya vektör veritabanı kullanmadığı için basitçe başlatılıyor
chat_service = RoadmapChatService(ai_service=gemini_service)
project_suggestion_generator = ProjectSuggestionGenerator(ai_service=gemini_service)
project_evaluator = ProjectEvaluator(ai_service=gemini_service)
quiz_generator = QuizGenerator(ai_service=gemini_service)

# ---------- Signup ----------
@app.post("/signup", response_model=TokenUserResponse)
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
    return {"user":db_user,"access_token": access_token, "token_type": "bearer"}

# ---------- Login ----------
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
def get_user_by_id(
    user_id: int = Path(..., description="ID of the user to retrieve"),
    db: Session = Depends(get_db)
):
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

from fastapi import Query

@app.get("/api/roadmaps/{roadmap_id}/summaries")
def summarize_item(
    roadmap_id: int,
    item_id: str = Query(..., description="Left veya right item ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()
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

    return {
        "roadmap_id": roadmap.id,
        "center_node": center_node_title,
        "item_id": item_id,
        "topic": topic_title,
        "summary": summary
    }

@app.post("/api/roadmaps/{roadmap_id}/chat")
def roadmap_chat(
    roadmap_id: int,
    question: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found or you don't have access.")

    try:
        # Düzeltilmiş metod adı ve eklenen parametre
        answer = chat_service.generate_answer(question=question, roadmap_content=roadmap.content)
        return {"roadmap_id": roadmap_id, "question": question, "answer": answer}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# ---------- CV Analyze ----------
@app.post("/api/cv/analyze", response_model=CVOut)
async def analyze_cv(
        file: UploadFile = File(...),
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # --- Dosya kontrolü ---
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF or TXT files allowed.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB).")

    try:
        # --- Geçici dosya oluştur ---
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name

        # --- CV içeriğini oku ---
        cv_text = cv_analyzer.read_cv(temp_path)

        # --- ATS analizleri ---
        keywords_result = cv_analyzer.extract_keywords(cv_text)
        basic_score = cv_analyzer.ats_score_basic(cv_text, keywords_result["found"])
        advanced_score = cv_analyzer.ats_score_advanced(cv_text, keywords_result["found"])
        language = cv_analyzer.detect_language(cv_text)
        tips = cv_analyzer.get_ats_optimization_tips(advanced_score)
        feedback = cv_analyzer.generate_ai_feedback(cv_text, advanced_score)

        # --- temp dosya temizliği ---
        os.unlink(temp_path)

        # --- DB'ye kaydet ---
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
        titles = db_service.get_centralnode_titles(db, user_id=current_user.id)
        if not titles:
            raise HTTPException(status_code=404,
                                detail="No roadmap titles found for the current user. Please create a roadmap first.")

        suggestions_json_str = project_suggestion_generator.generate_suggestions(titles)
        suggestions_data = json.loads(suggestions_json_str)

        if not suggestions_data or "project_levels" not in suggestions_data:
            raise HTTPException(status_code=500, detail="No valid project suggestions could be generated.")

        # Create a new structure to hold the response with IDs
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
                    db.flush()  # Flush to get the ID before commit
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


# --- Project Evaluate ---
@app.post("/api/projects/{project_id}/evaluate", response_model=dict, tags=["Projects"])
async def evaluate_specific_project(
        project_id: int,
        file: UploadFile = File(..., description="The project file to be evaluated for the specified project."),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Evaluates an uploaded file against a specific project suggestion identified by project_id.
    """
    project_suggestion = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

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

        evaluation_json_str = project_evaluator.evaluate_project(
            project_code=project_text,
            original_suggestion=suggestion_data
        )

        evaluation_data = json.loads(evaluation_json_str)

        # Add the project_id to the final response
        evaluation_data["project_id"] = project_id

        return evaluation_data

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An internal error occurred during project evaluation.")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)


@app.get("/api/projects", response_model=list[ProjectOut], tags=["Projects"])
def get_user_projects(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Retrieves all projects for the currently logged-in user.
    """
    projects = db_service.get_projects_by_user(db=db, user_id=current_user.id)
    return projects


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


# ---------- Quiz ----------
@app.post("/api/quizzes/generate", response_model=QuizResponse, tags=["Quizzes"])
def generate_quiz(
        request: QuizRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Generates a 5-level quiz based on roadmap items, saves it to the database,
    and returns the full quiz in JSON format.
    """
    try:
        # Check if roadmap belongs to the user
        roadmap = db.query(Roadmap).filter(
            Roadmap.id == request.roadmap_id,
            Roadmap.user_id == current_user.id
        ).first()
        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found or access denied.")

        print(f"Quiz API endpoint called for roadmap_id: {request.roadmap_id}")


        # Extract left and right items from the roadmap content
        left_items = []
        right_items = []
        for stage in roadmap.content.get("mainStages", []):
            for node in stage.get("subNodes", []):
                left_items.extend(node.get("leftItems", []))
                right_items.extend(node.get("rightItems", []))

        if not left_items and not right_items:
            raise HTTPException(status_code=404, detail="No items found in roadmap to generate a quiz.")

        # 1. Generate the quiz content from the AI service
        quiz_data = quiz_generator.create_quiz(
            roadmap_id=request.roadmap_id,
            rightItems=right_items,
            leftItems=left_items
        )

        # 2. Parse the generated data and save it to the database
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

        # 3. Return the full quiz data to the frontend
        return quiz_data

    except ValueError as ve:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        db.rollback()
        traceback.print_exc()  # For debugging on the server
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the quiz: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)

