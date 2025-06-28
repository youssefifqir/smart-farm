from app import create_app

# Créer l'instance de l'application
app = create_app()

from models import db

# Importer tous les modèles
from models.plant_diseases import PlantDisease
from models.recommendations import Recommendation

with app.app_context():
    print("Suppression des anciennes tables...")
    db.drop_all()
    
    print("Création des nouvelles tables...")
    db.create_all()
    
    print("Base de données recréée avec succès!")
    print("Tables créées:")
    print("- plant_diseases")
    print("- recommendations")