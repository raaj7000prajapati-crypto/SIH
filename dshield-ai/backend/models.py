from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from datetime import datetime
from db import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
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
