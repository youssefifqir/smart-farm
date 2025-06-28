
# import numpy as np
# from PIL import Image
# import os
# import json
# from flask import current_app
# import joblib
# from skimage.feature import hog
# from datetime import datetime
# import pytz
# import cv2
# import mahotas
# from services.crop_health_api import identify_crop_disease
# import tempfile


# class DiseaseDetectionService:
    
#     def __init__(self):
        
#         # self.model = None
#         # self.class_names = None
#         self.load_model()
#         self.load_class_names()
#         print("model.classes_:", self.model.classes_)
#         print("class_names:", self.class_names)
    
#     def load_model(self):
#         """Charger le modèle de détection de maladies"""
#         try:
#             model_path = current_app.config['MODEL_PATH']
#             if os.path.exists(model_path):
#                 self.model = joblib.load(model_path)
#                 print(f"Modèle SVM chargé avec succès depuis {model_path}")
#             else:
#                 print(f"Erreur: Modèle non trouvé à {model_path}")
#                 raise FileNotFoundError(f"Modèle non trouvé à {model_path}")
#         except Exception as e:
#             print(f"Erreur lors du chargement du modèle: {str(e)}")
#             raise e
    
#     def load_class_names(self):
#         """Charger la liste des noms de classes (maladies)"""
#         # Vous pouvez adapter cette liste selon votre modèle
#         self.class_names = [
#             'Tomato_Leaf_Mold',
#             'Tomato_healthy',
#             'Tomato_Septoria_leaf_spot',
#             'Tomato_Late_blight',
#             'Tomato__Tomato_mosaic_virus',
#             'Tomato__Target_Spot',
#             'Tomato_Spider_mites_Two_spotted_spider_mite',
#             'Tomato__Tomato_YellowLeaf__Curl_Virus',
#             'Tomato_Early_blight',
#             'Tomato_Bacterial_spot'
#         ]
    

#     # def preprocess_image(self, image_file):
#     #     """Prétraiter l'image pour la prédiction SVM"""
#     #     try:
#     #         image = Image.open(image_file)
#     #         if image.mode != 'RGB':
#     #             image = image.convert('RGB')
#     #         image = image.resize((224, 224))
#     #         image_array = np.array(image)
#     #         image_array = image_array.astype(np.float32) / 255.0

#     #         # Extraction des features HOG (adapter les paramètres à ceux du notebook)
#     #         features = hog(
#     #                     image_array,
#     #                     orientations=9,
#     #                     pixels_per_cell=(8, 8),
#     #                     cells_per_block=(2, 2),
#     #                     channel_axis=-1  # Remplace multichannel=True
#     #         )
#     #         features = features.reshape(1, -1)
#     #         return features
#     #     except Exception as e:
#     #         print(f"Erreur lors du préprocessing de l'image: {str(e)}")
#     #         raise e


#     def preprocess_image(self, image_file):
#         """Prétraiter l'image pour la prédiction SVM (mêmes features que le notebook)"""
#         try:
#             # Ouvre l'image avec PIL puis convertit en format utilisable par OpenCV
#             image = Image.open(image_file)
#             image = image.convert('RGB')
#             image_np = np.array(image)
#             # OpenCV attend BGR
#             image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

#             # Resize à 256x256 comme dans le notebook
#             image_resized = cv2.resize(image_cv, (256, 256))
#             image_hsv = cv2.cvtColor(image_resized, cv2.COLOR_BGR2HSV)
#             features = []

#             # Histogrammes HSV
#             hist_h = cv2.calcHist([image_hsv], [0], None, [256], [0, 256]).flatten()
#             hist_s = cv2.calcHist([image_hsv], [1], None, [256], [0, 256]).flatten()
#             hist_v = cv2.calcHist([image_hsv], [2], None, [256], [0, 256]).flatten()

#             # Texture Haralick
#             gray_image = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)
#             haralick = mahotas.features.haralick(gray_image).mean(axis=0)

#             # Moments de couleur
#             moments = cv2.meanStdDev(image_resized)
#             color_moments = np.hstack([moments[0], moments[1]]).flatten()

#             # Fusion des features
#             features.extend(hist_h)
#             features.extend(hist_s)
#             features.extend(hist_v)
#             features.extend(haralick)
#             features.extend(color_moments)

#             features = np.array(features).reshape(1, -1)
#             print(f"[DEBUG] Nombre de features extraites : {features.shape[1]}")
#             return features
#         except Exception as e:
#             print(f"Erreur lors du préprocessing de l'image: {str(e)}")
#             raise e

    
#     # def predict_disease(self, image_file):
#     #     print(">>> predict_disease appelée")
#     #     """Prédire la maladie de la plante"""
#     #     try:
#     #         if self.model is None:
#     #             raise Exception("Modèle non chargé")
            
#     #         # Préprocesser l'image
#     #         processed_image = self.preprocess_image(image_file)
            
#     #         # Faire la prédiction
#     #         predicted_class_index = int(self.model.predict(processed_image)[0])

#     #         # Si le modèle a été entraîné avec probability=True
#     #         if hasattr(self.model, "predict_proba"):
#     #             proba = self.model.predict_proba(processed_image)
#     #             confidence = float(np.max(proba))
#     #         else:
#     #             confidence = 1.0  # ou None si tu veux

#     #         # Log de la classe prédite et de la confiance
#     #         print(f"[LOG] Classe prédite: {self.class_names[predicted_class_index]} | Confiance: {confidence:.4f}")

#     #         # Obtenir le nom de la maladie
#     #         disease_name = self.class_names[predicted_class_index]
            
#     #         # Extraire le type de plante et la maladie
#     #         parts = disease_name.split('_', 1)
#     #         plant_type = parts[0].replace('_', ' ')
#     #         disease = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
            
#     #         # Si la plante est saine, retourne explicitement ce statut
#     #         if disease.lower() == "healthy":
#     #             return {
#     #                 'disease_name': "Healthy",
#     #                 'plant_type': plant_type,
#     #                 'confidence_score': confidence,
#     #                 'severity': "Aucune",
#     #                 'raw_prediction': disease_name
#     #             }
        
#     #         # Déterminer la sévérité basée sur la confiance
#     #         if confidence > 0.9:
#     #             severity = "Élevée"
#     #         elif confidence > 0.7:
#     #             severity = "Modérée"
#     #         else:
#     #             severity = "Faible"
                
#     #         tz = pytz.timezone('Africa/Casablanca')
#     #         print("Heure système locale :", datetime.now())

#     #         return {
#     #             'disease_name': disease,
#     #             'plant_type': plant_type,
#     #             'confidence_score': confidence,
#     #             'created_at': datetime.now(tz).strftime('%Y-%m-%d %H:%M:%S'),                'severity': severity,
#     #             'raw_prediction': disease_name
#     #         }
            
#     #     except Exception as e:
#     #         print(f"Erreur lors de la prédiction: {str(e)}")
#     #         raise e
    
    


#     def predict_disease(self, image_file, latitude=None, longitude=None, dt=None):
#         print(">>> predict_disease appelée (API externe)")
#         try:
#             # Sauvegarder l'image temporairement
#             with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
#                 image_file.seek(0)
#                 tmp.write(image_file.read())
#                 tmp_path = tmp.name

#             # Appel à l'API externe
#             api_result = identify_crop_disease(
#                 image_path=tmp_path,
#                 latitude=latitude,
#                 longitude=longitude,
#                 datetime=dt
#             )

#             os.remove(tmp_path)

#             if "error" in api_result:
#                 raise Exception(api_result["error"])

#             # Parsing de la réponse selon ton exemple
#             result = api_result.get("result", {})
#             crop_suggestions = result.get("crop", {}).get("suggestions", [])
#             disease_suggestions = result.get("disease", {}).get("suggestions", [])

#             plant_type = crop_suggestions[0]["name"] if crop_suggestions else "Unknown"
#             disease_name = disease_suggestions[0]["name"] if disease_suggestions else "Unknown"
#             confidence = disease_suggestions[0].get("probability", 0.0) if disease_suggestions else 0.0
#             details = disease_suggestions[0].get("details", {}) if disease_suggestions else {}

#             created_at = datetime.now(pytz.timezone('Africa/Casablanca')).strftime('%Y-%m-%d %H:%M:%S')

#             return {
#                 "disease_name": disease_name,
#                 "plant_type": plant_type,
#                 "confidence_score": confidence,
#                 "created_at": created_at,
#                 "details": details,
#                 "raw_prediction": api_result
#             }

#         except Exception as e:
#             print(f"Erreur lors de la prédiction via API: {str(e)}")
#             raise e
    
    
#     def get_top_predictions(self, image_file, top_k=3):
#         """Obtenir les top K prédictions"""
#         try:
#             processed_image = self.preprocess_image(image_file)
#             predictions = self.model.predict(processed_image)
            
#             # Obtenir les indices des top K prédictions
#             top_indices = np.argsort(predictions[0])[-top_k:][::-1]
            
#             results = []
#             for idx in top_indices:
#                 disease_name = self.class_names[idx]
#                 confidence = float(predictions[0][idx])
                
#                 parts = disease_name.split('___')
#                 plant_type = parts[0].replace('_', ' ')
#                 disease = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
                
#                 results.append({
#                     'disease_name': disease,
#                     'plant_type': plant_type,
#                     'confidence_score': confidence,
#                     'raw_prediction': disease_name
#                 })
            
#             return results
            
#         except Exception as e:
#             print(f"Erreur lors des top prédictions: {str(e)}")
#             raise e

# services/disease_detection.py 
import tempfile
import os
from datetime import datetime
import pytz
import logging
from services.crop_health_api import identify_crop_disease

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseaseDetectionService:
    def __init__(self):
        logger.info("Service de détection de maladies initialisé")
    
    def predict_disease(self, image_file, latitude=None, longitude=None, dt=None):
        """
        Prédire une maladie de plante via l'API externe Crop.health
        
        Args:
            image_file: Fichier image (FileStorage)
            latitude (float, optional): Latitude GPS
            longitude (float, optional): Longitude GPS
            dt (str, optional): Date/heure
        
        Returns:
            dict: Résultat de la prédiction avec informations structurées
        """
        logger.info(">>> predict_disease appelée (API externe Crop.health)")
        tmp_path = None
        
        try:
            # Validation de l'image
            if not image_file:
                raise ValueError("Aucun fichier image fourni")
            
            # Vérifier le type de fichier
            allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}
            filename = image_file.filename.lower() if image_file.filename else ''
            if not any(filename.endswith(ext) for ext in [f'.{ext}' for ext in allowed_extensions]):
                raise ValueError("Format d'image non supporté. Utilisez JPG, PNG, GIF ou BMP")
            
            # CORRECTION: Réinitialiser le pointeur avant de lire
            image_file.seek(0)
            
            # CORRECTION: Appeler directement l'API avec le fichier
            api_result = identify_crop_disease(image_file)
            
            # CORRECTION: Vérifier d'abord le type de réponse
            logger.info(f"Type de réponse API: {type(api_result)}")
            logger.info(f"Contenu de la réponse API: {api_result}")
            
            # Vérifier s'il y a une erreur dans la réponse API
            if not api_result:
                error_msg = "Aucune réponse de l'API"
                logger.error(f"Erreur API Crop.health: {error_msg}")
                raise Exception(f"Erreur API Crop.health: {error_msg}")
            
            # CORRECTION: Gérer différents types de réponses
            if isinstance(api_result, dict) and "error" in api_result:
                error_msg = api_result.get("error", "Erreur inconnue de l'API")
                logger.error(f"Erreur API Crop.health: {error_msg}")
                raise Exception(f"Erreur API Crop.health: {error_msg}")
            
            # Parser la réponse de l'API
            result = self._parse_crop_health_response(api_result)
            
            logger.info("Prédiction réussie via API Crop.health")
            return result
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction via API: {str(e)}")
            # Retourner une réponse d'erreur structurée
            return self._get_error_response(str(e))
        finally:
            # Nettoyer le fichier temporaire si créé
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                    logger.info("Fichier temporaire supprimé")
                except Exception as e:
                    logger.warning(f"Impossible de supprimer le fichier temporaire: {e}")
    
    def _parse_crop_health_response(self, api_result):
        """
        Parser la réponse de l'API Crop.health selon le format réel
        
        Args:
            api_result (dict): Réponse brute de l'API
        
        Returns:
            dict: Données structurées pour l'application
        """
        try:
            # CORRECTION: Gérer différents formats de réponse
            
            # Si c'est déjà une réponse parsée de crop_health_api.py
            if isinstance(api_result, dict) and "success" in api_result:
                return self._handle_parsed_response(api_result)
            
            # Si c'est la réponse brute de l'API
            if isinstance(api_result, dict) and "result" in api_result:
                return self._handle_raw_response(api_result)
            
            # Format inattendu
            logger.warning(f"Format de réponse inattendu: {type(api_result)}")
            raise Exception(f"Format de réponse API inattendu: {type(api_result)}")
            
        except Exception as e:
            logger.error(f"Erreur lors du parsing de la réponse API: {str(e)}")
            raise Exception(f"Erreur lors du traitement de la réponse API: {str(e)}")
    
    def _handle_parsed_response(self, parsed_result):
        """
        Gérer une réponse déjà parsée par crop_health_api.py
        """
        try:
            if not parsed_result.get("success", False):
                error_msg = parsed_result.get("error", "Erreur inconnue")
                raise Exception(error_msg)
            
            disease_name = parsed_result.get("disease_name", "Maladie inconnue")
            confidence = parsed_result.get("disease_probability", 0.0)
            plant_type = parsed_result.get("crop_name", "Unknown")
            scientific_name = parsed_result.get("scientific_name", "")
            
            # Déterminer la sévérité basée sur la probabilité
            if confidence >= 0.7:
                severity = "high"
            elif confidence >= 0.4:
                severity = "medium"
            else:
                severity = "low"
            
            details = {
                "scientific_name": scientific_name,
                "plant_confidence": parsed_result.get("plant_confidence", 0),
                "similar_images": parsed_result.get("similar_images", []),
                "all_diseases": parsed_result.get("all_diseases", []),
                "details": parsed_result.get("details", {})
            }
            
            # Timestamp
            created_at = datetime.now(pytz.timezone('Africa/Casablanca')).isoformat()
            
            structured_result = {
                "disease_name": disease_name,
                "plant_type": plant_type,
                "confidence_score": float(confidence),
                "severity": severity,
                "created_at": created_at,
                "details": details,
                "raw_prediction": parsed_result,
                "success": True
            }
            
            logger.info(f"Maladie détectée: {disease_name} ({confidence:.2%} confiance) - Sévérité: {severity}")
            return structured_result
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement de la réponse parsée: {str(e)}")
            raise Exception(f"Erreur lors du traitement de la réponse parsée: {str(e)}")
    
    def _handle_raw_response(self, api_result):
        """
        Gérer la réponse brute de l'API Crop.health
        """
        try:
            # Vérifier d'abord si c'est une plante
            result = api_result.get("result", {})
            is_plant = result.get("is_plant", {})
            
            plant_probability = is_plant.get("probability", 0)
            plant_binary = is_plant.get("binary", False)
            
            logger.info(f"Détection de plante - Binary: {plant_binary}, Probability: {plant_probability}")
            
            # CORRECTION: Vérifier correctement la détection de plante
            if not plant_binary or plant_probability < 0.5:
                raise Exception(f"Image ne contient pas de plante détectable (confiance: {plant_probability:.2%})")
            
            # Informations sur la culture/plante
            crop_suggestions = result.get("crop", {}).get("suggestions", [])
            plant_type = "Unknown"
            if crop_suggestions:
                plant_type = crop_suggestions[0].get("name", "Unknown")
            
            # Informations sur la maladie selon le format réel
            disease_suggestions = result.get("disease", {}).get("suggestions", [])
            
            if not disease_suggestions:
                raise Exception("Aucune maladie détectée dans l'image")
            
            # Prendre la maladie avec la plus haute probabilité
            top_disease = max(disease_suggestions, key=lambda x: x.get("probability", 0))
            
            disease_name = top_disease.get("name", "Maladie inconnue")
            confidence = top_disease.get("probability", 0.0)
            scientific_name = top_disease.get("scientific_name", "")
            
            # Déterminer la sévérité basée sur la probabilité
            if confidence >= 0.7:
                severity = "high"
            elif confidence >= 0.4:
                severity = "medium"
            else:
                severity = "low"
            
            # Extraire les détails selon le format réel
            details = {
                "scientific_name": scientific_name,
                "entity_id": top_disease.get("details", {}).get("entity_id", ""),
                "similar_images": top_disease.get("similar_images", []),
                "all_suggestions": disease_suggestions,
                "is_plant_confidence": plant_probability,
                "access_token": api_result.get("access_token", "")
            }
            
            # Timestamp - Format ISO pour cohérence
            created_at = datetime.now(pytz.timezone('Africa/Casablanca')).isoformat()
            
            # Structure de réponse standardisée COMPATIBLE avec vos modèles
            structured_result = {
                "disease_name": disease_name,
                "plant_type": plant_type,
                "confidence_score": float(confidence),
                "severity": severity,
                "created_at": created_at,
                "details": details,
                "raw_prediction": api_result,
                "success": True
            }
            
            logger.info(f"Maladie détectée: {disease_name} ({confidence:.2%} confiance) - Sévérité: {severity}")
            return structured_result
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement de la réponse brute: {str(e)}")
            raise Exception(f"Erreur lors du traitement de la réponse brute: {str(e)}")
    
    def _get_error_response(self, error_message):
        """
        Créer une réponse d'erreur standardisée
        
        Args:
            error_message (str): Message d'erreur
        
        Returns:
            dict: Réponse d'erreur structurée
        """
        return {
            "disease_name": "Erreur de détection",
            "plant_type": "Unknown",
            "confidence_score": 0.0,
            "severity": "unknown",
            "created_at": datetime.now(pytz.timezone('Africa/Casablanca')).isoformat(),
            "details": {"error": error_message},
            "raw_prediction": None,
            "success": False,
            "error": error_message
        }