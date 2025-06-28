# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
#     API_KEY = os.getenv("API_KEY")
#     CROP_HEALTH_URL = "https://api.crop.health/v1/identify"
    
   
#     # filepath: c:\Users\hp\smart-farm\smart-farm_backend-ms2\config.py
#     MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_models', 'plant_disease_model.joblib')
    
# class DevelopmentConfig(Config):
#     DEBUG = True
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///smart_farm_dev.db'

# class ProductionConfig(Config):
#     DEBUG = False
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

# config = {
#     'development': DevelopmentConfig,
#     'production': ProductionConfig,
#     'default': DevelopmentConfig
# }


import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configuration de base
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Base de données
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///smart_farm.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # APIs externes
    CROP_HEALTH_API_KEY = os.getenv('CROP_HEALTH_API_KEY')  # Changé le nom pour plus de clarté
    CROP_HEALTH_URL = "https://crop.kindwise.com/api/v1/identification"
    
    # Gemini API
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Configuration uploads
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,  
    'testing': TestingConfig,
    'default': DevelopmentConfig
}