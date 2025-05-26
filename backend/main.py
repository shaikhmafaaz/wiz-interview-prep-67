
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
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the data directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Initialize the database
conn = sqlite3.connect("data/interview_wiz.db")
cursor = conn.cursor()

# Create tables with timestamps
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
""")

# Insert sample questions with timestamps if they don't exist
cursor.execute("SELECT COUNT(*) FROM questions")
if cursor.fetchone()[0] == 0:
    current_time = datetime.now(timezone.utc).isoformat()
    sample_questions = [
        ("What is React and how does it work?", "Frontend", "Easy", "Explain the basics of React framework", current_time, current_time),
        ("Explain the difference between var, let, and const in JavaScript", "Frontend", "Medium", "Discuss variable declarations in JavaScript", current_time, current_time),
        ("How do you optimize React performance?", "Frontend", "Hard", "Discuss various React optimization techniques", current_time, current_time),
        ("What is a RESTful API?", "Backend", "Easy", "Explain REST principles and API design", current_time, current_time),
        ("Explain database indexing", "Backend", "Medium", "Discuss how database indexes work and their benefits", current_time, current_time),
        ("Design a scalable microservices architecture", "Backend", "Hard", "Architect a distributed system with microservices", current_time, current_time),
    ]
    
    cursor.executemany(
        "INSERT INTO questions (question, category, difficulty, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        sample_questions
    )

conn.commit()
conn.close()

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

# Utility functions
def get_current_timestamp():
    return datetime.now(timezone.utc).isoformat()

def get_db():
    conn = sqlite3.connect("data/interview_wiz.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Pydantic models
class User(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: str
    updated_at: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Answer(BaseModel):
    questionId: int
    userId: str
    answer: str

class AnswerResponse(BaseModel):
    id: int
    questionId: int
    userId: str
    answer: str
    created_at: str
    updated_at: str

class QuestionResponse(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    description: str
    created_at: str
    updated_at: str

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
    current_time = get_current_timestamp()
    
    cursor.execute(
        "INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, user.name, user.email, hashed_password, current_time, current_time)
    )
    db.commit()
    
    logger.info(f"✅ User registered successfully: {user.email} with ID: {user_id} at {current_time}")
    return UserResponse(
        id=user_id, 
        name=user.name, 
        email=user.email,
        created_at=current_time,
        updated_at=current_time
    )

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
    
    logger.info(f"✅ Login successful for user: {request.email} at {get_current_timestamp()}")
    return {
        "id": user["id"], 
        "name": user["name"], 
        "email": user["email"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }

# Question routes
@app.get("/api/questions", response_model=List[QuestionResponse])
async def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    logger.info(f"📚 Fetching questions - Category: {category}, Difficulty: {difficulty} at {get_current_timestamp()}")
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
    
    logger.info(f"📊 Found {len(questions)} questions at {get_current_timestamp()}")
    return [
        QuestionResponse(
            id=q["id"],
            question=q["question"],
            category=q["category"],
            difficulty=q["difficulty"],
            description=q["description"],
            created_at=q["created_at"],
            updated_at=q["updated_at"]
        )
        for q in questions
    ]

# Answer routes
@app.post("/api/answers", response_model=AnswerResponse)
async def save_answer(answer: Answer, db: sqlite3.Connection = Depends(get_db)):
    current_time = get_current_timestamp()
    logger.info(f"💾 Saving answer - Question ID: {answer.questionId}, User ID: {answer.userId} at {current_time}")
    cursor = db.cursor()
    
    cursor.execute(
        "INSERT INTO answers (question_id, user_id, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (answer.questionId, answer.userId, answer.answer, current_time, current_time)
    )
    db.commit()
    
    answer_id = cursor.lastrowid
    logger.info(f"✅ Answer saved successfully with ID: {answer_id} at {current_time}")
    
    return AnswerResponse(
        id=answer_id,
        questionId=answer.questionId,
        userId=answer.userId,
        answer=answer.answer,
        created_at=current_time,
        updated_at=current_time
    )

@app.get("/api/answers/{user_id}", response_model=List[AnswerResponse])
async def get_user_answers(user_id: str, db: sqlite3.Connection = Depends(get_db)):
    current_time = get_current_timestamp()
    logger.info(f"📖 Fetching answers for user: {user_id} at {current_time}")
    cursor = db.cursor()
    
    cursor.execute(
        "SELECT * FROM answers WHERE user_id = ?",
        (user_id,)
    )
    answers = cursor.fetchall()
    
    logger.info(f"📊 Found {len(answers)} answers for user: {user_id} at {current_time}")
    return [
        AnswerResponse(
            id=a["id"],
            questionId=a["question_id"],
            userId=a["user_id"],
            answer=a["answer"],
            created_at=a["created_at"],
            updated_at=a["updated_at"]
        )
        for a in answers
    ]

if __name__ == "__main__":
    import uvicorn
    logger.info(f"🚀 Starting Interview-Wiz-Guide API server on port 5000 at {get_current_timestamp()}")
    uvicorn.run(app, host="0.0.0.0", port=5000)
