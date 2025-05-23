
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

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed on your machine

### Run with Docker Compose
```bash
# Clone the repository
git clone <your-repo-url>
cd interview-wiz-guide

# Build and start the application
docker-compose up -d

# The application will be available at http://localhost:3000
```

### Build Docker Image Manually
```bash
# Make the build script executable
chmod +x docker-build.sh

# Run the build script
./docker-build.sh

# Run the container
docker run -p 3000:80 -v $(pwd)/backend/database:/app/backend/database interview-wiz-guide
```

## Manual Setup (Alternative)

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

## Docker Configuration

The Docker setup includes:
- **nginx**: Serves the frontend and proxies API requests to the backend
- **FastAPI**: Python backend running on port 8000 (internal)
- **SQLite**: Database persisted in a Docker volume
- **Supervisor**: Process manager to run both nginx and FastAPI

All services run on port 3000 externally, with nginx handling the routing between frontend and backend.

## API Endpoints

- **Auth**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login existing user

- **Questions**
  - `GET /api/questions` - Get all questions (with optional category/difficulty filters)

- **Answers**
  - `POST /api/answers` - Save a new answer
  - `GET /api/answers/{user_id}` - Get all answers for a specific user

## Troubleshooting

### Docker Issues
- If you get permission errors, make sure Docker is running and you have proper permissions
- For database persistence issues, check the volume mounting in docker-compose.yml
- Check logs with: `docker-compose logs`

### Manual Setup Issues
- Make sure all dependencies are installed correctly
- Check that ports 3000, 5173, and 8000 are not in use by other applications
- Verify that Python 3.8+ and Node.js are properly installed
