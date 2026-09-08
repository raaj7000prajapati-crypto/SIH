# DShield AI — Build Spec
**Falcon Lens | SIH 2026 | PS 26188**

---

## 1. Architecture

```
frontend (React+Vite+Tailwind)
        │  REST/JSON
backend (FastAPI)
   ├── /upload        → save file, create record
   ├── /extract       → OCR + MRZ parse
   ├── /forensics      → ELA tamper score
   ├── /face-match     → embedding similarity
   ├── /risk-score     → aggregate + reason codes
   └── /decision       → officer review, audit log
        │
   SQLite (upgrade → PostgreSQL)
   /storage (encrypted uploads)
```

---

## 2. Repo Structure
```
dshield-ai/
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── upload.py
│   │   ├── extract.py
│   │   ├── forensics.py
│   │   ├── face.py
│   │   ├── risk.py
│   │   └── decision.py
│   ├── services/
│   │   ├── ocr_service.py
│   │   ├── mrz_service.py
│   │   ├── ela_service.py
│   │   ├── face_service.py
│   │   └── risk_engine.py
│   ├── models.py            # SQLAlchemy models
│   ├── db.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Upload.tsx
│   │   │   ├── Review.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/
│   │   └── api/client.ts
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 3. Backend Setup
```bash
mkdir -p dshield-ai/backend && cd dshield-ai/backend
python3 -m venv venv && source venv/bin/activate
pip install fastapi uvicorn python-multipart sqlalchemy \
    paddleocr opencv-python pillow numpy \
    insightface onnxruntime mrz pycryptodome
pip freeze > requirements.txt
```

`main.py` skeleton:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, extract, forensics, face, risk, decision

app = FastAPI(title="DShield AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                    allow_methods=["*"], allow_headers=["*"])

app.include_router(upload.router,    prefix="/api/upload")
app.include_router(extract.router,   prefix="/api/extract")
app.include_router(forensics.router, prefix="/api/forensics")
app.include_router(face.router,      prefix="/api/face")
app.include_router(risk.router,      prefix="/api/risk")
app.include_router(decision.router,  prefix="/api/decision")
```

Run: `uvicorn main:app --reload --port 8000`

---

## 4. Core Logic — Implementation Notes

### 4.1 MRZ Checksum (ICAO 9303)
Weighted mod-10, weights cycle `[7,3,1]` per character. Digits at check-digit positions validate document number, DOB, expiry, and composite. Use `mrz` pip package to parse the two/three lines, then re-verify checksums yourself for the "explainable reason code" (don't just trust the library silently).

### 4.2 OCR + Field Extraction
```python
from paddleocr import PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')
result = ocr.ocr(image_path, cls=True)
# then regex-map lines to fields: Name, DOB, Doc No, Expiry, Nationality
```

### 4.3 Tamper Detection (ELA)
```python
from PIL import Image, ImageChops
def ela(image_path, quality=90):
    im = Image.open(image_path).convert('RGB')
    im.save('resaved.jpg', 'JPEG', quality=quality)
    resaved = Image.open('resaved.jpg')
    diff = ImageChops.difference(im, resaved)
    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    return diff, max_diff  # high max_diff in a small region = suspicious edit
```
Threshold empirically (test against your synthetic tampered set).

### 4.4 Face Match
```python
import insightface
app = insightface.app.FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=0)
faces_doc = app.get(doc_image)
faces_live = app.get(live_image)
similarity = cosine_similarity(faces_doc[0].embedding, faces_live[0].embedding)
```
Similarity > 0.5 (cosine, InsightFace scale) → match.

### 4.5 Risk Engine
```python
def compute_risk(mrz_ok, tamper_score, face_similarity, field_consistent):
    score = 0
    reasons = []
    if not mrz_ok:
        score += 40; reasons.append("MRZ checksum failed")
    if tamper_score > TAMPER_THRESHOLD:
        score += 30; reasons.append("Image tampering detected")
    if face_similarity < 0.5:
        score += 30; reasons.append("Face mismatch")
    if not field_consistent:
        score += 10; reasons.append("Field inconsistency")
    decision = "REJECTED" if score >= 60 else "REVIEW" if score >= 20 else "VERIFIED"
    return {"score": score, "decision": decision, "reasons": reasons}
```

---

## 5. Frontend Setup
```bash
cd dshield-ai
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom lucide-react
npx shadcn@latest init
```
Pages: `Upload.tsx` (capture/upload) → `Review.tsx` (evidence view: doc image, ELA heatmap, face crops, reason codes, risk gauge) → `Dashboard.tsx` (table of all submissions + audit log).

---

## 6. Database Schema (SQLAlchemy)
```python
class Submission(Base):
    id = Column(Integer, primary_key=True)
    doc_type = Column(String)
    doc_image_path = Column(String)
    live_image_path = Column(String)
    extracted_fields = Column(JSON)
    mrz_valid = Column(Boolean)
    tamper_score = Column(Float)
    face_similarity = Column(Float)
    risk_score = Column(Integer)
    decision = Column(String)
    reason_codes = Column(JSON)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 7. Test Data
- MIDV-500 / MIDV-2019 datasets (public, cited in your research slide) for genuine samples
- Manually Photoshop 2-3 copies (change DOB, swap photo) → tampered set
- Keep all data synthetic — never real personal documents

---

## 8. Local Run (dev)
```bash
# terminal 1
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
# terminal 2
cd frontend && npm run dev
```

---

## 9. Deployment Plan

### Option A — Single VM (fastest, good for hackathon demo)
- Provision Ubuntu VM (AWS EC2 / GCP Compute / Azure VM, 2 vCPU 4GB min — more if running face models)
- Install Docker + Docker Compose
- `docker-compose.yml`:
```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    volumes: ["./storage:/app/storage"]
    env_file: .env
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]
```
- `docker-compose up -d --build`
- Point domain → VM IP, add Nginx + Let's Encrypt (certbot) for HTTPS

### Option B — Split hosting (cheaper, scalable)
- Frontend → Vercel/Netlify (static build, `npm run build`)
- Backend → Render/Railway/Fly.io (FastAPI + Docker)
- DB → managed PostgreSQL (Supabase/Neon free tier)
- File storage → S3-compatible bucket (encrypt at rest, presigned URLs)

### Pre-deploy checklist
- [ ] Move SQLite → PostgreSQL
- [ ] Add auth (JWT) for officer dashboard
- [ ] Enforce HTTPS everywhere
- [ ] Encrypt stored images (AES-256), never store raw biometric templates unencrypted
- [ ] Add audit logging table (immutable, append-only)
- [ ] Rate-limit `/upload` endpoint
- [ ] Environment secrets via `.env` / secret manager, not hardcoded
- [ ] Load test face-match endpoint (GPU vs CPU inference time)

---

## 10. Future Work (mention in pitch, not in prototype)
- Live government DB / ICAO PKD integration (requires MoUs, authorized API access)
- Active liveness (blink/head-turn challenge, 3D depth) to beat presentation attacks
- Edge/offline deployment mode
- Full RBAC + SSO for enterprise deployment
