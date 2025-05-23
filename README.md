
# Interview-Wiz-Guide

A full-stack interview preparation platform that runs locally on your machine. Prepare for technical interviews with AI-powered assistance!

## Features

- Interview question generator with customizable role and experience level
- Answer questions and save your responses locally
- AI-powered chatbot for assistance using Google's Gemini API
- Local authentication system
- Fully local setup (backend + frontend)

## Tech Stack

- **Frontend**: React with Tailwind CSS and shadcn/ui
- **Backend**: Python with FastAPI
- **Database**: SQLite (local)
- **AI**: Google Gemini API

## Setup Instructions

### Backend Setup

1. Make sure you have Python 3.8+ installed
2. Navigate to the backend directory
```bash
cd backend
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the backend server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Make sure you have Node.js installed
2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Register an account or use the application as a guest
2. Generate interview questions based on your role and experience level
3. Practice answering questions and save your responses
4. Use the AI chatbot for help with difficult concepts or feedback on your answers

## API Endpoints

- **Auth**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login existing user

- **Questions**
  - `GET /api/questions` - Get all questions (with optional category/difficulty filters)

- **Answers**
  - `POST /api/answers` - Save a new answer
  - `GET /api/answers/{user_id}` - Get all answers for a specific user
