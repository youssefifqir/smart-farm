# import requests
# import base64
# from config import Config


# def identify_crop_disease(image_path, latitude=None, longitude=None, datetime=None, similar_images=True):
#     try:
#         with open(image_path, "rb") as image_file:
#             base64_image = base64.b64encode(image_file.read()).decode("utf-8")
#         payload = {
#             "images": [base64_image],
#             "latitude": latitude,
#             "longitude": longitude,
#             "datetime": datetime,
#             "similar_images": True  # Toujours envoyer True
#         }
#         headers = {
#             "Api-Key": Config.API_KEY,
#             "Content-Type": "application/json"
#         }
#         response = requests.post(Config.CROP_HEALTH_URL, headers=headers, json=payload)
#         if response.status_code == 200:
#             return response.json()
#         else:
#             return {"error": response.json(), "status_code": response.status_code}
#     except Exception as e:
#         return {"error": str(e)}
# services/crop_health_api.py 

# import requests
# import base64
# from flask import current_app
# import logging

# # Configuration du logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def identify_crop_disease(image_file):
#     """
#     Identifie les maladies des plantes via l'API Crop.health
#     """
#     try:
#         # Préparer les données pour l'API
#         files = {
#             'images': (image_file.filename, image_file.read(), image_file.content_type)
#         }
        
#         # Données additionnelles (optionnelles mais recommandées)
#         data = {
#             'modifiers': '["similar_images"]',  # Pour obtenir les images similaires
#             # 'plant_details': '["common_names"]'  # Optionnel
#         }
        
#         headers = {
#             'Api-Key': current_app.config.get('CROP_HEALTH_API_KEY')
#         }
        
#         response = requests.post(
#             "https://crop.kindwise.com/api/v1/identification",
#             files=files,
#             data=data,
#             headers=headers,
#             timeout=30
#         )
        
#         if response.status_code == 200:
#             result = response.json()
#             logger.info(f"API Response: {result}")
#             return parse_crop_health_response(result)
#         else:
#             logger.error(f"Erreur API: {response.status_code} - {response.text}")
#             return None
            
#     except Exception as e:
#         logger.error(f"Erreur lors de l'identification: {str(e)}")
#         return None

# def parse_crop_health_response(api_response):
#     """
#     Parse la réponse de l'API Crop.health selon le format réel
#     """
#     try:
#         # Vérifier si c'est bien une plante
#         is_plant = api_response.get('result', {}).get('is_plant', {})
#         if not is_plant.get('binary', False):
#             return {
#                 'success': False,
#                 'error': 'Image ne contient pas de plante détectable',
#                 'confidence': is_plant.get('probability', 0)
#             }
        
#         # Extraire les maladies détectées
#         disease_suggestions = api_response.get('result', {}).get('disease', {}).get('suggestions', [])
        
#         if not disease_suggestions:
#             return {
#                 'success': False,
#                 'error': 'Aucune maladie détectée',
#                 'is_plant_confidence': is_plant.get('probability', 0)
#             }
        
#         # Prendre la maladie avec la plus haute probabilité
#         best_disease = max(disease_suggestions, key=lambda x: x.get('probability', 0))
        
#         # Extraire le type de plante détecté
#         crop_suggestions = api_response.get('result', {}).get('crop', {}).get('suggestions', [])
#         plant_type = crop_suggestions[0].get('name') if crop_suggestions else 'unknown'
        
#         # Déterminer la sévérité basée sur la probabilité
#         confidence = best_disease.get('probability', 0)
#         if confidence >= 0.7:
#             severity = 'high'
#         elif confidence >= 0.4:
#             severity = 'medium'
#         else:
#             severity = 'low'
        
#         return {
#             'success': True,
#             'disease_name': best_disease.get('name', 'Unknown'),
#             'scientific_name': best_disease.get('scientific_name', ''),
#             'confidence_score': confidence,
#             'plant_type': plant_type,
#             'severity': severity,
#             'access_token': api_response.get('access_token'),
#             'similar_images': best_disease.get('similar_images', []),
#             'all_suggestions': disease_suggestions,  # Pour debug/analyse
#             'is_plant_confidence': is_plant.get('probability', 0)
#         }
        
#     except Exception as e:
#         logger.error(f"Erreur lors du parsing: {str(e)}")
#         return {
#             'success': False,
#             'error': f'Erreur de parsing: {str(e)}'
#         }

import base64
import requests
import logging
from flask import current_app

logger = logging.getLogger(__name__)

def identify_crop_disease(image_file):
    """
    Identifie les maladies des plantes via l'API Crop.health
    """
    try:
        # Lire et encoder l'image en base64
        image_file.seek(0)  # S'assurer qu'on est au début du fichier
        image_data = image_file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Préparer le corps de la requête JSON
        payload = {
            "images": [image_base64],
            "latitude": None,
            "longitude": None,
            "similar_images": True
        }
        
        headers = {
            'Api-Key': current_app.config.get('CROP_HEALTH_API_KEY'),
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            "https://crop.kindwise.com/api/v1/identification",
            json=payload,  # Utiliser json= au lieu de data= et files=
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 201:  # L'API retourne 201 Created
            result = response.json()
            logger.info(f"API Response: {result}")
            return parse_crop_health_response(result)
        else:
            logger.error(f"Erreur API: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Erreur lors de l'identification: {str(e)}")
        return None

def parse_crop_health_response(response_data):
    """
    Parse la réponse de l'API Crop.health
    """
    try:
        # Vérifier si c'est bien une plante
        if 'result' not in response_data:
            return {'error': 'Pas de résultat dans la réponse API'}
        
        result = response_data['result']
        
        # Vérifier la détection de plante
        is_plant_info = result.get('is_plant', {})
        is_plant_binary = is_plant_info.get('binary', False)
        is_plant_probability = is_plant_info.get('probability', 0)
        
        logger.info(f"Détection de plante - Binary: {is_plant_binary}, Probability: {is_plant_probability}")
        
        if not is_plant_binary or is_plant_probability < 0.5:
            return {
                'error': f'Image ne contient pas de plante détectable (confiance: {is_plant_probability*100:.1f}%)'
            }
        
        # Traiter les suggestions de maladies
        disease_info = result.get('disease', {})
        disease_suggestions = disease_info.get('suggestions', [])
        
        if not disease_suggestions:
            return {
                'error': 'Aucune maladie détectée',
                'plant_detected': True,
                'plant_confidence': is_plant_probability
            }
        
        # Prendre la suggestion la plus probable
        best_disease = max(disease_suggestions, key=lambda s: s.get('probability', 0))
        
        # Traiter les informations de culture si disponibles
        crop_info = result.get('crop', {})
        crop_suggestions = crop_info.get('suggestions', [])
        crop_name = None
        if crop_suggestions:
            best_crop = max(crop_suggestions, key=lambda s: s.get('probability', 0))
            crop_name = best_crop.get('name')
        
        return {
            'success': True,
            'plant_detected': True,
            'plant_confidence': is_plant_probability,
            'disease_name': best_disease.get('name', ''),
            'disease_probability': best_disease.get('probability', 0),
            'scientific_name': best_disease.get('scientific_name', ''),
            'crop_name': crop_name,
            'details': best_disease.get('details', {}),
            'similar_images': best_disease.get('similar_images', []),
            'all_diseases': [
                {
                    'name': disease.get('name', ''),
                    'probability': disease.get('probability', 0),
                    'scientific_name': disease.get('scientific_name', '')
                }
                for disease in disease_suggestions[:5]  # Top 5 diseases
            ]
        }
        
    except Exception as e:
        logger.error(f"Erreur lors du parsing de la réponse API: {str(e)}")
        return {'error': f'Erreur lors du parsing: {str(e)}'}

def format_disease_result(parsed_result):
    """
    Formate le résultat pour l'affichage
    """
    if 'error' in parsed_result:
        return parsed_result
    
    try:
        formatted = {
            'status': 'success',
            'plant_detected': parsed_result.get('plant_detected', False),
            'plant_confidence': f"{parsed_result.get('plant_confidence', 0)*100:.1f}%",
            'primary_disease': {
                'name': parsed_result.get('disease_name', ''),
                'scientific_name': parsed_result.get('scientific_name', ''),
                'confidence': f"{parsed_result.get('disease_probability', 0)*100:.1f}%"
            },
            'crop_type': parsed_result.get('crop_name', 'Non identifié'),
            'alternative_diseases': parsed_result.get('all_diseases', []),
            'similar_images_count': len(parsed_result.get('similar_images', [])),
            'recommendation': generate_treatment_recommendation(parsed_result.get('disease_name', ''))
        }
        return formatted
    except Exception as e:
        logger.error(f"Erreur lors du formatage: {str(e)}")
        return {'error': f'Erreur lors du formatage: {str(e)}'}

def generate_treatment_recommendation(disease_name):
    """
    Génère une recommandation de traitement basée sur le nom de la maladie
    """
    recommendations = {
        'alternaria brown spot': "Appliquez un fongicide à base de cuivre. Améliorez la circulation d'air et évitez l'arrosage sur les feuilles.",
        'early blight': "Utilisez des fongicides préventifs. Retirez les feuilles infectées et améliorez la rotation des cultures.",
        'septoria leaf spot': "Appliquez des fongicides systémiques. Évitez l'arrosage par aspersion et améliorez l'espacement des plants.",
        'anthracnose': "Traitez avec des fongicides à base de cuivre. Assurez-vous d'un bon drainage et évitez l'humidité excessive.",
        'powdery mildew': "Utilisez des fongicides anti-oïdium. Améliorez la ventilation et réduisez l'humidité.",
        'bacterial spots and speck': "Appliquez des traitements à base de cuivre. Évitez l'arrosage foliaire et désinfectez les outils."
    }
    
    disease_lower = disease_name.lower()
    for disease, recommendation in recommendations.items():
        if disease in disease_lower:
            return recommendation
    
    return "Consultez un spécialiste en phytopathologie pour un diagnostic précis et un traitement approprié."