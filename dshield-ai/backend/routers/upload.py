from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from db import get_db
from models import Submission
import os
import shutil

router = APIRouter()

STORAGE_DIR = "./storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

@router.post("/")
async def upload_document(
    doc_file: UploadFile = File(...),
    live_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    doc_path = os.path.join(STORAGE_DIR, doc_file.filename)
    live_path = os.path.join(STORAGE_DIR, live_file.filename)
    
    with open(doc_path, "wb") as f:
        shutil.copyfileobj(doc_file.file, f)
    with open(live_path, "wb") as f:
        shutil.copyfileobj(live_file.file, f)
        
    submission = Submission(
        doc_type="passport", # default for now
        doc_image_path=doc_path,
        live_image_path=live_path,
        decision="PENDING"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return {"message": "Files uploaded successfully", "id": submission.id}
