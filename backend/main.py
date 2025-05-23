
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
import hashlib
import uuid

# Create the database directory if it doesn't exist
os.makedirs("database", exist_ok=True)

# Initialize the database
conn = sqlite3.connect("database/interview_wiz.db")
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    description TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)
''')

conn.commit()

# Insert some sample questions
sample_questions = [
    ("What is the OSI model?", "Networking", "Medium", "Explain the seven layers of the OSI model and their functions."),
    ("Explain ACID properties in database systems.", "DBMS", "Medium", "Define Atomicity, Consistency, Isolation, and Durability."),
    ("What is a deadlock in operating systems?", "OS", "Hard", "Explain deadlocks, their conditions, and prevention strategies."),
    ("Explain SQL injection and how to prevent it.", "Cybersecurity", "Easy", "Describe SQL injection attacks and best practices to prevent them."),
]

cursor.executemany(
    "INSERT OR IGNORE INTO questions (question, category, difficulty, description) VALUES (?, ?, ?, ?)",
    sample_questions
)

conn.commit()
conn.close()

app = FastAPI(title="Interview-Wiz-Guide API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Question(BaseModel):
    question: str
    category: str
    difficulty: str
    description: Optional[str] = None

class QuestionResponse(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    description: Optional[str] = None

class Answer(BaseModel):
    questionId: int
    answer: str
    userId: str

class AnswerResponse(BaseModel):
    id: int
    questionId: int
    userId: str
    answer: str

# Helper functions
def get_db():
    conn = sqlite3.connect("database/interview_wiz.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Authentication routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: User, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user.password)
    
    cursor.execute(
        "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
        (user_id, user.name, user.email, hashed_password)
    )
    db.commit()
    
    return UserResponse(id=user_id, name=user.name, email=user.email)

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    hashed_password = hash_password(request.password)
    
    cursor.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (request.email, hashed_password)
    )
    
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"id": user["id"], "name": user["name"], "email": user["email"]}

# Question routes
@app.get("/api/questions", response_model=List[QuestionResponse])
async def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
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
    cursor = db.cursor()
    
    cursor.execute(
        "INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)",
        (answer.questionId, answer.userId, answer.answer)
    )
    db.commit()
    
    answer_id = cursor.lastrowid
    
    return AnswerResponse(
        id=answer_id,
        questionId=answer.questionId,
        userId=answer.userId,
        answer=answer.answer
    )

@app.get("/api/answers/{user_id}", response_model=List[AnswerResponse])
async def get_user_answers(user_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute(
        "SELECT * FROM answers WHERE user_id = ?",
        (user_id,)
    )
    answers = cursor.fetchall()
    
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
