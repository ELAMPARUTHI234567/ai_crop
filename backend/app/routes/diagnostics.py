from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Diagnosis, FollowUp
from app.ml.inference import model_instance
from app.retrieval.evidence import get_evidence
import os
import shutil
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/diagnose")
async def create_diagnosis(
    file: UploadFile = File(...),
    crop: str = Form(None),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG/PNG)")
        
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Run Inference
    try:
        result = model_instance.predict(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    diagnosis = Diagnosis(
        crop=crop,
        predicted_disease=result["prediction"],
        confidence=result["confidence"],
        image_path=file_path
    )
    
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    
    evidence = get_evidence(diagnosis.predicted_disease, crop)
    
    return {
        "id": diagnosis.id,
        "demo_mode": result.get("demo_mode", False),
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "top_3": result.get("top_3", []),
        "evidence": evidence,
        "image_path": file_path,
        "message": result.get("error", None)
    }

@router.get("/diagnoses")
def get_diagnoses(db: Session = Depends(get_db)):
    return db.query(Diagnosis).order_by(Diagnosis.timestamp.desc()).all()

@router.get("/diagnoses/{id}")
def get_diagnosis(id: int, db: Session = Depends(get_db)):
    diagnosis = db.query(Diagnosis).filter(Diagnosis.id == id).first()
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
        
    evidence = get_evidence(diagnosis.predicted_disease, diagnosis.crop)
    
    return {
        "diagnosis": diagnosis,
        "follow_ups": diagnosis.follow_ups,
        "evidence": evidence
    }

@router.post("/diagnoses/{id}/follow-up")
async def add_follow_up(
    id: int,
    file: UploadFile = File(...),
    notes: str = Form(None),
    db: Session = Depends(get_db)
):
    diagnosis = db.query(Diagnosis).filter(Diagnosis.id == id).first()
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
        
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    follow_up = FollowUp(
        diagnosis_id=id,
        image_path=file_path,
        notes=notes
    )
    
    db.add(follow_up)
    db.commit()
    db.refresh(follow_up)
    
    return follow_up
