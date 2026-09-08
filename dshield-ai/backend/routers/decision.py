from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from db import get_db
from models import Submission

router = APIRouter()

@router.get("/")
async def list_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).order_by(Submission.created_at.desc()).all()
    return submissions

@router.get("/{submission_id}")
async def get_submission(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.post("/{submission_id}/review")
async def review_submission(submission_id: int, decision: str, reviewer: str, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    submission.decision = decision
    submission.reviewed_by = reviewer
    submission.reviewed_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Submission reviewed", "decision": decision}
