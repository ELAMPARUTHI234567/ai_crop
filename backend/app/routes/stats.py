from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.database.models import Diagnosis

router = APIRouter()

@router.get("/model/metrics")
def get_model_metrics():
    # In a real scenario, this would load the test results saved during training
    return {
        "accuracy": 0.0,
        "precision": 0.0,
        "recall": 0.0,
        "f1": 0.0,
        "note": "Model not trained. Metrics unavailable."
    }

@router.get("/stats/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_diagnoses = db.query(Diagnosis).count()
    
    # Get commonly detected diseases
    common_diseases = db.query(
        Diagnosis.predicted_disease, 
        func.count(Diagnosis.id).label('count')
    ).group_by(Diagnosis.predicted_disease).order_by(func.count(Diagnosis.id).desc()).limit(5).all()
    
    # Confidence distribution (rough bins)
    # SQLite doesn't natively support easy binning, we'll fetch basic avg if possible or compute in python
    confidences = db.query(Diagnosis.confidence).all()
    bins = {"High (>=0.8)": 0, "Medium (0.5-0.79)": 0, "Low (<0.5)": 0}
    
    for c in confidences:
        val = c[0]
        if val >= 0.8:
            bins["High (>=0.8)"] += 1
        elif val >= 0.5:
            bins["Medium (0.5-0.79)"] += 1
        else:
            bins["Low (<0.5)"] += 1
            
    return {
        "total_diagnoses": total_diagnoses,
        "common_diseases": [{"disease": d[0], "count": d[1]} for d in common_diseases],
        "confidence_distribution": bins
    }
