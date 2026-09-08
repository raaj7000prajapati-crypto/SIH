# DShield AI — Falcon Lens 🛡️

**Smart India Hackathon 2026 | Problem Statement: 26188**

DShield AI is an intelligent document verification and forgery detection system designed to assist security and immigration officers. It uses advanced AI models to extract data, analyze document authenticity, and perform facial matching in real-time.

---

## 🚀 Features

- **Document Parsing (OCR & MRZ):** Extracts text and validates MRZ (Machine Readable Zone) checksums using ICAO 9303 standards.
- **Forgery Detection (ELA):** Analyzes the image using Error Level Analysis to detect tampered regions or Photoshop edits.
- **Facial Verification:** Compares the face on the ID document with a live capture using cosine similarity on high-dimensional embeddings.
- **Risk Scoring Engine:** Aggregates anomalies and generates a comprehensive risk score with explainable reason codes.
- **Officer Dashboard:** A centralized, responsive dashboard for officers to review flagged documents and make final verification decisions.

---

## 🏗️ Architecture

- **Frontend:** React + Vite + Tailwind CSS + Lucide Icons
- **Backend:** FastAPI (Python 3.11)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **ML Stack:** PaddleOCR, OpenCV, InsightFace, Pillow, ONNXRuntime
- **Infrastructure:** Docker & Docker Compose (Render + Vercel Deployment)

---

## 🛠️ Local Development Setup

You can run both the frontend and backend locally for development.

### 1. Start the Backend API
```bash
cd dshield-ai/backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The backend API will run on `http://localhost:8000`.

### 2. Start the Frontend UI
Open a new terminal window:
```bash
cd dshield-ai/frontend
npm install
npm run dev
```
The frontend UI will be accessible at `http://localhost:5173`.

---

## 🐳 Deployment (Docker / Production)

The project is configured for a split-hosting serverless and containerized deployment (e.g., **Vercel** for Frontend and **Render** for Backend).

### Backend Deployment (Render via Docker)
1. Push the repository to GitHub.
2. Link the repository to Render.
3. Render will automatically detect the `render.yaml` file and use the `backend/Dockerfile` to spin up the FastAPI service.
4. Set the `DATABASE_URL` (PostgreSQL) and `CORS_ORIGINS` (your frontend URL) in the Render environment variables.

### Frontend Deployment (Vercel)
1. Import the repository in Vercel.
2. Set the Root Directory to `frontend`.
3. Add the Environment Variable: `VITE_API_URL` pointing to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).
4. Deploy! Vercel handles the React Router configuration automatically via `vercel.json`.

---

## 🧪 Testing Data
- Use **MIDV-500 / MIDV-2019** datasets for genuine samples.
- Use Photoshop to intentionally manipulate dates of birth or swap photos to test the Error Level Analysis (ELA) capabilities.
- *Note: Do not use real personal identification documents for testing purposes.*

---

*Built with ❤️ for SIH 2026 by Team Falcon Lens.*
