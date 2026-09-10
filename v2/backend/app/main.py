from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
import uvicorn
import datetime

# Dummy schemas
class OCRData(BaseModel):
    name: str = ""
    passport_number: str = ""
    dob: str = ""
    nationality: str = ""
    expiry: str = ""
    visa_number: str = ""
    visa_type: str = ""
    entry_type: str = ""
    stay_duration: str = ""

class ValidationData(BaseModel):
    status: str
    issues: List[str]

class TamperingData(BaseModel):
    score: int
    status: str
    regions: List[str]

class FaceData(BaseModel):
    similarity: float
    status: str

class DatabaseData(BaseModel):
    status: str

class RiskData(BaseModel):
    score: int
    level: str

class ScreeningResult(BaseModel):
    id: str
    document_type: str
    ocr: OCRData
    validation: ValidationData
    tampering: TamperingData
    face: FaceData
    database: DatabaseData
    risk: RiskData
    timestamp: str

app = FastAPI(title="IDENTRA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/screen", response_model=ScreeningResult)
async def screen_document(
    document: UploadFile = File(...),
    document_type: str = Form(...),
    demo_mode: str = Form(None)
):
    # Dummy processing based on demo_mode
    if demo_mode == "genuine":
        return ScreeningResult(
            id="SCR-1001",
            document_type=document_type,
            ocr=OCRData(name="RAHUL KUMAR", passport_number="P1234567", dob="12/05/2004", nationality="INDIAN", expiry="09/01/2034"),
            validation=ValidationData(status="PASS", issues=[]),
            tampering=TamperingData(score=12, status="PASS", regions=[]),
            face=FaceData(similarity=94.8, status="MATCH"),
            database=DatabaseData(status="VALID"),
            risk=RiskData(score=18, level="LOW"),
            timestamp=datetime.datetime.now().isoformat()
        )
    elif demo_mode == "tampered":
        return ScreeningResult(
            id="SCR-1002",
            document_type=document_type,
            ocr=OCRData(name="RAHUL KUMAR", passport_number="P1234567", dob="12/05/2004", nationality="INDIAN", expiry="09/01/2034"),
            validation=ValidationData(status="WARNING", issues=["DOB anomaly detected"]),
            tampering=TamperingData(score=82, status="HIGH", regions=["Photograph", "DOB"]),
            face=FaceData(similarity=92.1, status="MATCH"),
            database=DatabaseData(status="VALID"),
            risk=RiskData(score=82, level="HIGH"),
            timestamp=datetime.datetime.now().isoformat()
        )
    elif demo_mode == "impersonation":
        return ScreeningResult(
            id="SCR-1003",
            document_type=document_type,
            ocr=OCRData(name="RAHUL KUMAR", passport_number="P1234567", dob="12/05/2004", nationality="INDIAN", expiry="09/01/2034"),
            validation=ValidationData(status="PASS", issues=[]),
            tampering=TamperingData(score=15, status="PASS", regions=[]),
            face=FaceData(similarity=21.4, status="MISMATCH"),
            database=DatabaseData(status="VALID"),
            risk=RiskData(score=95, level="HIGH"),
            timestamp=datetime.datetime.now().isoformat()
        )
    else:
        # Default fallback
        return ScreeningResult(
            id="SCR-1000",
            document_type=document_type,
            ocr=OCRData(name="UNKNOWN", passport_number="P0000000", dob="01/01/2000", nationality="UNKNOWN", expiry="01/01/2030"),
            validation=ValidationData(status="PASS", issues=[]),
            tampering=TamperingData(score=50, status="WARNING", regions=[]),
            face=FaceData(similarity=50.0, status="REVIEW"),
            database=DatabaseData(status="VALID"),
            risk=RiskData(score=50, level="REVIEW"),
            timestamp=datetime.datetime.now().isoformat()
        )

@app.get("/api/history")
async def get_history():
    return [
        {
            "id": "SCR-1024",
            "date": "2026-09-09",
            "document_type": "Passport",
            "document_number": "P1234567",
            "risk_score": 18,
            "status": "LOW RISK",
            "officer": "Officer-01"
        },
        {
            "id": "SCR-1025",
            "date": "2026-09-09",
            "document_type": "Passport",
            "document_number": "P9988776",
            "risk_score": 82,
            "status": "HIGH RISK",
            "officer": "Officer-01"
        }
    ]

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
