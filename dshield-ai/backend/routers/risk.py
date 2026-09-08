from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Submission

router = APIRouter()

TAMPER_THRESHOLD = 50.0

@router.post("/{submission_id}")
async def compute_risk(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    score = 0
    reasons = []
    
    if submission.mrz_valid is False:
        score += 40
        reasons.append("MRZ checksum failed")
        
    if submission.tamper_score is not None and submission.tamper_score > TAMPER_THRESHOLD:
        score += 30
        reasons.append("Image tampering detected")
        
    if submission.face_similarity is not None and submission.face_similarity < 0.5:
        score += 30
        reasons.append("Face mismatch")
        
    # Mock field consistency
    field_consistent = True
    if not field_consistent:
        score += 10
        reasons.append("Field inconsistency")
        
    decision = "REJECTED" if score >= 60 else "REVIEW" if score >= 20 else "VERIFIED"
    
    submission.risk_score = score
    submission.decision = decision
    submission.reason_codes = reasons
    db.commit()
    
    return {
        "message": "Risk computed", 
        "score": score, 
        "decision": decision, 
        "reasons": reasons
    }
