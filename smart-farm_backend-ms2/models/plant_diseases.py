
# filepath: c:\Users\hp\smart-farm\smart-farm_backend-ms2\models\plant_diseases.py
from . import db
from datetime import datetime

class PlantDisease(db.Model):
    __tablename__ = 'plant_diseases'

    id = db.Column(db.Integer, primary_key=True)
    disease_name = db.Column(db.String(128), nullable=False)
    plant_type = db.Column(db.String(128), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    severity = db.Column(db.String(64), default='unknown')
    image_path = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation avec Recommendation
    recommendations = db.relationship('Recommendation', backref='plant_disease', lazy=True)

    def __repr__(self):
        return f"<PlantDisease {self.disease_name} ({self.plant_type})>"