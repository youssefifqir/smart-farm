
# from flask import Blueprint, request, jsonify
# from models import db
# from models.plant_diseases import PlantDisease
# from models.recommendations import Recommendation
# from services.gemini_service import GeminiService

# bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

# @bp.route('/', methods=['GET'])
# def get_all_recommendations():
#     """Obtenir toutes les recommandations avec pagination"""
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)
        
#         # Limiter le nombre d'éléments par page
#         per_page = min(per_page, 100)
        
#         recommendations = Recommendation.query.order_by(
#             Recommendation.created_at.desc()
#         ).paginate(
#             page=page,
#             per_page=per_page,
#             error_out=False
#         )
        
#         recommendation_list = []
#         for rec in recommendations.items:
#             rec_data = rec.to_dict()
#             # Ajouter les informations de la maladie associée
#             disease = PlantDisease.query.get(rec.disease_id)
#             if disease:
#                 rec_data['disease_info'] = {
#                     'disease_name': disease.disease_name,
#                     'plant_type': disease.plant_type,
#                     'confidence_score': disease.confidence_score
#                 }
#             recommendation_list.append(rec_data)
        
#         return jsonify({
#             'success': True,
#             'recommendations': recommendation_list,
#             'pagination': {
#                 'page': page,
#                 'per_page': per_page,
#                 'total': recommendations.total,
#                 'pages': recommendations.pages,
#                 'has_next': recommendations.has_next,
#                 'has_prev': recommendations.has_prev
#             }
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_all_recommendations: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la récupération des recommandations',
#             'success': False
#         }), 500

# @bp.route('/<int:recommendation_id>', methods=['GET'])
# def get_recommendation(recommendation_id):
#     """Obtenir une recommandation spécifique par ID"""
#     try:
#         recommendation = Recommendation.query.get_or_404(recommendation_id)
#         disease = PlantDisease.query.get(recommendation.disease_id)
        
#         rec_data = recommendation.to_dict()
#         if disease:
#             rec_data['disease_info'] = {
#                 'id': disease.id,
#                 'disease_name': disease.disease_name,
#                 'plant_type': disease.plant_type,
#                 'confidence_score': disease.confidence_score,
#                 'created_at': disease.created_at.isoformat()
#             }
        
#         return jsonify({
#             'success': True,
#             'recommendation': rec_data
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_recommendation: {e}")
#         return jsonify({
#             'error': 'Recommandation non trouvée',
#             'success': False
#         }), 404

# @bp.route('/regenerate/<int:disease_id>', methods=['POST'])
# def regenerate_recommendation(disease_id):
#     """Régénérer une recommandation pour une maladie spécifique"""
#     try:
#         disease = PlantDisease.query.get_or_404(disease_id)
        
#         # Préparer les informations de la maladie pour Gemini
#         disease_info = {
#             'disease_name': disease.disease_name,
#             'plant_type': disease.plant_type,
#             'confidence': disease.confidence_score
#         }
        
#         # Générer une nouvelle recommandation avec Gemini
#         gemini_service = GeminiService()
#         gemini_response = gemini_service.get_treatment_recommendations(disease_info)
        
#         # Supprimer l'ancienne recommandation si elle existe
#         old_recommendation = Recommendation.query.filter_by(disease_id=disease_id).first()
#         if old_recommendation:
#             db.session.delete(old_recommendation)
        
#         # Créer une nouvelle recommandation
#         new_recommendation = Recommendation(
#             disease_id=disease_id,
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
        
#         db.session.add(new_recommendation)
#         db.session.commit()
        
#         response_data = {
#             'success': True,
#             'message': 'Recommandation régénérée avec succès',
#             'recommendation': new_recommendation.to_dict()
#         }
        
#         return jsonify(response_data), 200
        
#     except Exception as e:
#         print(f"Erreur dans regenerate_recommendation: {e}")
#         db.session.rollback()
#         return jsonify({
#             'error': 'Erreur lors de la régénération de la recommandation',
#             'success': False
#         }), 500

# @bp.route('/by-disease/<int:disease_id>', methods=['GET'])
# def get_recommendations_by_disease(disease_id):
#     """Obtenir les recommandations pour une maladie spécifique"""
#     try:
#         disease = PlantDisease.query.get_or_404(disease_id)
#         recommendations = Recommendation.query.filter_by(disease_id=disease_id).all()
        
#         rec_list = []
#         for rec in recommendations:
#             rec_data = rec.to_dict()
#             rec_data['disease_info'] = {
#                 'disease_name': disease.disease_name,
#                 'plant_type': disease.plant_type,
#                 'confidence_score': disease.confidence_score
#             }
#             rec_list.append(rec_data)
        
#         return jsonify({
#             'success': True,
#             'disease': disease.to_dict(),
#             'recommendations': rec_list
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_recommendations_by_disease: {e}")
#         return jsonify({
#             'error': 'Maladie non trouvée',
#             'success': False
#         }), 404

# @bp.route('/search', methods=['GET'])
# def search_recommendations():
#     """Rechercher des recommandations par mots-clés"""
#     try:
#         query = request.args.get('q', '').strip()
#         treatment_type = request.args.get('treatment_type', '').strip()
#         urgency_level = request.args.get('urgency_level', '').strip()
        
#         if not query and not treatment_type and not urgency_level:
#             return jsonify({
#                 'error': 'Au moins un critère de recherche est requis',
#                 'success': False
#             }), 400
        
#         # Construire la requête de recherche
#         search_query = Recommendation.query
        
#         if query:
#             search_query = search_query.filter(
#                 db.or_(
#                     Recommendation.treatment_description.contains(query),
#                     Recommendation.application_method.contains(query)
#                 )
#             )
        
#         if treatment_type:
#             search_query = search_query.filter(
#                 Recommendation.treatment_type.ilike(f'%{treatment_type}%')
#             )
        
#         if urgency_level:
#             search_query = search_query.filter(
#                 Recommendation.urgency_level.ilike(f'%{urgency_level}%')
#             )
        
#         recommendations = search_query.order_by(
#             Recommendation.created_at.desc()
#         ).limit(50).all()
        
#         result_list = []
#         for rec in recommendations:
#             rec_data = rec.to_dict()
#             # Ajouter les informations de la maladie
#             disease = PlantDisease.query.get(rec.disease_id)
#             if disease:
#                 rec_data['disease_info'] = {
#                     'disease_name': disease.disease_name,
#                     'plant_type': disease.plant_type,
#                     'confidence_score': disease.confidence_score
#                 }
#             result_list.append(rec_data)
        
#         return jsonify({
#             'success': True,
#             'query': query,
#             'filters': {
#                 'treatment_type': treatment_type,
#                 'urgency_level': urgency_level
#             },
#             'results_count': len(result_list),
#             'recommendations': result_list
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans search_recommendations: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la recherche',
#             'success': False
#         }), 500

# @bp.route('/stats', methods=['GET'])
# def get_recommendation_stats():
#     """Obtenir des statistiques sur les recommandations"""
#     try:
#         # Compter les recommandations par type de traitement
#         treatment_stats = db.session.query(
#             Recommendation.treatment_type,
#             db.func.count(Recommendation.id).label('count')
#         ).group_by(Recommendation.treatment_type).all()
        
#         # Compter par niveau d'urgence
#         urgency_stats = db.session.query(
#             Recommendation.urgency_level,
#             db.func.count(Recommendation.id).label('count')
#         ).group_by(Recommendation.urgency_level).all()
        
#         # Recommandations récentes (derniers 7 jours)
#         from datetime import datetime, timedelta
#         week_ago = datetime.utcnow() - timedelta(days=7)
#         recent_count = Recommendation.query.filter(
#             Recommendation.created_at >= week_ago
#         ).count()
        
#         # Total des recommandations
#         total_count = Recommendation.query.count()
        
#         stats = {
#             'total_recommendations': total_count,
#             'recent_recommendations': recent_count,
#             'treatment_types': [
#                 {'type': stat[0], 'count': stat[1]} 
#                 for stat in treatment_stats
#             ],
#             'urgency_levels': [
#                 {'level': stat[0], 'count': stat[1]} 
#                 for stat in urgency_stats
#             ]
#         }
        
#         return jsonify({
#             'success': True,
#             'stats': stats
#         }), 200
        
#     except Exception as e:
#         print(f"Erreur dans get_recommendation_stats: {e}")
#         return jsonify({
#             'error': 'Erreur lors de la récupération des statistiques',
#             'success': False
#         }), 500



from flask import Blueprint, request, jsonify
from models import db
from models.plant_diseases import PlantDisease
from models.recommendations import Recommendation
from services.gemini_service import GeminiService
from services.disease_detection import DiseaseDetectionService
from datetime import datetime, timedelta
import logging
from config import Config

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bp = Blueprint('recommendations', __name__, url_prefix='/api/recommendations')

# Initialiser les services
gemini_service = GeminiService(api_key=Config.GEMINI_API_KEY)
disease_service = DiseaseDetectionService()

@bp.route('/', methods=['GET'])
def get_all_recommendations():
    """Obtenir toutes les recommandations avec pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Limiter le nombre d'éléments par page
        per_page = min(per_page, 100)
        
        recommendations = Recommendation.query.order_by(
            Recommendation.created_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        recommendation_list = []
        for rec in recommendations.items:
            rec_data = rec.to_dict()
            # Ajouter les informations de la maladie associée
            disease = PlantDisease.query.get(rec.disease_id)
            if disease:
                rec_data['disease_info'] = {
                    'id': disease.id,
                    'disease_name': disease.disease_name,
                    'plant_type': disease.plant_type,
                    'confidence_score': disease.confidence_score,
                    'detection_source': 'Crop.health API'
                }
            recommendation_list.append(rec_data)
        
        return jsonify({
            'success': True,
            'recommendations': recommendation_list,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': recommendations.total,
                'pages': recommendations.pages,
                'has_next': recommendations.has_next,
                'has_prev': recommendations.has_prev
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans get_all_recommendations: {e}")
        return jsonify({
            'error': 'Erreur lors de la récupération des recommandations',
            'success': False,
            'details': str(e)
        }), 500

@bp.route('/<int:recommendation_id>', methods=['GET'])
def get_recommendation(recommendation_id):
    """Obtenir une recommandation spécifique par ID"""
    try:
        recommendation = Recommendation.query.get_or_404(recommendation_id)
        disease = PlantDisease.query.get(recommendation.disease_id)
        
        rec_data = recommendation.to_dict()
        if disease:
            rec_data['disease_info'] = {
                'id': disease.id,
                'disease_name': disease.disease_name,
                'plant_type': disease.plant_type,
                'confidence_score': disease.confidence_score,
                'created_at': disease.created_at.isoformat(),
                'detection_source': 'Crop.health API',
                'raw_detection_data': disease.raw_prediction if hasattr(disease, 'raw_prediction') else None
            }
        
        return jsonify({
            'success': True,
            'recommendation': rec_data
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans get_recommendation: {e}")
        return jsonify({
            'error': 'Recommandation non trouvée',
            'success': False,
            'details': str(e)
        }), 404

@bp.route('/generate', methods=['POST'])
def generate_recommendation():
    """
    Générer une recommandation basée sur une détection de maladie existante
    ou sur des informations fournies manuellement
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Données JSON requises',
                'success': False
            }), 400
        
        disease_id = data.get('disease_id')
        
        # Si un disease_id est fourni, utiliser la maladie existante
        if disease_id:
            disease = PlantDisease.query.get_or_404(disease_id)
            disease_info = {
                'disease_name': disease.disease_name,
                'plant_type': disease.plant_type,
                'confidence': disease.confidence_score,
                'details': disease.details if hasattr(disease, 'details') else {}
            }
        else:
            # Sinon, utiliser les informations fournies directement
            disease_info = {
                'disease_name': data.get('disease_name', 'Maladie inconnue'),
                'plant_type': data.get('plant_type', 'Plante inconnue'),
                'confidence': data.get('confidence', 0.0),
                'details': data.get('details', {})
            }
        
        logger.info(f"Génération de recommandation pour: {disease_info['disease_name']}")
        
        # Générer la recommandation avec Gemini
        gemini_response = gemini_service.get_treatment_recommendations(disease_info)
        
        # Si on a un disease_id, sauvegarder la recommandation en base
        if disease_id:
            # Vérifier si une recommandation existe déjà
            existing_rec = Recommendation.query.filter_by(disease_id=disease_id).first()
            if existing_rec:
                # Mettre à jour la recommandation existante
                existing_rec.treatment_type = gemini_response.get('treatment_type', 'Général')
                existing_rec.treatment_description = gemini_response.get('description', '')
                existing_rec.recommended_products = gemini_response.get('products', [])
                existing_rec.application_method = gemini_response.get('application_method', '')
                existing_rec.dosage = gemini_response.get('dosage', '')
                existing_rec.frequency = gemini_response.get('frequency', '')
                existing_rec.prevention_tips = gemini_response.get('prevention_tips', [])
                existing_rec.urgency_level = gemini_response.get('urgency_level', 'Moyenne')
                existing_rec.estimated_recovery_time = gemini_response.get('recovery_time', '')
                existing_rec.updated_at = datetime.utcnow()
                
                recommendation = existing_rec
            else:
                # Créer une nouvelle recommandation
                recommendation = Recommendation(
                    disease_id=disease_id,
                    treatment_type=gemini_response.get('treatment_type', 'Général'),
                    treatment_description=gemini_response.get('description', ''),
                    recommended_products=gemini_response.get('products', []),
                    application_method=gemini_response.get('application_method', ''),
                    dosage=gemini_response.get('dosage', ''),
                    frequency=gemini_response.get('frequency', ''),
                    prevention_tips=gemini_response.get('prevention_tips', []),
                    urgency_level=gemini_response.get('urgency_level', 'Moyenne'),
                    estimated_recovery_time=gemini_response.get('recovery_time', '')
                )
                db.session.add(recommendation)
            
            db.session.commit()
            
            response_data = {
                'success': True,
                'message': 'Recommandation générée avec succès',
                'recommendation': recommendation.to_dict(),
                'disease_info': disease_info
            }
        else:
            # Retourner seulement la recommandation générée sans sauvegarde
            response_data = {
                'success': True,
                'message': 'Recommandation générée (non sauvegardée)',
                'recommendation': gemini_response,
                'disease_info': disease_info
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Erreur dans generate_recommendation: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Erreur lors de la génération de la recommandation',
            'success': False,
            'details': str(e)
        }), 500

@bp.route('/regenerate/<int:disease_id>', methods=['POST'])
def regenerate_recommendation(disease_id):
    """Régénérer une recommandation pour une maladie spécifique"""
    try:
        disease = PlantDisease.query.get_or_404(disease_id)
        
        logger.info(f"Régénération de recommandation pour la maladie ID: {disease_id}")
        
        # Préparer les informations de la maladie pour Gemini
        disease_info = {
            'disease_name': disease.disease_name,
            'plant_type': disease.plant_type,
            'confidence': disease.confidence_score,
            'details': disease.details if hasattr(disease, 'details') else {}
        }
        
        # Générer une nouvelle recommandation avec Gemini
        gemini_response = gemini_service.get_treatment_recommendations(disease_info)
        
        # Mettre à jour ou créer la recommandation
        existing_recommendation = Recommendation.query.filter_by(disease_id=disease_id).first()
        
        if existing_recommendation:
            # Mettre à jour la recommandation existante
            existing_recommendation.treatment_type = gemini_response.get('treatment_type', 'Général')
            existing_recommendation.treatment_description = gemini_response.get('description', '')
            existing_recommendation.recommended_products = gemini_response.get('products', [])
            existing_recommendation.application_method = gemini_response.get('application_method', '')
            existing_recommendation.dosage = gemini_response.get('dosage', '')
            existing_recommendation.frequency = gemini_response.get('frequency', '')
            existing_recommendation.prevention_tips = gemini_response.get('prevention_tips', [])
            existing_recommendation.urgency_level = gemini_response.get('urgency_level', 'Moyenne')
            existing_recommendation.estimated_recovery_time = gemini_response.get('recovery_time', '')
            existing_recommendation.updated_at = datetime.utcnow()
            
            recommendation = existing_recommendation
        else:
            # Créer une nouvelle recommandation
            recommendation = Recommendation(
                disease_id=disease_id,
                treatment_type=gemini_response.get('treatment_type', 'Général'),
                treatment_description=gemini_response.get('description', ''),
                recommended_products=gemini_response.get('products', []),
                application_method=gemini_response.get('application_method', ''),
                dosage=gemini_response.get('dosage', ''),
                frequency=gemini_response.get('frequency', ''),
                prevention_tips=gemini_response.get('prevention_tips', []),
                urgency_level=gemini_response.get('urgency_level', 'Moyenne'),
                estimated_recovery_time=gemini_response.get('recovery_time', '')
            )
            db.session.add(recommendation)
        
        db.session.commit()
        
        response_data = {
            'success': True,
            'message': 'Recommandation régénérée avec succès',
            'recommendation': recommendation.to_dict(),
            'disease_info': disease_info,
            'generation_source': 'Crop.health + Gemini'
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Erreur dans regenerate_recommendation: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Erreur lors de la régénération de la recommandation',
            'success': False,
            'details': str(e)
        }), 500

@bp.route('/by-disease/<int:disease_id>', methods=['GET'])
def get_recommendations_by_disease(disease_id):
    """Obtenir les recommandations pour une maladie spécifique"""
    try:
        disease = PlantDisease.query.get_or_404(disease_id)
        recommendations = Recommendation.query.filter_by(disease_id=disease_id).all()
        
        rec_list = []
        for rec in recommendations:
            rec_data = rec.to_dict()
            rec_data['disease_info'] = {
                'disease_name': disease.disease_name,
                'plant_type': disease.plant_type,
                'confidence_score': disease.confidence_score,
                'detection_source': 'Crop.health API'
            }
            rec_list.append(rec_data)
        
        disease_dict = disease.to_dict()
        disease_dict['detection_source'] = 'Crop.health API'
        
        return jsonify({
            'success': True,
            'disease': disease_dict,
            'recommendations': rec_list,
            'recommendations_count': len(rec_list)
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans get_recommendations_by_disease: {e}")
        return jsonify({
            'error': 'Maladie non trouvée',
            'success': False,
            'details': str(e)
        }), 404

@bp.route('/search', methods=['GET'])
def search_recommendations():
    """Rechercher des recommandations par mots-clés"""
    try:
        query = request.args.get('q', '').strip()
        treatment_type = request.args.get('treatment_type', '').strip()
        urgency_level = request.args.get('urgency_level', '').strip()
        plant_type = request.args.get('plant_type', '').strip()
        
        if not any([query, treatment_type, urgency_level, plant_type]):
            return jsonify({
                'error': 'Au moins un critère de recherche est requis',
                'success': False
            }), 400
        
        # Construire la requête de recherche
        search_query = Recommendation.query
        
        if query:
            search_query = search_query.filter(
                db.or_(
                    Recommendation.treatment_description.contains(query),
                    Recommendation.application_method.contains(query),
                    Recommendation.recommended_products.contains(query)
                )
            )
        
        if treatment_type:
            search_query = search_query.filter(
                Recommendation.treatment_type.ilike(f'%{treatment_type}%')
            )
        
        if urgency_level:
            search_query = search_query.filter(
                Recommendation.urgency_level.ilike(f'%{urgency_level}%')
            )
        
        # Filtrer par type de plante en joignant avec PlantDisease
        if plant_type:
            search_query = search_query.join(PlantDisease).filter(
                PlantDisease.plant_type.ilike(f'%{plant_type}%')
            )
        
        recommendations = search_query.order_by(
            Recommendation.created_at.desc()
        ).limit(50).all()
        
        result_list = []
        for rec in recommendations:
            rec_data = rec.to_dict()
            # Ajouter les informations de la maladie
            disease = PlantDisease.query.get(rec.disease_id)
            if disease:
                rec_data['disease_info'] = {
                    'disease_name': disease.disease_name,
                    'plant_type': disease.plant_type,
                    'confidence_score': disease.confidence_score,
                    'detection_source': 'Crop.health API'
                }
            result_list.append(rec_data)
        
        return jsonify({
            'success': True,
            'search_params': {
                'query': query,
                'treatment_type': treatment_type,
                'urgency_level': urgency_level,
                'plant_type': plant_type
            },
            'results_count': len(result_list),
            'recommendations': result_list
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans search_recommendations: {e}")
        return jsonify({
            'error': 'Erreur lors de la recherche',
            'success': False,
            'details': str(e)
        }), 500

@bp.route('/stats', methods=['GET'])
def get_recommendation_stats():
    """Obtenir des statistiques sur les recommandations"""
    try:
        # Compter les recommandations par type de traitement
        treatment_stats = db.session.query(
            Recommendation.treatment_type,
            db.func.count(Recommendation.id).label('count')
        ).group_by(Recommendation.treatment_type).all()
        
        # Compter par niveau d'urgence
        urgency_stats = db.session.query(
            Recommendation.urgency_level,
            db.func.count(Recommendation.id).label('count')
        ).group_by(Recommendation.urgency_level).all()
        
        # Statistiques par type de plante (en joignant avec PlantDisease)
        plant_stats = db.session.query(
            PlantDisease.plant_type,
            db.func.count(Recommendation.id).label('count')
        ).join(Recommendation).group_by(PlantDisease.plant_type).all()
        
        # Recommandations récentes (derniers 7 jours)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_count = Recommendation.query.filter(
            Recommendation.created_at >= week_ago
        ).count()
        
        # Total des recommandations
        total_count = Recommendation.query.count()
        
        # Maladies les plus fréquentes
        common_diseases = db.session.query(
            PlantDisease.disease_name,
            db.func.count(Recommendation.id).label('count')
        ).join(Recommendation).group_by(
            PlantDisease.disease_name
        ).order_by(db.desc('count')).limit(10).all()
        
        stats = {
            'total_recommendations': total_count,
            'recent_recommendations': recent_count,
            'detection_source': 'Crop.health API',
            'treatment_types': [
                {'type': stat[0] or 'Non spécifié', 'count': stat[1]} 
                for stat in treatment_stats
            ],
            'urgency_levels': [
                {'level': stat[0] or 'Non spécifié', 'count': stat[1]} 
                for stat in urgency_stats
            ],
            'plant_types': [
                {'plant_type': stat[0] or 'Non spécifié', 'count': stat[1]} 
                for stat in plant_stats
            ],
            'common_diseases': [
                {'disease_name': stat[0], 'recommendation_count': stat[1]} 
                for stat in common_diseases
            ]
        }
        
        return jsonify({
            'success': True,
            'stats': stats,
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans get_recommendation_stats: {e}")
        return jsonify({
            'error': 'Erreur lors de la récupération des statistiques',
            'success': False,
            'details': str(e)
        }), 500

@bp.route('/bulk-generate', methods=['POST'])
def bulk_generate_recommendations():
    """
    Générer des recommandations pour plusieurs maladies sans recommandations
    """
    try:
        # Trouver toutes les maladies sans recommandations
        diseases_without_recs = db.session.query(PlantDisease).outerjoin(
            Recommendation
        ).filter(Recommendation.id.is_(None)).limit(50).all()
        
        if not diseases_without_recs:
            return jsonify({
                'success': True,
                'message': 'Toutes les maladies ont déjà des recommandations',
                'generated_count': 0
            }), 200
        
        generated_count = 0
        errors = []
        
        for disease in diseases_without_recs:
            try:
                disease_info = {
                    'disease_name': disease.disease_name,
                    'plant_type': disease.plant_type,
                    'confidence': disease.confidence_score,
                    'details': disease.details if hasattr(disease, 'details') else {}
                }
                
                # Générer la recommandation
                gemini_response = gemini_service.get_treatment_recommendations(disease_info)
                
                # Créer la recommandation
                recommendation = Recommendation(
                    disease_id=disease.id,
                    treatment_type=gemini_response.get('treatment_type', 'Général'),
                    treatment_description=gemini_response.get('description', ''),
                    recommended_products=gemini_response.get('products', []),
                    application_method=gemini_response.get('application_method', ''),
                    dosage=gemini_response.get('dosage', ''),
                    frequency=gemini_response.get('frequency', ''),
                    prevention_tips=gemini_response.get('prevention_tips', []),
                    urgency_level=gemini_response.get('urgency_level', 'Moyenne'),
                    estimated_recovery_time=gemini_response.get('recovery_time', '')
                )
                
                db.session.add(recommendation)
                generated_count += 1
                
            except Exception as e:
                errors.append({
                    'disease_id': disease.id,
                    'disease_name': disease.disease_name,
                    'error': str(e)
                })
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{generated_count} recommandations générées avec succès',
            'generated_count': generated_count,
            'errors': errors,
            'total_processed': len(diseases_without_recs)
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur dans bulk_generate_recommendations: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Erreur lors de la génération en masse',
            'success': False,
            'details': str(e)
        }), 500