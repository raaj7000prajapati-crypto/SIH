import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, extract, forensics, face, risk, decision
from db import engine, Base
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DShield AI")

cors_origins_str = os.getenv("CORS_ORIGINS", "*")
origins = cors_origins_str.split(",") if cors_origins_str != "*" else ["*"]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(upload.router,    prefix="/api/upload")
app.include_router(extract.router,   prefix="/api/extract")
app.include_router(forensics.router, prefix="/api/forensics")
app.include_router(face.router,      prefix="/api/face")
app.include_router(risk.router,      prefix="/api/risk")
app.include_router(decision.router,  prefix="/api/decision")

@app.get("/")
def read_root():
    return {"message": "DShield AI Backend is running"}
