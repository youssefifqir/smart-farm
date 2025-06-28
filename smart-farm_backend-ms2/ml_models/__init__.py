# # import os
# # import tensorflow as tf
# # import logging

# # logger = logging.getLogger(__name__)

# # def get_model_path(model_name):
# #     """Get the full path to a ML model file"""
# #     return os.path.join(os.path.dirname(__file__), model_name)

# # def load_plant_disease_model():
# #     """Load the plant disease detection model"""
# #     model_path = get_model_path('plant_disease_model.h5')
    
# #     try:
# #         if os.path.exists(model_path):
# #             model = tf.keras.models.load_model(model_path)
# #             logger.info(f"Modèle chargé depuis: {model_path}")
# #             return model
# #         else:
# #             logger.warning(f"Modèle non trouvé: {model_path}")
# #             return None
# #     except Exception as e:
# #         logger.error(f"Erreur lors du chargement du modèle: {e}")
# #         return None

# # # Constantes pour les modèles
# # PLANT_DISEASE_MODEL_PATH = get_model_path('plant_disease_model.h5')
# # MODEL_INFO_PATH = get_model_path('model_info.json')

# # __all__ = ['get_model_path', 'load_plant_disease_model', 'PLANT_DISEASE_MODEL_PATH']

# import os
# import logging
# import joblib

# logger = logging.getLogger(__name__)

# def load_plant_disease_model():
#     """Charge le modèle de détection de maladies des plantes"""
#     try:
#        # model_path = os.path.join(os.path.dirname(__file__), 'plant_disease_model.joblib')
#         model_path = os.path.join(os.path.dirname(__file__), 'plant_disease_model.joblib')
        
#         if not os.path.exists(model_path):
#             logger.error(f"Modèle non trouvé à l'emplacement: {model_path}")
#             return None
        
#         logger.info(f"Chargement du modèle depuis: {model_path}")
#         #model = tf.keras.models.load_model(model_path)
#         model = joblib.load(model_path)
#         logger.info("Modèle chargé avec succès")
#         logger.info(f"Architecture du modèle: {model.input_shape} -> {model.output_shape}")
        
#         return model
        
#     except Exception as e:
#         logger.error(f"Erreur lors du chargement du modèle: {str(e)}")
#         return None



import os
import logging
import joblib
import numpy as np
from PIL import Image
# filepath: c:\Users\hp\smart-farm\smart-farm_backend-ms2\ml_models\__init__.py
from services.disease_detection import DiseaseDetectionService

# Instance globale

logger = logging.getLogger(__name__)

def load_plant_disease_model():
    """Charge le modèle de détection de maladies des plantes"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'plant_disease_model.joblib')
        
        if not os.path.exists(model_path):
            logger.error(f"Modèle non trouvé à l'emplacement: {model_path}")
            return None
        
        logger.info(f"Chargement du modèle depuis: {model_path}")
        model = joblib.load(model_path)
        logger.info("Modèle chargé avec succès")
        
        return model
        
    except Exception as e:
        logger.error(f"Erreur lors du chargement du modèle: {str(e)}")
        return None



def predict_disease(image_path):
    """Prédire la maladie à partir d'une image en utilisant DiseaseDetectionService"""
    try:
        # Crée l'instance ici, dans le contexte Flask
        disease_service = DiseaseDetectionService()
        result = disease_service.predict_disease(image_path)
        return result
    except Exception as e:
        print(f"Erreur lors de la prédiction: {str(e)}")
        return None



# def predict_disease(image_path):
#     """Prédire la maladie à partir d'une image"""
#     try:
#         model = load_plant_disease_model()
#         if model is None:
#             return None
            
#         # Classes pour les maladies de tomates
#         class_names = [
#             'Tomato___Bacterial_spot',
#             'Tomato___Early_blight', 
#             'Tomato___Late_blight',
#             'Tomato___Leaf_Mold',
#             'Tomato___Septoria_leaf_spot',
#             'Tomato___Spider_mites',
#             'Tomato___Target_Spot',
#             'Tomato___Yellow_Leaf_Curl_Virus',
#             'Tomato___Mosaic_virus',
#             'Tomato___Healthy'
#         ]
        
#         # Préprocesser l'image
#         image = Image.open(image_path)
#         if image.mode != 'RGB':
#             image = image.convert('RGB')
        
#         image = image.resize((224, 224))
#         image_array = np.array(image)
#         image_array = image_array.astype(np.float32) / 255.0
#         image_array = np.expand_dims(image_array, axis=0)
        
#         # Prédiction (simulation pour joblib)
#         # En réalité, adaptez selon votre modèle joblib
#         prediction = np.random.rand(len(class_names))
#         predicted_idx = np.argmax(prediction)
#         confidence = float(prediction[predicted_idx])
        
#         disease_name = class_names[predicted_idx]
        
#         # Extraire les informations
#         parts = disease_name.split('___')
#         plant_type = parts[0]
#         disease = parts[1] if len(parts) > 1 else 'Unknown'
        
#         return {
#             'disease_name': disease.replace('_', ' '),
#             'plant_type': plant_type,
#             'confidence': confidence,
#             'raw_prediction': disease_name
#         }
        
#     except Exception as e:
#         logger.error(f"Erreur lors de la prédiction: {str(e)}")
#         return None



