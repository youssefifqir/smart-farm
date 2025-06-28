
# filepath: c:\Users\hp\smart-farm\smart-farm_backend-ms2\models\recommendations.py
from . import db
from datetime import datetime

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    disease_id = db.Column(db.Integer, db.ForeignKey('plant_diseases.id'), nullable=False)
    treatment_type = db.Column(db.String(128), nullable=False)
    treatment_description = db.Column(db.Text, nullable=True)
    recommended_products = db.Column(db.PickleType, nullable=True)  # Liste de produits
    application_method = db.Column(db.String(128), nullable=True)
    dosage = db.Column(db.String(64), nullable=True)
    frequency = db.Column(db.String(64), nullable=True)
    prevention_tips = db.Column(db.PickleType, nullable=True)  # Liste de conseils
    urgency_level = db.Column(db.String(64), nullable=True)
    estimated_recovery_time = db.Column(db.String(64), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Recommendation {self.treatment_type} for disease_id {self.disease_id}>"