# IDENTRA — AI-Based Fake Identity & Document Screening System

SIH Problem Statement ID: 26188

A prototype platform designed to assist authorized border and security officers in quickly analyzing identity documents for tampering and risk assessment.

## Project Structure
- `/frontend` - React Vite frontend with TailwindCSS
- `/backend` - FastAPI backend application
- `/ai` - (Pending implementation) AI services integration
- `/database` - (Pending) Supabase schemas

## Setup & Running

### Environment Variables
1. Copy `.env.example` to `.env` in the root directory.
2. Update the `SUPABASE_URL` and `SUPABASE_KEY` (if you plan to use the database features).

### Backend (FastAPI)
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt` (or install manually as we did)
5. Run the server: `uvicorn app.main:app --reload`
The backend will run on `http://localhost:8000`.

### Frontend (React)
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
The frontend will run on `http://localhost:5173`.

## Demo Mode
The application includes a Demo Mode tailored for hackathon presentations, allowing demonstration of the end-to-end workflow without needing real external government APIs or expensive AI services running locally. 
Navigate to `New Screening` and select one of the Demo options to see Genuine, Tampered, or Impersonation analysis.

## Limitations
- This is a hackathon prototype, NOT a production system.
- Risk scores and tampering detection results are AI-assisted estimates to aid human officers, and do not provide 100% certainty.
- Real deployment requires proper biometric liveness detection and access to authorized government databases.
