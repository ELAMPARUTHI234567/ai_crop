from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, index=True)
    predicted_disease = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String)
    
    follow_ups = relationship("FollowUp", back_populates="diagnosis")

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_id = Column(Integer, ForeignKey("diagnoses.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String)
    notes = Column(String, nullable=True)
    
    diagnosis = relationship("Diagnosis", back_populates="follow_ups")
