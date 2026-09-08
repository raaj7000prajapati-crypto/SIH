from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Submission

router = APIRouter()

@router.post("/{submission_id}")
async def run_forensics(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Mock ELA (Error Level Analysis) tamper detection
    tamper_score = 15.0 # Low score meaning likely genuine
    
    submission.tamper_score = tamper_score
    db.commit()
    
    return {"message": "Forensics complete", "tamper_score": tamper_score}
