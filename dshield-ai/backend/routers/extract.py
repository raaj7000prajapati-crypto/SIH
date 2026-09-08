from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import Submission

router = APIRouter()

@router.post("/{submission_id}")
async def extract_data(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Mock OCR and MRZ extraction
    mock_fields = {
        "name": "JOHN DOE",
        "dob": "1990-01-01",
        "doc_no": "A1234567",
        "expiry": "2030-01-01",
        "nationality": "USA"
    }
    
    submission.extracted_fields = mock_fields
    submission.mrz_valid = True
    db.commit()
    
    return {"message": "Data extracted", "fields": mock_fields, "mrz_valid": True}
