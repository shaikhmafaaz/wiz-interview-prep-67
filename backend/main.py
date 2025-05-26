
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
import hashlib
import uuid
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the database directory if it doesn't exist
os.makedirs("database", exist_ok=True)

# Initialize the database
conn = sqlite3.connect("database/interview_wiz.db")
cursor = conn.cursor()

# ... keep existing code (database table creation and sample data insertion)

app = FastAPI(title="Interview-Wiz-Guide API")

# Enable CORS - Updated to include new frontend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware to log requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request
    logger.info(f"🔵 INCOMING REQUEST: {request.method} {request.url}")
    if request.method in ["POST", "PUT", "PATCH"]:
        logger.info(f"📝 Request headers: {dict(request.headers)}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"✅ RESPONSE: {response.status_code} | Time: {process_time:.2f}s | {request.method} {request.url.path}")
    
    return response

# ... keep existing code (models, helper functions)

# Authentication routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: User, db: sqlite3.Connection = Depends(get_db)):
    logger.info(f"👤 Registration attempt for email: {user.email}")
    cursor = db.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        logger.warning(f"❌ Registration failed - email already exists: {user.email}")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user.password)
    
    cursor.execute(
        "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
        (user_id, user.name, user.email, hashed_password)
    )
    db.commit()
    
    logger.info(f"✅ User registered successfully: {user.email} with ID: {user_id}")
    return UserResponse(id=user_id, name=user.name, email=user.email)

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    logger.info(f"🔐 Login attempt for email: {request.email}")
    cursor = db.cursor()
    hashed_password = hash_password(request.password)
    
    cursor.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (request.email, hashed_password)
    )
    
    user = cursor.fetchone()
    if not user:
        logger.warning(f"❌ Login failed for email: {request.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info(f"✅ Login successful for user: {request.email}")
    return {"id": user["id"], "name": user["name"], "email": user["email"]}

# Question routes
@app.get("/api/questions", response_model=List[QuestionResponse])
async def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    logger.info(f"📚 Fetching questions - Category: {category}, Difficulty: {difficulty}")
    cursor = db.cursor()
    
    query = "SELECT * FROM questions"
    params = []
    
    if category and category.lower() != 'all':
        query += " WHERE category = ?"
        params.append(category)
        
        if difficulty and difficulty.lower() != 'all':
            query += " AND difficulty = ?"
            params.append(difficulty)
    elif difficulty and difficulty.lower() != 'all':
        query += " WHERE difficulty = ?"
        params.append(difficulty)
    
    cursor.execute(query, params)
    questions = cursor.fetchall()
    
    logger.info(f"📊 Found {len(questions)} questions")
    return [
        QuestionResponse(
            id=q["id"],
            question=q["question"],
            category=q["category"],
            difficulty=q["difficulty"],
            description=q["description"]
        )
        for q in questions
    ]

# Answer routes
@app.post("/api/answers", response_model=AnswerResponse)
async def save_answer(answer: Answer, db: sqlite3.Connection = Depends(get_db)):
    logger.info(f"💾 Saving answer - Question ID: {answer.questionId}, User ID: {answer.userId}")
    cursor = db.cursor()
    
    cursor.execute(
        "INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)",
        (answer.questionId, answer.userId, answer.answer)
    )
    db.commit()
    
    answer_id = cursor.lastrowid
    logger.info(f"✅ Answer saved successfully with ID: {answer_id}")
    
    return AnswerResponse(
        id=answer_id,
        questionId=answer.questionId,
        userId=answer.userId,
        answer=answer.answer
    )

@app.get("/api/answers/{user_id}", response_model=List[AnswerResponse])
async def get_user_answers(user_id: str, db: sqlite3.Connection = Depends(get_db)):
    logger.info(f"📖 Fetching answers for user: {user_id}")
    cursor = db.cursor()
    
    cursor.execute(
        "SELECT * FROM answers WHERE user_id = ?",
        (user_id,)
    )
    answers = cursor.fetchall()
    
    logger.info(f"📊 Found {len(answers)} answers for user: {user_id}")
    return [
        AnswerResponse(
            id=a["id"],
            questionId=a["question_id"],
            userId=a["user_id"],
            answer=a["answer"]
        )
        for a in answers
    ]

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting Interview-Wiz-Guide API server on port 5000")
    uvicorn.run(app, host="0.0.0.0", port=5000)
