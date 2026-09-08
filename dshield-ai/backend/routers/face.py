from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Submission

router = APIRouter()

@router.post("/{submission_id}")
async def face_match(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Mock face matching between doc and live photo
    similarity = 0.85 # High similarity meaning it's a match
    
    submission.face_similarity = similarity
    db.commit()
    
    return {"message": "Face match complete", "similarity": similarity}
