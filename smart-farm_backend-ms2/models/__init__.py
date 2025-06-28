# # from flask_sqlalchemy import SQLAlchemy

# # db = SQLAlchemy()

# # def init_db(app):
# #     """Initialize database with Flask app"""
# #     db.init_app(app)
    
# #     with app.app_context():
# #         db.create_all()
# #         print("Base de données initialisée avec succès")

# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# def init_db(app):
#     """Initialize database with Flask app"""
#     db.init_app(app)
    
#     with app.app_context():
#         db.create_all()
#         print("Base de données initialisée avec succès")

# # Import des modèles pour les rendre disponibles
# from .plant_diseases import PlantDisease
# from .recommendations import Recommendation

# __all__ = ['db', 'init_db', 'PlantDisease', 'Recommendation']
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Initialiser la base de données avec l'application Flask"""
    db.init_app(app)
    
    with app.app_context():
        # Importer les modèles pour qu'ils soient créés
        from .plant_diseases import PlantDisease
        from .recommendations import Recommendation
        
        # Créer toutes les tables
        db.create_all()
        
    return db