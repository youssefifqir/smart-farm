from flask import Flask, jsonify
from flask_cors import CORS
from models import init_db
from routes.disease import bp as disease_bp
from routes.recommendations import bp as recommendations_bp
import os
from dotenv import load_dotenv
import config

# Charger les variables d'environnement
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    env = os.getenv('FLASK_ENV', 'development')
    app.config.from_object(config.config[env])
    
    # CORS
    CORS(app, resources={
        r"/api/*": {"origins": [
            "http://localhost:5173",
            "http://localhost:5432"
        ]}
    })
    
    # Initialiser la base de données
    init_db(app)
    
    # Enregistrer les blueprints
    app.register_blueprint(disease_bp)
    app.register_blueprint(recommendations_bp)
    
    # Routes principales
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            "name": "Smart Farm Backend API",
            "version": "1.0.0",
            "description": "API for plant disease detection and treatment recommendations"
        })
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok", "message": "Smart Farm API is running"})
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    app.run(host=host, port=port, debug=debug)