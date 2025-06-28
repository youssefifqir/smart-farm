
# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.utils import secure_filename
# import os
# import uuid
# from datetime import datetime
# from models import db
# from models.plant_diseases import PlantDisease
# from models.recommendations import Recommendation
# from ml_models import predict_disease
# from services.gemini_service import GeminiService

# bp = Blueprint('disease', __name__, url_prefix='/api/disease')

# # Configuration pour l'upload de fichiers
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
# MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# def allowed_file(filename):
#     """Vérifier si le fichier est autorisé"""
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def save_uploaded_file(file):
#     """Sauvegarder le fichier uploadé"""
#     try:
#         if not file or file.filename == '':
#             return None
            
#         # Créer le dossier uploads s'il n'existe pas
#         upload_folder = os.path.join(current_app.root_path, 'uploads')
#         os.makedirs(upload_folder, exist_ok=True)
        
#         # Générer un nom de fichier unique
#         filename = secure_filename(file.filename)
#         unique_filename = f"{uuid.uuid4()}_{filename}"
#         file_path = os.path.join(upload_folder, unique_filename)
        
#         # Sauvegarder le fichier
#         file.save(file_path)
        
#         return file_path
        
#     except Exception as e:
#         print(f"Erreur lors de la sauvegarde du fichier: {e}")
#         return None

# @bp.route('/detect', methods=['POST'])
# def detect_disease():
#     """Endpoint principal pour la détection de maladies"""
#     try:
#         # Vérifier si un fichier est présent
#         if 'image' not in request.files:
#             return jsonify({
#                 'error': 'Aucune image fournie',
#                 'success': False
#             }), 400
        
#         file = request.files['image']
        
#         # Vérifier si le fichier est valide
#         if not allowed_file(file.filename):
#             return jsonify({
#                 'error': 'Format de fichier non supporté. Utilisez: PNG, JPG, JPEG, GIF, BMP, TIFF',
#                 'success': False
#             }), 400
        
#         # Vérifier la taille du fichier
#         file.seek(0, os.SEEK_END)
#         file_length = file.tell()
#         if file_length > MAX_FILE_SIZE:
#             return jsonify({
#                 'error': 'Fichier trop volumineux. Taille maximale: 16MB',
#                 'success': False
#             }), 400
#         file.seek(0)
        
#         # Sauvegarder le fichier
#         file_path = save_uploaded_file(file)
#         if not file_path:
#             return jsonify({
#                 'error': 'Erreur lors de la sauvegarde du fichier',
#                 'success': False
#             }), 500
        
#         # Détecter la maladie avec le modèle ML
#         detection_result = predict_disease(file_path)
        
#         if not detection_result:
#             # Nettoyer le fichier temporaire
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#             return jsonify({
#                 'error': 'Impossible de détecter la maladie',
#                 'success': False
#             }), 500
        
#         # Obtenir les recommandations de Gemini
#         gemini_service = GeminiService()
#         gemini_response = gemini_service.get_treatment_recommendations(detection_result)
        
#         # Créer un enregistrement dans la base de données
#         plant_disease = PlantDisease(
#             disease_name=detection_result['disease_name'],
#             confidence_score=detection_result['confidence_score'],
#             plant_type=detection_result['plant_type'],
#             image_path=file_path
#         )
        
#         db.session.add(plant_disease)
#         db.session.flush()  # Pour obtenir l'ID
        
#         # Sauvegarder les recommandations
#         recommendation = Recommendation(
#             disease_id=plant_disease.id,
#             treatment_type=gemini_response.get('treatment_type', 'Général'),
#             treatment_description=gemini_response.get('description', ''),
#             recommended_products=gemini_response.get('products', []),
#             application_method=gemini_response.get('application_method', ''),
#             dosage=gemini_response.get('dosage', ''),
#             frequency=gemini_response.get('frequency', ''),
#             prevention_tips=gemini_response.get('prevention_tips', []),
#             urgency_level=gemini_response.get('urgency_level', 'Moyenne'),
#             estimated_recovery_time=gemini_response.get('recovery_time', '')
#         )
        
#         db.session.add(recommendation)
#         db.session.commit()
        
#         # Préparer la réponse
#         response_data = {
#             'success': True,
#             'detection': {
#                 'id': plant_disease.id,
#                 'disease_name': plant_disease.disease_name,
#                 'confidence_score': plant_disease.confidence_score,
#                 'plant_type': plant_disease.plant_type,
#                 'created_at': plant_disease.created_at.isoformat()
#             },
#             'recommendation': {
#                 'id': recommendation.id,
#                 'treatment_type': recommendation.treatment_type,
#                 'description': recommendation.treatment_description,
#                 'products': recommendation.recommended_products,
#                 'application_method': recommendation.application_method,
#                 'dosage': recommendation.dosage,
#                 'frequency': recommendation.frequency,
#                 'prevention_tips': recommendation.prevention_tips,
#                 'urgency_level': recommendation.urgency_level,
#                 'recovery_time': recommendation.estimated_recovery_time
#             }
#         }
        
#         return jsonify(response_data), 200
        
#     except Exception as e:
#         # En cas d'erreur, nettoyer le fichier si il existe
#         if 'file_path' in locals() and os.path.exists(file_path):
#             os.remove(file_path)
        
#         print(f"Erreur dans detect_disease: {e}")
#         return jsonify({
#             'error': 'Erreur interne du serveur',
#             'success': False
#         }), 500

# @bp.route('/history', methods=['GET'])
# def get_detection_history():
#     """Obtenir l'historique des détections"""
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)
        
#         # Limiter le nombre d'éléments par page
#         per_page = min(per_page, 100)
        
#         detections = PlantDisease.query.order_by(
#             PlantDisease.created_at.desc()
#         ).paginate(
#             page=page, 
#             per_page=per_page, 
#             error_out=False
#         )
        
#         history = []
#         for detection in detections.items:
#             recommendation = Recommendation.query.filter_by(
#                 disease_id=detection.id
#             ).first()
            
#             detection_data = {
#                 'id': detection.id,
#                 'disease_name': detection.disease_name,
#                 'confidence_score': detection.confidence_score,
#                 'plant_type': detection.plant_type,
#                 'created_at': detection.created_at.isoformat(),
#                 'recommendation': {
#                     'treatment_type': recommendation.treatment_type if recommendation else None,
#                     'urgency_level': recommendation.urgency_level if recommendation else None,
#                     'recovery_time': recommendation.estimated_recovery_time if recommendation else None
#                 } if recommendation else None
#             }
#             history.append(detection_data)
        
#         return jsonify({
#             'success': True,
#             'history': history,
#             'pagination': {
#                 'page': page,
#                 'per_page': per_page,
#                 'total': detections.total,
#                 'pages': detections.pages,
#                 'has_next': detections.has_next,
#                 'has_prev': detections.has_prev
#             }
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_detection_history: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la récupération de l\'historique',
#             'success': False
#         }), 500

# @bp.route('/<int:detection_id>', methods=['GET'])
# def get_detection_details(detection_id):
#     """Obtenir les détails d'une détection spécifique"""
#     try:
#         detection = PlantDisease.query.get_or_404(detection_id)
#         recommendation = Recommendation.query.filter_by(
#             disease_id=detection.id
#         ).first()
        
#         response_data = {
#             'success': True,
#             'detection': {
#                 'id': detection.id,
#                 'disease_name': detection.disease_name,
#                 'confidence_score': detection.confidence_score,
#                 'plant_type': detection.plant_type,
#                 'created_at': detection.created_at.isoformat()
#             },
#             'recommendation': {
#                 'id': recommendation.id,
#                 'treatment_type': recommendation.treatment_type,
#                 'description': recommendation.treatment_description,
#                 'products': recommendation.recommended_products,
#                 'application_method': recommendation.application_method,
#                 'dosage': recommendation.dosage,
#                 'frequency': recommendation.frequency,
#                 'prevention_tips': recommendation.prevention_tips,
#                 'urgency_level': recommendation.urgency_level,
#                 'recovery_time': recommendation.estimated_recovery_time,
#                 'created_at': recommendation.created_at.isoformat()
#             } if recommendation else None
#         }
        
#         return jsonify(response_data), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_detection_details: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la récupération des détails',
#             'success': False
#         }), 500

# routes/disease.py - Corrections à apporter

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import logging
from services.disease_detection import DiseaseDetectionService
from services.gemini_service import GeminiService
from models import db  # AJOUT: Import manquant
from models.plant_diseases import PlantDisease  # AJOUT: Import manquant
from models.recommendations import Recommendation  # AJOUT: Import manquant
from config import Config

from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func
from datetime import datetime, timedelta


# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bp = Blueprint('disease', __name__, url_prefix='/api/disease')

# Initialiser les services
disease_service = DiseaseDetectionService()
gemini_service = GeminiService(api_key=Config.GEMINI_API_KEY)

@bp.route('/detect', methods=['POST'])
def analyze_disease():
    """
    Endpoint principal pour analyser une maladie de plante
    Workflow: Image -> Crop.health API -> Gemini -> Recommandations
    """
    try:
        # Vérifier qu'un fichier a été envoyé
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'Aucun fichier image fourni'
            }), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'Aucun fichier sélectionné'
            }), 400
        
        # Paramètres optionnels
        latitude = request.form.get('latitude', type=float)
        longitude = request.form.get('longitude', type=float)
        datetime_str = request.form.get('datetime')
        
        logger.info(f"Analyse d'image reçue: {image_file.filename}")
        
        # ÉTAPE 1: Détection de maladie via Crop.health API
        logger.info("ÉTAPE 1: Détection de maladie via Crop.health")
        detection_result = disease_service.predict_disease(
        image_file=image_file,
        latitude=request.form.get('latitude'),
        longitude=request.form.get('longitude'),
        dt=request.form.get('datetime')
        )
        
        # Vérifier si la détection a échoué
        if not detection_result.get('success', True):
            return jsonify({
                'success': False,
                'error': detection_result.get('error', 'Erreur lors de la détection'),
                'stage': 'detection'
            }), 500
        
        # ÉTAPE 1.5: Sauvegarder la maladie détectée en base de données
        logger.info("ÉTAPE 1.5: Sauvegarde de la maladie détectée")
        try:
            plant_disease = PlantDisease(
                disease_name=detection_result['disease_name'],
                plant_type=detection_result['plant_type'],
                confidence_score=detection_result['confidence_score'],
                severity=detection_result.get('severity', 'unknown'),
                image_path=detection_result.get('image_path')
            )
            db.session.add(plant_disease)
            db.session.commit()
            disease_id = plant_disease.id
            logger.info(f"Maladie sauvegardée avec ID: {disease_id}")
            
        except Exception as db_error:
            logger.error(f"Erreur lors de la sauvegarde: {str(db_error)}")
            db.session.rollback()
            # Continuer sans sauvegarder si erreur DB
            disease_id = None
        
        # ÉTAPE 2: Génération de recommandations via Gemini
        logger.info("ÉTAPE 2: Génération de recommandations via Gemini")
        try:
            # Préparer les données pour Gemini
            disease_info = {
                'disease_name': detection_result['disease_name'],
                'plant_type': detection_result['plant_type'],
                'confidence': detection_result['confidence_score'],
                'details': detection_result.get('details', {})
            }
            
            # Générer les recommandations
            recommendations = gemini_service.get_treatment_recommendations(disease_info)
            
            # ÉTAPE 2.5: Sauvegarder la recommandation si on a un disease_id
            if disease_id:
                try:
                    recommendation = Recommendation(
                        disease_id=disease_id,
                        treatment_type=recommendations.get('treatment_type', 'Général'),
                        treatment_description=recommendations.get('description', ''),
                        recommended_products=recommendations.get('products', []),
                        application_method=recommendations.get('application_method', ''),
                        dosage=recommendations.get('dosage', ''),
                        frequency=recommendations.get('frequency', ''),
                        prevention_tips=recommendations.get('prevention_tips', []),
                        urgency_level=recommendations.get('urgency_level', 'Moyenne'),
                        estimated_recovery_time=recommendations.get('recovery_time', '')
                    )
                    db.session.add(recommendation)
                    db.session.commit()
                    logger.info("Recommandation sauvegardée avec succès")
                    
                except Exception as rec_error:
                    logger.error(f"Erreur lors de la sauvegarde de la recommandation: {str(rec_error)}")
                    db.session.rollback()
            
        except Exception as gemini_error:
            logger.error(f"Erreur Gemini: {str(gemini_error)}")
            # En cas d'erreur Gemini, on peut toujours retourner les résultats de détection
            recommendations = {
                'treatment_type': 'Information limitée',
                'description': f"Maladie détectée: {detection_result['disease_name']}",
                'products': ['Consultation recommandée'],
                'application_method': 'Contactez un spécialiste',
                'dosage': 'À déterminer',
                'frequency': 'À déterminer',
                'prevention_tips': ['Surveillez l\'évolution de la maladie'],
                'urgency_level': 'Moyenne',
                'recovery_time': 'Variable',
                'gemini_error': str(gemini_error)
            }
        
        # ÉTAPE 3: Assemblage de la réponse finale
        final_response = {
            'success': True,
            'timestamp': detection_result['created_at'],
            'detection': {
                'id': disease_id,  # AJOUT: ID de la maladie sauvegardée
                'disease_name': detection_result['disease_name'],
                'plant_type': detection_result['plant_type'],
                'confidence_score': detection_result['confidence_score'],
                'details': detection_result.get('details', {}),
                'created_at': plant_disease.created_at.isoformat() if plant_disease and plant_disease.created_at else None  

            },
            'recommendation': recommendations,
            'metadata': {
                'api_used': 'Crop.health + Gemini',
                'processing_stages': ['detection', 'database_save', 'recommendation_generation'],
                'coordinates': {
                    'latitude': latitude,
                    'longitude': longitude
                } if latitude and longitude else None,
                'saved_to_database': disease_id is not None
            }
        }
        
        logger.info(f"Analyse complète réussie pour: {detection_result['disease_name']}")
        return jsonify(final_response), 200
        
    except Exception as e:
        logger.error(f"Erreur générale lors de l'analyse: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Erreur interne du serveur',
            'details': str(e),
            'stage': 'general'
        }), 500


        
# @bp.route('/history', methods=['GET'])
# def get_detection_history():
#     """Obtenir l'historique des détections"""
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)
        
#         # Limiter le nombre d'éléments par page
#         per_page = min(per_page, 100)
        
#         detections = PlantDisease.query.order_by(
#             PlantDisease.created_at.desc()
#         ).paginate(
#             page=page, 
#             per_page=per_page, 
#             error_out=False
#         )
        
#         history = []
#         for detection in detections.items:
#             recommendation = Recommendation.query.filter_by(
                
#                 disease_id=detection.id
#             ).first()
            
#             detection_data = {
#                 'id': detection.id,
#                 'disease_name': detection.disease_name,
#                 'confidence_score': detection.confidence_score,
#                 'plant_type': detection.plant_type,
#                 'created_at': detection.created_at.isoformat(),
#                 'recommendation': {
#                     'treatment_type': recommendation.treatment_type if recommendation else None,
#                     'urgency_level': recommendation.urgency_level if recommendation else None,
#                     'recovery_time': recommendation.estimated_recovery_time if recommendation else None
#                 } if recommendation else None
#             }
#             history.append(detection_data)
        
#         return jsonify({
#             'success': True,
#             'history': history,
#             'pagination': {
#                 'page': page,
#                 'per_page': per_page,
#                 'total': detections.total,
#                 'pages': detections.pages,
#                 'has_next': detections.has_next,
#                 'has_prev': detections.has_prev
#             }
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_detection_history: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la récupération de l\'historique',
#             'success': False
#         }), 500
        
        
@bp.route('/history', methods=['GET'])
def get_detection_history():
    """Obtenir l'historique des détections"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Limiter le nombre d'éléments par page
        per_page = min(per_page, 100)
        
        detections = PlantDisease.query.order_by(
            PlantDisease.created_at.desc()
        ).paginate(
            page=page, 
            per_page=per_page,
            error_out=False
        )
        
        history = []
        
        def safe_decode_string(val):
            """Décoder en toute sécurité les chaînes de caractères"""
            if val is None:
                return None
            if isinstance(val, bytes):
                try:
                    return val.decode('utf-8')
                except UnicodeDecodeError:
                    return val.decode('latin-1', errors='ignore')
            return str(val)
        
        def safe_get_pickle_data(val):
            """Récupérer en toute sécurité les données pickled"""
            if val is None:
                return None
            # SQLAlchemy avec PostgreSQL retourne directement l'objet Python pour PickleType
            # Pas besoin de pickle.loads() car SQLAlchemy le fait automatiquement
            return val
        
        for detection in detections.items:
            try:
                recommendation = Recommendation.query.filter_by(
                    disease_id=detection.id
                ).first()
                
                detection_data = {
                    'id': detection.id,
                    'disease_name': safe_decode_string(detection.disease_name),
                    'confidence_score': detection.confidence_score,
                    'plant_type': safe_decode_string(detection.plant_type),
                    'severity': safe_decode_string(detection.severity),
                    'image_path': safe_decode_string(detection.image_path),
                    'created_at': detection.created_at.isoformat(),
                    'recommendation': None
                }
                
                if recommendation:
                    detection_data['recommendation'] = {
                        'treatment_type': safe_decode_string(recommendation.treatment_type),
                        'treatment_description': safe_decode_string(recommendation.treatment_description),
                        'recommended_products': safe_get_pickle_data(recommendation.recommended_products),
                        'application_method': safe_decode_string(recommendation.application_method),
                        'dosage': safe_decode_string(recommendation.dosage),
                        'frequency': safe_decode_string(recommendation.frequency),
                        'prevention_tips': safe_get_pickle_data(recommendation.prevention_tips),
                        'urgency_level': safe_decode_string(recommendation.urgency_level),
                        'recovery_time': safe_decode_string(recommendation.estimated_recovery_time)
                    }
                
                history.append(detection_data)
                
            except Exception as e:
                print(f"Erreur lors du traitement de la détection {detection.id}: {e}")
                # Continuer avec les autres détections même si une échoue
                continue
        
        return jsonify({
            'success': True,
            'history': history,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': detections.total,
                'pages': detections.pages,
                'has_next': detections.has_next,
                'has_prev': detections.has_prev
            }
        }), 200
        
    except Exception as e:
        print(f"Erreur dans get_detection_history: {e}")
        return jsonify({
            'error': 'Erreur lors de la récupération de l\'historique',
            'success': False
        }), 500        
        
        
@bp.route('/plant-health/overview')
def get_health_overview():
    """
    Retourne les données de santé pour le graphique temporel
    Basé sur l'historique des détections des dernières 24h
    """
    try:
        # Récupérer les détections des dernières 24h
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        
        # Requête pour obtenir les données de santé par heure
        health_data = db.session.query(
            func.strftime('%H:00', PlantDisease.created_at).label('time'),
            func.avg(PlantDisease.confidence_score * 100).label('health'),
            func.strftime('%Y-%m-%d %H:00:00', PlantDisease.created_at).label('date')
        ).filter(
            PlantDisease.created_at >= twenty_four_hours_ago
        ).group_by(
            func.strftime('%H', PlantDisease.created_at)
        ).order_by('date').all()
        
        # Si pas assez de données, générer des données par défaut
        if len(health_data) < 5:
            health_data = generate_default_health_data()
        else:
            # Convertir les résultats de la requête
            health_data = [
                {
                    'time': row.time,
                    'health': round(row.health, 1) if row.health else 75.0,
                    'date': row.date
                }
                for row in health_data
            ]
        
        return jsonify(health_data)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des données de santé: {str(e)}")
        return jsonify({"error": "Erreur lors du chargement des données de santé"}), 500

@bp.route('/detections/recent')
def get_recent_detections():
    """
    Retourne les détections récentes avec limit optionnel
    """
    try:
        limit = request.args.get('limit', default=10, type=int)
        
        # Récupérer les détections récentes depuis la base de données
        recent_detections = PlantDisease.query.order_by(
            desc(PlantDisease.created_at)
        ).limit(limit).all()
        
        # Formater les données pour le frontend
        formatted_detections = []
        for detection in recent_detections:
            # Déterminer le niveau d'urgence basé sur la confiance et le type de maladie
            urgency_level = determine_urgency_level(detection)
            
            formatted_detections.append({
                'id': detection.id,
                'disease': detection.disease_name or 'Maladie détectée',
                'plant_type': detection.crop_type or 'Plante inconnue',
                'location': detection.location or 'Localisation non spécifiée',
                'status': get_detection_status(detection),
                'confidence_score': detection.confidence_score,
                'created_at': detection.created_at.isoformat() if detection.created_at else datetime.utcnow().isoformat(),
                'urgency_level': urgency_level
            })
        
        return jsonify(formatted_detections)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des détections récentes: {str(e)}")
        return jsonify({"error": "Erreur lors du chargement des détections récentes"}), 500

@bp.route('/disease-predictions')
def get_disease_predictions():
    """
    Retourne les prédictions de maladies avec leurs recommandations
    """
    try:
        # Récupérer les maladies avec leurs recommandations
        diseases_with_recommendations = db.session.query(
            PlantDisease, Recommendation
        ).outerjoin(
            Recommendation, PlantDisease.id == Recommendation.disease_id
        ).filter(
            PlantDisease.confidence_score >= 0.5  # Seulement les détections fiables
        ).order_by(
            desc(PlantDisease.confidence_score)
        ).all()
        
        # Formater les données pour le frontend
        formatted_predictions = []
        processed_diseases = set()
        
        for disease, recommendation in diseases_with_recommendations:
            # Éviter les doublons
            if disease.id in processed_diseases:
                continue
            processed_diseases.add(disease.id)
            
            formatted_predictions.append({
                'id': disease.id,
                'crop': disease.crop_type or 'Culture inconnue',
                'disease': disease.disease_name or 'Maladie non identifiée',
                'riskLevel': determine_risk_level(disease.confidence_score),
                'symptoms': disease.symptoms or 'Symptômes non spécifiés',
                'recommendation': recommendation.recommendation_text if recommendation else 'Aucune recommandation disponible',
                'confidence_score': disease.confidence_score,
                'created_at': disease.created_at.isoformat() if disease.created_at else datetime.utcnow().isoformat()
            })
        
        return jsonify(formatted_predictions)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des prédictions: {str(e)}")
        return jsonify({"error": "Erreur lors du chargement des prédictions de maladies"}), 500

@bp.route('/crops/status')
def get_crop_status():
    """
    Retourne le statut de chaque type de culture
    Agrège les données par type de culture
    """
    try:
        # Agrégation des données par type de culture
        crop_stats = db.session.query(
            PlantDisease.crop_type,
            func.count(PlantDisease.id).label('total_detections'),
            func.avg(PlantDisease.confidence_score).label('avg_confidence'),
            func.max(PlantDisease.created_at).label('last_detection'),
            func.sum(
                func.case([(PlantDisease.confidence_score >= 0.8, 1)], else_=0)
            ).label('high_confidence_detections')
        ).filter(
            PlantDisease.crop_type.isnot(None)
        ).group_by(
            PlantDisease.crop_type
        ).all()
        
        # Formater les données pour le frontend
        formatted_crops = []
        for i, crop in enumerate(crop_stats, 1):
            # Calculer le score de santé basé sur la confiance moyenne et le nombre de détections
            health_score = calculate_crop_health_score(
                crop.avg_confidence, 
                crop.total_detections, 
                crop.high_confidence_detections
            )
            
            # Déterminer le statut et les problèmes
            status, issues = determine_crop_status_and_issues(
                health_score, 
                crop.high_confidence_detections, 
                crop.total_detections
            )
            
            # Formater la date de dernière inspection
            last_inspected = format_last_inspection_time(crop.last_detection)
            
            formatted_crops.append({
                'id': i,
                'name': crop.crop_type.replace('_', ' ').title(),
                'health': health_score,
                'status': status,
                'issues': issues,
                'lastInspected': last_inspected,
                'totalDetections': crop.total_detections,
                'healthyDetections': crop.total_detections - crop.high_confidence_detections
            })
        
        # Trier par score de santé (problèmes en premier)
        formatted_crops.sort(key=lambda x: x['health'])
        
        return jsonify(formatted_crops)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du statut des cultures: {str(e)}")
        return jsonify({"error": "Erreur lors du chargement du statut des cultures"}), 500

@bp.route('/plant-health/metrics')
def get_health_metrics():
    """
    Retourne les métriques générales de santé des plantes
    """
    try:
        # Statistiques générales
        total_detections = PlantDisease.query.count()
        
        # Détections des dernières 24h
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        recent_detections = PlantDisease.query.filter(
            PlantDisease.created_at >= twenty_four_hours_ago
        ).count()
        
        # Détections à haute confiance (considérées comme problématiques)
        diseased_plants = PlantDisease.query.filter(
            PlantDisease.confidence_score >= 0.7
        ).count()
        
        # Détections à faible confiance (considérées comme saines)
        healthy_plants = total_detections - diseased_plants
        
        # Calcul de la santé générale
        avg_confidence = db.session.query(
            func.avg(PlantDisease.confidence_score)
        ).scalar() or 0.5
        
        overall_health = calculate_overall_health(avg_confidence, diseased_plants, total_detections)
        
        # Simulation des métriques de croissance et nutrition
        # (à remplacer par de vraies données si disponibles)
        growth_rate = calculate_growth_rate(recent_detections, total_detections)
        nutrient_levels = determine_nutrient_levels(overall_health)
        
        metrics = {
            'overallHealth': overall_health,
            'growthRate': growth_rate,
            'nutrientLevels': nutrient_levels,
            'totalDetections': total_detections,
            'healthyPlants': healthy_plants,
            'diseasedPlants': diseased_plants
        }
        
        return jsonify(metrics)
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des métriques: {str(e)}")
        return jsonify({"error": "Erreur lors du chargement des métriques"}), 500

# Fonctions utilitaires
def determine_urgency_level(disease):
    """Détermine le niveau d'urgence basé sur la confiance et le type de maladie"""
    if disease.confidence_score >= 0.8:
        return 'high'
    elif disease.confidence_score >= 0.6:
        return 'medium'
    else:
        return 'low'

def get_detection_status(disease):
    """Détermine le statut d'une détection"""
    # Logique basée sur l'âge et la confiance de la détection
    if disease.created_at and disease.created_at < datetime.utcnow() - timedelta(days=7):
        return 'Resolved'
    elif disease.confidence_score >= 0.7:
        return 'Active'
    else:
        return 'Moderate'

def determine_risk_level(confidence_score):
    """Détermine le niveau de risque basé sur le score de confiance"""
    if confidence_score >= 0.8:
        return 'High'
    elif confidence_score >= 0.6:
        return 'Moderate'
    else:
        return 'Low'

def calculate_crop_health_score(avg_confidence, total_detections, high_confidence_detections):
    """Calcule le score de santé d'une culture"""
    if total_detections == 0:
        return 85  # Score par défaut si pas de données
    
    # Plus il y a de détections à haute confiance, plus la santé est faible
    disease_ratio = high_confidence_detections / total_detections
    health_score = max(20, 95 - (disease_ratio * 60) - (avg_confidence * 20))
    return round(health_score)

def determine_crop_status_and_issues(health_score, high_confidence_detections, total_detections):
    """Détermine le statut et les problèmes d'une culture"""
    if health_score >= 90:
        return "Excellent", ""
    elif health_score >= 75:
        return "Bon état", "Surveillance recommandée" if high_confidence_detections > 0 else ""
    elif health_score >= 60:
        return "Attention requise", f"{high_confidence_detections} problème(s) détecté(s)"
    else:
        return "Problème détecté", f"Intervention urgente - {high_confidence_detections} maladies confirmées"

def format_last_inspection_time(last_detection):
    """Formate le temps de dernière inspection"""
    if not last_detection:
        return "Jamais inspecté"
    
    time_diff = datetime.utcnow() - last_detection
    
    if time_diff.days > 0:
        return f"Il y a {time_diff.days} jour(s)"
    elif time_diff.seconds > 3600:
        hours = time_diff.seconds // 3600
        return f"Il y a {hours} heure(s)"
    else:
        minutes = time_diff.seconds // 60
        return f"Il y a {minutes} minute(s)"

def calculate_overall_health(avg_confidence, diseased_plants, total_detections):
    """Calcule la santé générale"""
    if total_detections == 0:
        return 85
    
    disease_ratio = diseased_plants / total_detections
    health = max(30, 90 - (disease_ratio * 50) - (avg_confidence * 20))
    return round(health)

def calculate_growth_rate(recent_detections, total_detections):
    """Calcule le taux de croissance simulé"""
    if total_detections == 0:
        return "+2.0%"
    
    # Logique simplifiée basée sur l'activité récente
    growth_factor = max(1.0, 3.0 - (recent_detections / max(1, total_detections)) * 2)
    return f"+{growth_factor:.1f}%"

def determine_nutrient_levels(overall_health):
    """Détermine les niveaux nutritionnels basés sur la santé générale"""
    if overall_health >= 85:
        return "Optimal"
    elif overall_health >= 70:
        return "Bon"
    elif overall_health >= 55:
        return "Satisfaisant"
    else:
        return "À surveiller"

def generate_default_health_data():
    """Génère des données de santé par défaut quand pas assez de données en DB"""
    health_data = []
    now = datetime.utcnow()
    
    for i in range(24):
        time_point = now - timedelta(hours=23-i)
        # Simulation d'une santé stable avec légères variations
        base_health = 75
        variation = (i % 5 - 2) * 3  # Variation cyclique
        health_score = max(50, min(95, base_health + variation))
        
        health_data.append({
            'time': time_point.strftime('%H:00'),
            'health': round(health_score, 1),
            'date': time_point.strftime('%Y-%m-%d %H:00:00')
        })
    
    return health_data