# Routes package initialization
from flask import Blueprint

def register_routes(app):
    """Register all route blueprints with the Flask app"""
    from .disease import bp as disease_bp
    from .recommendations import bp as recommendations_bp
    
    app.register_blueprint(disease_bp)
    app.register_blueprint(recommendations_bp)
    
    print("Routes enregistrées avec succès")