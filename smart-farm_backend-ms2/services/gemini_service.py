# import google.generativeai as genai
# from flask import current_app
# import json
# import re

# class GeminiService:
#     def __init__(self, api_key):
#         self.api_key = api_key
#         self.setup_gemini()
    
#     def setup_gemini(self):
#         """Configurer l'API Gemini"""
#         try:
#             api_key = self.api_key
#             if not api_key:
#                 raise ValueError("GEMINI_API_KEY non configurée")
            
#             genai.configure(api_key=api_key)
#             self.model = genai.GenerativeModel('gemini-1.5-flash')
#             print("Service Gemini configuré avec succès")
            
#         except Exception as e:
#             print(f"Erreur lors de la configuration de Gemini: {str(e)}")
#             raise e
    
#     def get_treatment_recommendations(self, disease_info):
#         """Générer des recommandations de traitement avec Gemini"""
#         try:
#             disease_name = disease_info.get('disease_name', 'Unknown')
#             plant_type = disease_info.get('plant_type', 'Tomato')
#             confidence = disease_info.get('confidence', 0)
            
#             # Construire le prompt pour Gemini
#             prompt = self._build_treatment_prompt(disease_name, plant_type, confidence)
            
#             # Générer la réponse
#             response = self.model.generate_content(prompt)
            
#             # Parser et structurer la réponse
#             structured_response = self._parse_gemini_response(response.text, disease_name)
            
#             return structured_response
            
#         except Exception as e:
#             print(f"Erreur lors de la génération de recommandations: {str(e)}")
#             # Retourner une réponse par défaut en cas d'erreur
#             return self._get_default_recommendation(disease_info)
    
#     def _build_treatment_prompt(self, disease_name, plant_type, confidence):
#         """Construire le prompt pour Gemini"""
#         prompt = f"""
# En tant qu'expert en phytopathologie spécialisé dans les maladies des tomates, analysez cette maladie et fournissez des recommandations détaillées :

# **Informations de la maladie :**
# - Maladie détectée: {disease_name}
# - Type de plante: {plant_type}
# - Niveau de confiance: {confidence:.2f}

# **Veuillez fournir une réponse structurée EXACTEMENT selon ce format:**

# TRAITEMENT_CHIMIQUE:
# - Nom du produit 1 (matière active)
# - Nom du produit 2 (matière active)
# - Dosage: X g/L ou ml/ha
# - Application: méthode précise
# - Fréquence: tous les X jours

# TRAITEMENT_BIOLOGIQUE:
# - Alternative bio 1
# - Alternative bio 2

# PREVENTION:
# - Conseil préventif 1
# - Conseil préventif 2
# - Conseil préventif 3

# URGENCE: FAIBLE/MOYENNE/ELEVEE

# RECUPERATION: X semaines/mois

# **Important**: 
# - Donnez des noms de produits commerciaux réels et précis
# - Spécifiez les matières actives entre parenthèses
# - Utilisez des dosages réalistes
# - Privilégiez les solutions disponibles au Maroc
# """
#         return prompt
    
#     def _parse_gemini_response(self, response_text, disease_name):
#         """Parser et structurer la réponse de Gemini"""
#         try:
#             print(f"Réponse brute de Gemini: {response_text[:500]}...")  # Debug
            
#             # Nettoyer le texte
#             clean_text = self._clean_text(response_text)
            
#             # Extraire les sections
#             sections = self._extract_sections_improved(clean_text)
            
#             # Structurer la réponse
#             structured_response = {
#                 'treatment_type': 'Intégré',
#                 'description': f"Traitement recommandé pour {disease_name}",
#                 'products': self._extract_products_improved(sections),
#                 'application_method': self._extract_application_method_improved(sections),
#                 'dosage': self._extract_dosage_improved(sections),
#                 'frequency': self._extract_frequency_improved(sections),
#                 'prevention_tips': self._extract_prevention_tips_improved(sections),
#                 'urgency_level': self._extract_urgency_improved(sections),
#                 'recovery_time': self._extract_recovery_time_improved(sections)
#             }
            
#             print(f"Réponse structurée: {structured_response}")  # Debug
#             return structured_response
            
#         except Exception as e:
#             print(f"Erreur lors du parsing de la réponse Gemini: {str(e)}")
#             return self._get_default_recommendation({'disease_name': disease_name})
    
#     def _extract_sections_improved(self, text):
#         """Méthode améliorée pour extraire les sections"""
#         sections = {
#             'TRAITEMENT_CHIMIQUE': '',
#             'TRAITEMENT_BIOLOGIQUE': '',
#             'PREVENTION': '',
#             'URGENCE': '',
#             'RECUPERATION': ''
#         }
        
#         # Patterns plus robustes pour identifier les sections
#         patterns = {
#             'TRAITEMENT_CHIMIQUE': r'TRAITEMENT[_\s]*CHIMIQUE[:\s]*(.+?)(?=TRAITEMENT[_\s]*BIOLOGIQUE|PREVENTION|$)',
#             'TRAITEMENT_BIOLOGIQUE': r'TRAITEMENT[_\s]*BIOLOGIQUE[:\s]*(.+?)(?=PREVENTION|URGENCE|$)',
#             'PREVENTION': r'PREVENTION[:\s]*(.+?)(?=URGENCE|RECUPERATION|$)',
#             'URGENCE': r'URGENCE[:\s]*([^\n]+)',
#             'RECUPERATION': r'RECUPERATION[:\s]*([^\n]+)'
#         }
        
#         for section_name, pattern in patterns.items():
#             match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
#             if match:
#                 sections[section_name] = match.group(1).strip()
        
#         return sections
    
#     def _extract_products_improved(self, sections):
#         """Extraction améliorée des produits"""
#         products = []
        
#         # Combiner le texte des traitements chimiques et biologiques
#         treatment_text = sections.get('TRAITEMENT_CHIMIQUE', '') + ' ' + sections.get('TRAITEMENT_BIOLOGIQUE', '')
        
#         # Patterns améliorés pour les produits
#         patterns = [
#             # Nom commercial (matière active)
#             r'([A-Z][a-zA-Z]+(?:\s+[A-Z0-9][a-zA-Z0-9]*)*)\s*\(([^)]+)\)',
#             # Produits avec matières actives connues
#             r'(Mancozèbe|Chlorothalonil|Azoxystrobine|Tébuconazole|Cuivre|Soufre|Bordeaux)',
#             # Noms commerciaux courants
#             r'(Ridomil|Antracol|Bravo|Amistar|Folicur|Bouillie\s+bordelaise)',
#             # Pattern générique pour fongicides
#             r'([A-Z][a-zA-Z]+)\s+(?:fongicide|fungicide)'
#         ]
        
#         for pattern in patterns:
#             matches = re.findall(pattern, treatment_text, re.IGNORECASE)
#             if isinstance(matches[0] if matches else None, tuple):
#                 # Si le pattern retourne des tuples, prendre le premier élément
#                 products.extend([match[0] for match in matches])
#             else:
#                 products.extend(matches)
        
#         # Nettoyer et filtrer
#         cleaned_products = []
#         for product in products:
#             clean_product = self._clean_product_name(product)
#             if len(clean_product) > 2 and clean_product not in cleaned_products:
#                 cleaned_products.append(clean_product)
        
#         # Si pas de produits trouvés, utiliser des produits par défaut selon la maladie
#         if not cleaned_products:
#             cleaned_products = self._get_default_products_by_disease(sections)
        
#         return cleaned_products[:5]
    
#     def _extract_application_method_improved(self, sections):
#         """Extraction améliorée de la méthode d'application"""
#         text = sections.get('TRAITEMENT_CHIMIQUE', '')
        
#         methods_map = {
#             'pulvérisation': 'Pulvérisation foliaire',
#             'aspersion': 'Pulvérisation foliaire',
#             'vaporisation': 'Pulvérisation foliaire',
#             'application au sol': 'Application au sol',
#             'trempage': 'Trempage des racines',
#             'badigeonnage': 'Badigeonnage du tronc'
#         }
        
#         for keyword, method in methods_map.items():
#             if keyword.lower() in text.lower():
#                 return method
        
#         return 'Pulvérisation foliaire'
    
#     def _extract_dosage_improved(self, sections):
#         """Extraction améliorée du dosage"""
#         text = sections.get('TRAITEMENT_CHIMIQUE', '')
        
#         # Patterns pour dosages
#         dosage_patterns = [
#             r'(\d+(?:[.,]\d+)?\s*(?:g|ml|L|l|kg)(?:/|\s+par\s+)(?:ha|m²|litre|L))',
#             r'dosage[:\s]*(\d+(?:[.,]\d+)?\s*(?:g|ml|L|kg))',
#             r'(\d+(?:[.,]\d+)?%)',
#             r'(\d+(?:[.,]\d+)?\s*(?:g|ml)/(?:100\s*ml|L))'
#         ]
        
#         for pattern in dosage_patterns:
#             match = re.search(pattern, text, re.IGNORECASE)
#             if match:
#                 return match.group(1).replace(',', '.')
        
#         return 'Selon recommandations fabricant'
    
#     def _extract_frequency_improved(self, sections):
#         """Extraction améliorée de la fréquence"""
#         text = sections.get('TRAITEMENT_CHIMIQUE', '')
        
#         freq_patterns = [
#             r'tous?\s+les?\s+(\d+)\s+jours?',
#             r'(\d+)\s+fois?\s+par\s+semaine',
#             r'fréquence[:\s]*([^.\n]+)',
#             r'répéter\s+(?:tous?\s+les?\s+)?(\d+\s+jours?)',
#             r'(hebdomadaire|mensuel|quotidien)'
#         ]
        
#         for pattern in freq_patterns:
#             match = re.search(pattern, text, re.IGNORECASE)
#             if match:
#                 frequency = match.group(1).strip()
#                 if frequency.isdigit():
#                     return f"Tous les {frequency} jours"
#                 return frequency
        
#         return 'Tous les 7-10 jours'
    
#     def _extract_prevention_tips_improved(self, sections):
#         """Extraction améliorée des conseils préventifs"""
#         text = sections.get('PREVENTION', '')
#         tips = []
        
#         if not text:
#             return self._get_default_prevention_tips()
        
#         # Diviser par lignes et nettoyer
#         lines = text.split('\n')
#         for line in lines:
#             line = line.strip()
#             if not line:
#                 continue
            
#             # Supprimer les puces et numérotations
#             clean_line = re.sub(r'^[-•*\d\.)\s]+', '', line).strip()
            
#             # Supprimer le formatage markdown
#             clean_line = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', clean_line)
            
#             # Vérifier que c'est un conseil valide
#             if len(clean_line) > 15 and not clean_line.endswith(':'):
#                 tips.append(clean_line)
        
#         # Si pas assez de conseils, diviser par phrases
#         if len(tips) < 3:
#             sentences = re.split(r'[.!?]', text)
#             for sentence in sentences:
#                 sentence = sentence.strip()
#                 sentence = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', sentence)
#                 if len(sentence) > 20 and sentence not in tips:
#                     tips.append(sentence + '.')
        
#         return tips[:5] if tips else self._get_default_prevention_tips()
    
#     def _extract_urgency_improved(self, sections):
#         """Extraction améliorée du niveau d'urgence"""
#         text = sections.get('URGENCE', '').upper()
        
#         if 'ELEVEE' in text or 'ÉLEVÉE' in text or 'HAUTE' in text or 'URGENT' in text:
#             return 'Élevée'
#         elif 'FAIBLE' in text or 'BAS' in text or 'LOW' in text:
#             return 'Faible'
#         elif 'MOYENNE' in text or 'MOYEN' in text or 'MEDIUM' in text:
#             return 'Moyenne'
#         else:
#             return 'Moyenne'  # Par défaut
    
#     def _extract_recovery_time_improved(self, sections):
#         """Extraction améliorée du temps de récupération"""
#         text = sections.get('RECUPERATION', '')
        
#         time_patterns = [
#             r'(\d+(?:-\d+)?\s*(?:semaines?|mois|jours?))',
#             r'(quelques\s+(?:semaines?|mois|jours?))',
#             r'(\d+\s*à\s*\d+\s*(?:semaines?|mois))'
#         ]
        
#         for pattern in time_patterns:
#             match = re.search(pattern, text, re.IGNORECASE)
#             if match:
#                 return match.group(1).strip()
        
#         return '2-3 semaines avec traitement approprié'
    
#     def _get_default_products_by_disease(self, sections):
#         """Produits par défaut selon le type de maladie"""
#         # Analyser le contexte pour deviner le type de maladie
#         full_text = ' '.join(sections.values()).lower()
        
#         if any(keyword in full_text for keyword in ['septoria', 'tache', 'spot']):
#             return ['Mancozèbe', 'Chlorothalonil', 'Bouillie bordelaise']
#         elif any(keyword in full_text for keyword in ['mildiou', 'blight']):
#             return ['Ridomil Gold', 'Cuivre', 'Mancozèbe']
#         elif any(keyword in full_text for keyword in ['oïdium', 'powdery']):
#             return ['Soufre', 'Tébuconazole', 'Azoxystrobine']
#         else:
#             return ['Fongicide polyvalent', 'Cuivre', 'Mancozèbe']
    
#     def _get_default_prevention_tips(self):
#         """Conseils préventifs par défaut"""
#         return [
#             "Maintenir une bonne circulation d'air entre les plants",
#             "Éviter l'arrosage sur le feuillage, privilégier l'irrigation au pied",
#             "Effectuer une rotation des cultures sur 3-4 ans",
#             "Éliminer les résidus de culture infectés",
#             "Surveiller régulièrement l'état sanitaire des plants"
#         ]
    
#     def _clean_text(self, text):
#         """Nettoyer le texte de formatage parasite"""
#         if not text:
#             return ""
        
#         # Supprimer le formatage markdown défaillant
#         text = re.sub(r'\*{3,}', '', text)
#         text = re.sub(r'\*\s*\*', '•', text)
        
#         # Corriger les espaces multiples
#         text = re.sub(r'\s{2,}', ' ', text)
        
#         # Corrections spécifiques observées
#         replacements = {
#             'res actives': 'matières actives',
#             'trazole': 'tébuconazole',
#             'veloppement': 'développement'
#         }
        
#         for old, new in replacements.items():
#             text = text.replace(old, new)
        
#         return text.strip()
    
#     def _clean_product_name(self, product):
#         """Nettoyer les noms de produits"""
#         if not product:
#             return ""
        
#         # Supprimer les caractères parasites
#         product = re.sub(r'^[-•*\s]+', '', product)
#         product = re.sub(r'[*]+$', '', product)
#         product = product.strip()
        
#         # Filtrer les fragments non pertinents
#         invalid_fragments = ['de lutte', 's fongicide', 'est un fongicide', 'fongicides']
#         if product.lower() in [frag.lower() for frag in invalid_fragments]:
#             return ""
        
#         # Capitaliser correctement
#         if len(product) > 2:
#             product = product.capitalize()
        
#         return product
    
#     def _get_default_recommendation(self, disease_info):
#         """Retourner des recommandations par défaut améliorées"""
#         disease_name = disease_info.get('disease_name', 'maladie détectée')
        
#         return {
#             'treatment_type': 'Général',
#             'description': f"Traitement recommandé pour {disease_name}",
#             'products': ['Mancozèbe', 'Bouillie bordelaise', 'Chlorothalonil'],
#             'application_method': 'Pulvérisation foliaire',
#             'dosage': '2-3 g/L d\'eau',
#             'frequency': 'Tous les 7-10 jours',
#             'prevention_tips': self._get_default_prevention_tips(),
#             'urgency_level': 'Moyenne',
#             'recovery_time': '2-3 semaines avec traitement approprié'
#         }

import google.generativeai as genai
from flask import current_app
import json
import re

class GeminiService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.setup_gemini()
    
    def setup_gemini(self):
        """Configure Gemini API"""
        try:
            api_key = self.api_key
            if not api_key:
                raise ValueError("GEMINI_API_KEY not configured")
            
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("Gemini service configured successfully")
            
        except Exception as e:
            print(f"Error configuring Gemini: {str(e)}")
            raise e
    
    def get_treatment_recommendations(self, disease_info):
        """Generate treatment recommendations with Gemini"""
        try:
            disease_name = disease_info.get('disease_name', 'Unknown')
            plant_type = disease_info.get('plant_type', 'Tomato')
            confidence = disease_info.get('confidence', 0)
            
            # Build prompt for Gemini
            prompt = self._build_treatment_prompt(disease_name, plant_type, confidence)
            
            # Generate response
            response = self.model.generate_content(prompt)
            
            # Parse and structure response
            structured_response = self._parse_gemini_response(response.text, disease_name)
            
            return structured_response
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return self._get_default_recommendation(disease_info)
    
    def _build_treatment_prompt(self, disease_name, plant_type, confidence):
        """Build optimized prompt for Gemini - English version"""
        prompt = f"""
As a plant pathology expert, analyze this disease and provide precise recommendations in ENGLISH:

**Disease Information:**
- Detected disease: {disease_name}
- Plant type: {plant_type}
- Confidence level: {confidence:.2f}

**IMPORTANT: Respond ONLY with the following format (respect the exact structure) in ENGLISH:**

===CHEMICAL_TREATMENT===
Product1: Commercial name (active ingredient) - dosage: X g/L
Product2: Commercial name (active ingredient) - dosage: X g/L
Product3: Commercial name (active ingredient) - dosage: X g/L
Application: precise application method
Frequency: every X days for Y weeks

===BIOLOGICAL_TREATMENT===
Bio1: Recommended biological product
Bio2: Natural alternative
Bio3: Ecological solution

===PREVENTION===
Tip1: First detailed preventive tip
Tip2: Second detailed preventive tip
Tip3: Third detailed preventive tip

===URGENCY===
LEVEL: LOW/MEDIUM/HIGH

===RECOVERY===
TIME: X weeks with appropriate treatment

**Important constraints:**
- Use products available in Morocco
- Give realistic and precise dosages
- Each section must be clearly delimited by === tags
- Be concise but complete
- Respond in ENGLISH only
"""
        return prompt

    # ==================== IMPROVED PARSING METHODS ====================
    
    def _parse_gemini_response(self, response_text, disease_name):
        """Parse and structure Gemini response with improved methods"""
        try:
            print(f"Raw Gemini response: {response_text[:300]}...")
            
            # Clean text with new method
            clean_text = self._advanced_text_cleaner(response_text)
            
            # Extract sections with improved method
            sections = self._extract_sections_with_delimiters(clean_text)
            
            # Structure final response
            structured_response = {
                'treatment_type': 'Integrated',
                'description': f"Recommended treatment for {disease_name}",
                'products': self._extract_products_precisely(sections),
                'application_method': self._extract_application_method_precisely(sections),
                'dosage': self._extract_dosage_precisely(sections),
                'frequency': self._extract_frequency_precisely(sections),
                'prevention_tips': self._extract_prevention_tips_precisely(sections),
                'urgency_level': self._extract_urgency_precisely(sections),
                'recovery_time': self._extract_recovery_time_precisely(sections)
            }
            
            print(f"Final structured response: {structured_response}")
            return structured_response
            
        except Exception as e:
            print(f"Error parsing Gemini response: {str(e)}")
            return self._get_default_recommendation({'disease_name': disease_name})

    def _advanced_text_cleaner(self, text):
        """Advanced text cleaning with spelling corrections"""
        if not text:
            return ""
        
        # Remove markdown formatting
        text = re.sub(r'\*{3,}', '', text)
        text = re.sub(r'\*\s*\*', '•', text)
        text = re.sub(r'#{1,6}\s*', '', text)  # Remove markdown headers
        
        # Fix multiple spaces and excessive line breaks
        text = re.sub(r'\s{3,}', ' ', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Dictionary of specific spelling corrections
        corrections = {
            'fungisides': 'fungicides',
            'applycation': 'application',
            'treatement': 'treatment',
            'recomended': 'recommended',
            'prevension': 'prevention',
            'comercial': 'commercial',
            'biologycal': 'biological',
            'developement': 'development',
            'applycation': 'application',
            'foliar spray': 'foliar spray'
        }
        
        # Apply corrections
        for incorrect, correct in corrections.items():
            text = re.sub(re.escape(incorrect), correct, text, flags=re.IGNORECASE)
        
        return text.strip()

    def _extract_sections_with_delimiters(self, text):
        """Extract sections with precise delimiters"""
        sections = {
            'CHEMICAL_TREATMENT': '',
            'BIOLOGICAL_TREATMENT': '',
            'PREVENTION': '',
            'URGENCY': '',
            'RECOVERY': ''
        }
        
        # Patterns with improved delimiters
        delimiter_patterns = {
            'CHEMICAL_TREATMENT': r'={3,}CHEMICAL[_\s]*TREATMENT={3,}(.*?)(?=={3,}[A-Z_]+={3,}|$)',
            'BIOLOGICAL_TREATMENT': r'={3,}BIOLOGICAL[_\s]*TREATMENT={3,}(.*?)(?=={3,}[A-Z_]+={3,}|$)',
            'PREVENTION': r'={3,}PREVENTION={3,}(.*?)(?=={3,}[A-Z_]+={3,}|$)',
            'URGENCY': r'={3,}URGENCY={3,}(.*?)(?=={3,}[A-Z_]+={3,}|$)',
            'RECOVERY': r'={3,}RECOVERY={3,}(.*?)(?=={3,}[A-Z_]+={3,}|$)'
        }
        
        # Fallback patterns without delimiters
        fallback_patterns = {
            'CHEMICAL_TREATMENT': r'CHEMICAL[_\s]*TREATMENT[:\s]*(.+?)(?=BIOLOGICAL[_\s]*TREATMENT|PREVENTION|URGENCY|$)',
            'BIOLOGICAL_TREATMENT': r'BIOLOGICAL[_\s]*TREATMENT[:\s]*(.+?)(?=PREVENTION|URGENCY|$)',
            'PREVENTION': r'PREVENTION[:\s]*(.+?)(?=URGENCY|RECOVERY|$)',
            'URGENCY': r'URGENCY[:\s]*(.+?)(?=RECOVERY|$)',
            'RECOVERY': r'RECOVERY[:\s]*(.+?)$'
        }
        
        # Try first with delimiters
        for section_name, pattern in delimiter_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                sections[section_name] = match.group(1).strip()
        
        # Fallback for sections not found
        for section_name, content in sections.items():
            if not content and section_name in fallback_patterns:
                match = re.search(fallback_patterns[section_name], text, re.IGNORECASE | re.DOTALL)
                if match:
                    sections[section_name] = match.group(1).strip()
        
        return sections

    # ==================== PRECISE EXTRACTION METHODS ====================

    def _extract_products_precisely(self, sections):
        """Precise product extraction with validation"""
        products = []
        treatment_text = sections.get('CHEMICAL_TREATMENT', '') + ' ' + sections.get('BIOLOGICAL_TREATMENT', '')
        
        # Hierarchical patterns for extraction
        extraction_patterns = [
            # Format: Product1: Name (active ingredient) - dosage
            r'Product\d*:\s*([^(]+)\s*\([^)]+\)',
            # Format: Commercial name (active ingredient)
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z0-9][a-zA-Z0-9]*)*)\s*\(([^)]+)\)',
            # Known commercial product names
            r'(Ridomil|Antracol|Bravo|Amistar|Folicur|Bordeaux\s+mixture|Aliette|Mancolax|Dithane)',
            # Common active ingredients
            r'(Mancozeb|Chlorothalonil|Azoxystrobin|Tebuconazole|Copper|Sulfur|Cymoxanil)',
            # Format Bio: biological product
            r'Bio\d*:\s*([^:\n]+)'
        ]
        
        for pattern in extraction_patterns:
            matches = re.findall(pattern, treatment_text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    product_name = match[0].strip()
                else:
                    product_name = match.strip()
                
                # Validation and cleaning
                clean_product = self._validate_and_clean_product(product_name)
                if clean_product and clean_product not in products:
                    products.append(clean_product)
        
        # Complete with default products if necessary
        if len(products) < 2:
            default_products = self._get_contextual_default_products(treatment_text)
            for prod in default_products:
                if prod not in products:
                    products.append(prod)
        
        return products[:5]  # Limit to 5 products maximum

    def _validate_and_clean_product(self, product_name):
        """Validation and cleaning of product names"""
        if not product_name or len(product_name) < 3:
            return None
        
        # Remove parasitic prefixes/suffixes
        product_name = re.sub(r'^(Product\d*:\s*|Bio\d*:\s*)', '', product_name, flags=re.IGNORECASE)
        product_name = re.sub(r'\s*-\s*dosage.*$', '', product_name, flags=re.IGNORECASE)
        product_name = product_name.strip()
        
        # List of irrelevant terms to filter
        invalid_terms = [
            'fungicide', 'treatment', 'product', 'solution', 'application',
            'method', 'recommended', 'commercial', 'active ingredient'
        ]
        
        if product_name.lower() in invalid_terms:
            return None
        
        # Correct capitalization
        return product_name.title()

    def _extract_application_method_precisely(self, sections):
        """Precise extraction of application method"""
        text = sections.get('CHEMICAL_TREATMENT', '').lower()
        
        # Application method mapping
        method_keywords = {
            'foliar spray': ['foliar spray', 'spray application', 'foliar application', 'leaf application'],
            'soil application': ['soil application', 'ground application', 'soil incorporation'],
            'dipping': ['dipping', 'root dip', 'immersion'],
            'trunk painting': ['trunk painting', 'bark application', 'coating'],
            'injection': ['injection', 'trunk injection', 'systemic injection']
        }
        
        for method, keywords in method_keywords.items():
            if any(keyword in text for keyword in keywords):
                return method.title()
        
        return 'Foliar Spray'  # Default method

    def _extract_dosage_precisely(self, sections):
        """Precise dosage extraction with validation"""
        text = sections.get('CHEMICAL_TREATMENT', '')
        
        # Hierarchical dosage patterns
        dosage_patterns = [
            r'dosage:\s*(\d+(?:[.,]\d+)?\s*(?:g|ml|L|kg)(?:/|\s+per\s+)(?:ha|m²|liter|L))',
            r'(\d+(?:[.,]\d+)?\s*(?:g|ml|L)/(?:100\s*ml|L|liter))',
            r'(\d+(?:[.,]\d+)?\s*(?:g|ml|L)\s*/\s*(?:ha|m²))',
            r'(\d+(?:[.,]\d+)?%)',
            r'(\d+(?:[.,]\d+)?\s*(?:ppm|mg/L))'
        ]
        
        for pattern in dosage_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                dosage = match.group(1).replace(',', '.')
                return self._standardize_dosage_format(dosage)
        
        return 'According to manufacturer recommendations'

    def _extract_frequency_precisely(self, sections):
        """Precise extraction of application frequency"""
        text = sections.get('CHEMICAL_TREATMENT', '').lower()
        
        # Frequency patterns with priority
        frequency_patterns = [
            (r'frequency:\s*every\s+(\d+)\s+days?', lambda x: f"Every {x} days"),
            (r'every\s+(\d+)\s+days?', lambda x: f"Every {x} days"),
            (r'(\d+)\s+times?\s+per\s+week', lambda x: f"{x} times per week"),
            (r'(\d+)\s+applications?\s+per\s+month', lambda x: f"{x} applications per month"),
            (r'(weekly)', lambda x: "Once per week"),
            (r'(daily)', lambda x: "Daily")
        ]
        
        for pattern, formatter in frequency_patterns:
            match = re.search(pattern, text)
            if match:
                return formatter(match.group(1))
        
        return 'Every 7-10 days'

    def _extract_prevention_tips_precisely(self, sections):
        """Precise extraction of prevention tips"""
        text = sections.get('PREVENTION', '')
        
        if not text:
            return self._get_contextual_prevention_tips()
        
        tips = []
        
        # Extraction by pattern Tip1:, Tip2:, etc.
        tip_pattern = r'Tip\d*:\s*([^:\n]+(?:\n(?!Tip)[^\n]*)*)'
        matches = re.findall(tip_pattern, text, re.IGNORECASE)
        
        for match in matches:
            clean_tip = self._clean_prevention_tip(match)
            if clean_tip:
                tips.append(clean_tip)
        
        # Fallback: extraction by lines if no structured pattern
        if len(tips) < 2:
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            for line in lines:
                if len(line) > 20 and not line.endswith(':'):
                    clean_tip = self._clean_prevention_tip(line)
                    if clean_tip and clean_tip not in tips:
                        tips.append(clean_tip)
        
        return tips[:5] if tips else self._get_contextual_prevention_tips()

    def _clean_prevention_tip(self, tip):
        """Cleaning of prevention tips"""
        if not tip:
            return None
        
        # Remove prefixes and formatting
        tip = re.sub(r'^(Tip\d*:\s*|-\s*|\*\s*|\d+\.\s*)', '', tip, flags=re.IGNORECASE)
        tip = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', tip)  # Remove markdown
        tip = tip.strip()
        
        # Length and content validation
        if len(tip) < 15 or tip.lower().startswith(('tip', 'advice', 'suggestion')):
            return None
        
        # Ensure final punctuation
        if not tip.endswith(('.', '!', '?')):
            tip += '.'
        
        return tip

    def _extract_urgency_precisely(self, sections):
        """Precise extraction of urgency level"""
        text = sections.get('URGENCY', '').upper()
        
        # Urgency level mapping
        urgency_mapping = {
            'HIGH': ['HIGH', 'ELEVATED', 'URGENT', 'CRITICAL', 'SEVERE'],
            'MEDIUM': ['MEDIUM', 'MODERATE', 'NORMAL', 'AVERAGE'],
            'LOW': ['LOW', 'MINOR', 'LIGHT', 'MILD']
        }
        
        for level, keywords in urgency_mapping.items():
            if any(keyword in text for keyword in keywords):
                return level.capitalize()
        
        # Extraction by pattern LEVEL:
        level_match = re.search(r'LEVEL:\s*([A-Z]+)', text)
        if level_match:
            level = level_match.group(1)
            for urgency_level, keywords in urgency_mapping.items():
                if level in keywords:
                    return urgency_level.capitalize()
        
        return 'Medium'  # Default value

    def _extract_recovery_time_precisely(self, sections):
        """Precise extraction of recovery time"""
        text = sections.get('RECOVERY', '')
        
        # Recovery time patterns
        time_patterns = [
            r'TIME:\s*(\d+(?:-\d+)?\s*(?:weeks?|months?|days?))',
            r'(\d+(?:-\d+)?\s*(?:weeks?|months?|days?))\s+with\s+treatment',
            r'recovery\s+in\s+(\d+(?:-\d+)?\s*(?:weeks?|months?))',
            r'(few\s+(?:weeks?|months?|days?))',
            r'(\d+\s*to\s*\d+\s*(?:weeks?|months?))'
        ]
        
        for pattern in time_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return '2-3 weeks with appropriate treatment'

    # ==================== HELPER AND UTILITY METHODS ====================

    def _get_contextual_default_products(self, context_text):
        """Context-based default products"""
        context_lower = context_text.lower()
        
        disease_product_mapping = {
            'early blight': ['Mancozeb', 'Chlorothalonil', 'Azoxystrobin'],
            'late blight': ['Ridomil Gold', 'Copper', 'Cymoxanil'],
            'septoria': ['Mancozeb', 'Tebuconazole', 'Bordeaux mixture'],
            'powdery mildew': ['Sulfur', 'Tebuconazole', 'Azoxystrobin'],
            'anthracnose': ['Copper', 'Mancozeb', 'Chlorothalonil']
        }
        
        for disease, products in disease_product_mapping.items():
            if disease in context_lower:
                return products
        
        return ['Mancozeb', 'Bordeaux mixture', 'Copper']

    def _get_contextual_prevention_tips(self):
        """Improved contextual prevention tips"""
        return [
            "Ensure good air circulation between plants to reduce humidity",
            "Water at the base of plants rather than on foliage",
            "Practice crop rotation for a minimum of 3-4 years",
            "Systematically remove infected crop residues",
            "Monitor plant health regularly and intervene early"
        ]

    def _standardize_dosage_format(self, dosage):
        """Standardization of dosage format"""
        # Common unit conversions
        conversions = {
            'ml/l': 'ml/L',
            'g/l': 'g/L',
            'kg/ha': 'kg/ha',
            'g/m²': 'g/m²'
        }
        
        for old, new in conversions.items():
            dosage = dosage.replace(old, new)
        
        return dosage

    def _get_default_recommendation(self, disease_info):
        """Return optimized default recommendations"""
        disease_name = disease_info.get('disease_name', 'detected disease')
        
        return {
            'treatment_type': 'General',
            'description': f"Recommended treatment for {disease_name}",
            'products': ['Mancozeb', 'Bordeaux mixture', 'Chlorothalonil'],
            'application_method': 'Foliar spray',
            'dosage': '2-3 g/L water',
            'frequency': 'Every 7-10 days depending on conditions',
            'prevention_tips': self._get_contextual_prevention_tips(),
            'urgency_level': 'Medium',
            'recovery_time': '2-3 weeks with appropriate treatment'
        }