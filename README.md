
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

### Prerequisites
- Node.js (version 14 or higher)
- Python 3.8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory
```bash
cd backend
```

2. Install Python dependencies
```bash
pip install -r requirements.txt
```

3. Run the backend server
```bash
python main.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory (if not already there)
```bash
# Make sure you're in the project root
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:8000`

## Usage

1. Start the backend server first (runs on port 5000)
2. Start the frontend development server (runs on port 8000)
3. Open your browser and go to `http://localhost:8000`
4. Register an account or use the application as a guest
5. Generate interview questions based on your role and experience level
6. Practice answering questions and save your responses
7. Use the AI chatbot for help with difficult concepts or feedback on your answers

## Project Structure

```
interview-wiz-guide/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main backend server file
│   ├── requirements.txt    # Python dependencies
│   └── database/           # SQLite database files
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
└── package.json           # Node.js dependencies
```

## API Endpoints

- **Auth**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login existing user

- **Questions**
  - `GET /api/questions` - Get all questions (with optional category/difficulty filters)

- **Answers**
  - `POST /api/answers` - Save a new answer
  - `GET /api/answers/{user_id}` - Get all answers for a specific user

## Development

The frontend automatically proxies API requests to the backend running on port 5000. This is configured in `vite.config.ts`.

## Troubleshooting

### Port Issues
- Make sure ports 5000 and 8000 are not in use by other applications
- Backend must be running on port 5000 before starting frontend
- If you get CORS errors, ensure the backend CORS settings include the frontend URL

### Database Issues
- The SQLite database will be automatically created in `backend/database/`
- If you encounter database errors, delete the database file and restart the backend

### Dependency Issues
- Make sure all Node.js dependencies are installed: `npm install`
- Make sure all Python dependencies are installed: `pip install -r backend/requirements.txt`
- Verify Python 3.8+ and Node.js are properly installed

## Features in Detail

1. **Question Generation**: Based on role and experience level selection
2. **Answer Writing**: Rich text area for detailed responses
3. **Local Storage**: Answers saved to local SQLite database
4. **File Export**: Download answers as text files to your Downloads folder
5. **User Management**: Registration and login system with password hashing
6. **AI Chat Assistant**: Powered by Google Gemini API for interview help
7. **Responsive UI**: Works on desktop and mobile devices
