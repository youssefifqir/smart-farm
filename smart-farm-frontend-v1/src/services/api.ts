import axios, { AxiosInstance, AxiosResponse } from 'axios';

// URLs pour les services de rentabilité (ancien premier fichier)
const PROFITABILITY_API_BASE_URL = 'http://localhost:8036/api/v1/profitability';
const PDF_REPORTS_API_BASE_URL = 'http://localhost:8036/api/reports/pdf';
const PROFITABILITY_MS2_API_BASE_URL = 'https://api.example.com/ms2';

// URLs pour les services de capteurs et prédictions (ancien deuxième fichier)
const API_BASE_URL_MS1: string = 'http://localhost:8036';
const API_BASE_URL_MS2: string = 'http://localhost:8081';

// Instances axios pour les services de rentabilité
const profitabilityApi = axios.create({
    baseURL: PROFITABILITY_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

const pdfReportsApi = axios.create({
    baseURL: PDF_REPORTS_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'blob'
});

const profitabilityMs2Api = axios.create({
    baseURL: PROFITABILITY_MS2_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Instances axios pour les services de capteurs et prédictions
const ms1Api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL_MS1,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

const ms2Api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL_MS2,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ============ INTERFACES ET TYPES ============

// Types pour les services de rentabilité
export interface ProfitabilityReportDto {
    id: number;
    creationDate: string;
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalCost: number;
    profit: number;
    profitMargin: number;
}

export interface MonthlyFinancial {
    name: string;
    revenue: number;
    cost: number;
    profit: number;
}

export interface ResourceUsage {
    name: string;
    value: number;
    color: string;
}

export interface CropProfitability {
    name: string;
    revenue: number;
    cost: number;
    profit: number;
}

export interface WaterEfficiency {
    name: string;
    efficiency: number;
    usage: number;
}

export interface DashboardKPIs {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    revenueGrowth: number;
    costGrowth: number;
    profitGrowth: number;
    marginGrowth: number;
    waterUsage: number;
    energyUsage: number;
}

// Types pour les services de capteurs et prédictions
export interface SensorReading {
    id?: number;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightIntensity: number;
    timestamp?: string;
}

export interface Alert {
    id?: number;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: string;
    acknowledged?: boolean;
}

export interface HistoricalDataParams {
    startDate?: string;
    endDate?: string;
    sensorType?: string;
    limit?: number;
}

export interface DiseasePrediction {
    id?: number;
    diseaseName: string;
    probability: number;
    affectedArea?: string;
    recommendedActions?: string[];
    timestamp?: string;
}

export interface WaterRecommendation {
    id?: number;
    recommendedAmount: number;
    duration: number;
    area?: string;
    reasoning?: string;
    timestamp?: string;
}

export interface CropYieldPrediction {
    id?: number;
    cropType: string;
    expectedYield: number;
    unit?: string;
    confidence: number;
    factors?: string[];
    timestamp?: string;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    service: string;
}

// ============ INTERCEPTEURS ============

// Intercepteurs pour MS1
ms1Api.interceptors.request.use(
    (config) => {
        console.log(`MS1 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('MS1 API Request Error:', error);
        return Promise.reject(error);
    }
);

ms1Api.interceptors.response.use(
    (response) => {
        console.log(`MS1 API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('MS1 API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

// Intercepteurs pour MS2
ms2Api.interceptors.request.use(
    (config) => {
        console.log(`MS2 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('MS2 API Request Error:', error);
        return Promise.reject(error);
    }
);

ms2Api.interceptors.response.use(
    (response) => {
        console.log(`MS2 API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('MS2 API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

// ============ SERVICES DE RENTABILITÉ ============

export const profitabilityService = {
    // Générer un rapport quotidien
    generateDailyReport: async (date: string) => {
        try {
            const response = await profitabilityApi.post('/generate-daily-report', null, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération du rapport quotidien:', error);
            throw error;
        }
    },

    // Générer et télécharger un rapport PDF quotidien
    generateDailyPdfReport: async (date: string) => {
        try {
            const response = await pdfReportsApi.get('/daily', {
                params: { date }
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const fileName = `rapport_quotidien_${date}.pdf`;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, fileName };
        } catch (error) {
            console.error('Erreur lors de la génération du rapport PDF quotidien:', error);
            throw error;
        }
    },

    // Générer et télécharger un rapport PDF mensuel
    generateMonthlyPdfReport: async (year: number, month: number) => {
        try {
            const response = await pdfReportsApi.get('/monthly-pdf', {
                params: { year, month }
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const fileName = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.pdf`;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, fileName };
        } catch (error) {
            console.error('Erreur lors de la génération du rapport PDF mensuel:', error);
            throw error;
        }
    },

    // Générer un rapport mensuel
    generateMonthlyReport: async (year: number, month: number) => {
        try {
            const response = await profitabilityApi.post('/generate-monthly-report', null, {
                params: { year, month }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération du rapport mensuel:', error);
            throw error;
        }
    },

    // Récupérer les données financières hebdomadaires
    getWeeklyFinancialData: async () => {
        try {
            const response = await profitabilityApi.get('/weekly-financial-data');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données financières hebdomadaires:', error);
            throw error;
        }
    },

    // Récupérer les données financières mensuelles
    getMonthlyFinancialData: async (year: number) => {
        try {
            const response = await profitabilityApi.get('/monthly-financial-data', {
                params: { year }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données financières mensuelles:', error);
            throw error;
        }
    },

    // Récupérer les données financières annuelles
    getYearlyFinancialData: async () => {
        try {
            const response = await profitabilityApi.get('/yearly-financial-data');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données financières annuelles:', error);
            throw error;
        }
    },

    // Récupérer les données d'utilisation des ressources
    getResourceUsageData: async (startDate: string, endDate: string) => {
        try {
            const response = await profitabilityApi.get('/resource-usage', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'utilisation des ressources:', error);
            throw error;
        }
    },

    // Récupérer les données de rentabilité par culture
    getCropProfitabilityData: async (startDate: string, endDate: string) => {
        try {
            const response = await profitabilityApi.get('/crop-profitability', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données de rentabilité par culture:', error);
            throw error;
        }
    },

    // Récupérer les données d'efficacité d'eau
    getWaterEfficiencyData: async () => {
        try {
            const response = await profitabilityApi.get('/water-efficiency');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'efficacité d\'eau:', error);
            throw error;
        }
    },

    // Récupérer les KPIs du tableau de bord
    getDashboardKPIs: async (startDate: string, endDate: string) => {
        try {
            const response = await profitabilityApi.get('/dashboard-kpis', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des KPIs du tableau de bord:', error);
            throw error;
        }
    },

    // Récupérer un rapport par ID
    getReportById: async (id: number) => {
        try {
            const response = await profitabilityApi.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du rapport #${id}:`, error);
            throw error;
        }
    },

    // Récupérer tous les rapports
    getAllReports: async () => {
        try {
            const response = await profitabilityApi.get('/all');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les rapports:', error);
            throw error;
        }
    },

    // Récupérer les rapports entre deux dates
    getReportsByDateRange: async (startDate: string, endDate: string) => {
        try {
            const response = await profitabilityApi.get('/date-range', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports par plage de dates:', error);
            throw error;
        }
    },

    // Calculer le ROI
    calculateROI: async (startDate: string, endDate: string) => {
        try {
            const response = await profitabilityApi.get('/roi', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors du calcul du ROI:', error);
            throw error;
        }
    }
};

// ============ SERVICES DE CAPTEURS ============

export const sensorService = {
    // Récupérer les lectures actuelles des capteurs
    getCurrentReadings: async (): Promise<SensorReading[]> => {
        try {
            const response: AxiosResponse<SensorReading[]> = await ms1Api.get('/sensors/current');
            return response.data;
        } catch (error) {
            console.error('Error fetching current sensor readings:', error);
            throw error;
        }
    },
    
    // Récupérer les données historiques des capteurs
    getHistoricalData: async (params: HistoricalDataParams = {}): Promise<SensorReading[]> => {
        try {
            const response: AxiosResponse<SensorReading[]> = await ms1Api.get('/sensors/history', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching historical sensor data:', error);
            throw error;
        }
    },
    
    // Récupérer les alertes actives
    getAlerts: async (): Promise<Alert[]> => {
        try {
            const response: AxiosResponse<Alert[]> = await ms1Api.get('/alerts');
            return response.data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    },

    // Tester la connexion au backend
    testConnection: async (): Promise<HealthResponse> => {
        try {
            const response: AxiosResponse<HealthResponse> = await ms1Api.get('/health');
            return response.data;
        } catch (error) {
            console.error('Backend connection test failed:', error);
            throw error;
        }
    },
    toggleSensorStatus: async (name: string, status: boolean): Promise<void> => {
    try {
      await fetch(`http://localhost:8036/api/v1/sensors/status?name=${name}&status=${status}`, {
        method: 'PUT'
      });
      alert(`✅ ${name} est maintenant ${status ? 'activé' : 'désactivé'}`);
    } catch (err) {
      alert(`❌ Erreur : ${err}`);
    }
  }
};
export const toggleSensor = async (sensor: string, enabled: boolean) => {
  try {
    await fetch(`/api/sensors/${sensor}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
  } catch (error) {
    console.error(`Failed to update ${sensor} sensor`, error);
  }
}

// ============ SERVICES DE PRÉDICTIONS ============

export const predictionService = {
    // Récupérer les prédictions de maladies
    getDiseasePredictions: async (): Promise<DiseasePrediction[]> => {
        try {
            const response: AxiosResponse<DiseasePrediction[]> = await ms2Api.get('/predictions/diseases');
            return response.data;
        } catch (error) {
            console.error('Error fetching disease predictions:', error);
            throw error;
        }
    },
    
    // Récupérer les recommandations d'usage d'eau
    getWaterRecommendations: async (): Promise<WaterRecommendation[]> => {
        try {
            const response: AxiosResponse<WaterRecommendation[]> = await ms2Api.get('/predictions/water');
            return response.data;
        } catch (error) {
            console.error('Error fetching water recommendations:', error);
            throw error;
        }
    },
    
    // Récupérer les prédictions de rendement des cultures
    getCropYieldPredictions: async (): Promise<CropYieldPrediction[]> => {
        try {
            const response: AxiosResponse<CropYieldPrediction[]> = await ms2Api.get('/predictions/yield');
            return response.data;
        } catch (error) {
            console.error('Error fetching crop yield predictions:', error);
            throw error;
        }
    },

    // Tester la connexion à MS2
    testConnection: async (): Promise<HealthResponse> => {
        try {
            const response: AxiosResponse<HealthResponse> = await ms2Api.get('/health');
            return response.data;
        } catch (error) {
            console.error('MS2 connection test failed:', error);
            throw error;
        }
    }
};

// ============ EXPORTS ADDITIONNELS ============

// Export des URLs pour les connexions WebSocket
export const WS_BASE_URL: string = 'http://localhost:8036/ws';

// Export des instances axios pour usage avancé
export { 
    ms1Api, 
    ms2Api, 
    profitabilityApi, 
    pdfReportsApi, 
    profitabilityMs2Api 
};


//
// // API pour la détection de maladies
// const API_BASE_URL_DISEASE = 'http://localhost:5000/api';
//
// // Create axios instance for disease detection service
// const diseaseApi = axios.create({
//     baseURL: API_BASE_URL_DISEASE,
//     timeout: 30000, // Plus long timeout pour l'upload d'images
// });
//
// export interface DetectionResult {
//     id: number;
//     disease_name: string;
//     confidence_score: number;
//     plant_type: string;
//     created_at: string;
//     severity: string;
//     raw_prediction: string;
// }
//
// export interface Recommendation {
//     id: number;
//     treatment_type: string;
//     description: string;
//     products: string[];
//     application_method: string;
//     dosage: string;
//     frequency: string;
//     prevention_tips: string[];
//     urgency_level: string;
//     recovery_time: string;
// }
//
// export interface DetectionResponse {
//     success: boolean;
//     detection: DetectionResult;
//     recommendation: Recommendation;
//     error?: string;
// }
//
// export interface HistoryItem {
//     id: number;
//     disease_name: string;
//     confidence_score: number;
//     plant_type: string;
//     created_at: string;
//     recommendation?: {
//         treatment_type: string;
//         urgency_level: string;
//         recovery_time: string;
//     };
// }
//
// export interface HistoryResponse {
//     success: boolean;
//     history: HistoryItem[];
//     pagination: {
//         page: number;
//         per_page: number;
//         total: number;
//         pages: number;
//         has_next: boolean;
//         has_prev: boolean;
//     };
//     error?: string;
// }
//
// export interface DetectionDetailsResponse {
//     success: boolean;
//     detection: DetectionResult;
//     recommendation: Recommendation | null;
//     error?: string;
// }
//
// // Service pour la détection de maladies
// export const diseaseDetectionService = {
//     /**
//      * Analyser une image pour détecter les maladies
//      */
//     detectDisease: async (imageFile: File): Promise<DetectionResponse> => {
//         try {
//             const formData = new FormData();
//             formData.append('image', imageFile);
//
//             const response = await diseaseApi.post('/disease/detect', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//
//             return response.data;
//         } catch (error: unknown) {
//             console.error('Erreur lors de la détection:', error);
//
//             // Gestion des erreurs HTTP
//             if (error && typeof error === 'object' && 'response' in error) {
//                 const axiosError = error as any;
//                 throw new Error(axiosError.response?.data?.error || 'Erreur lors de l\'analyse');
//             } else if (error && typeof error === 'object' && 'request' in error) {
//                 throw new Error('Impossible de contacter le serveur');
//             } else {
//                 throw new Error('Erreur lors de l\'analyse de l\'image');
//             }
//         }
//     },
//
//     /**
//      * Obtenir l'historique des détections
//      */
//     getDetectionHistory: async (page = 1, perPage = 10): Promise<HistoryResponse> => {
//         try {
//             const response = await diseaseApi.get('/disease/history', {
//                 params: { page, per_page: perPage }
//             });
//
//             return response.data;
//         } catch (error: unknown) {
//             console.error('Erreur lors de la récupération de l\'historique:', error);
//
//             if (error && typeof error === 'object' && 'response' in error) {
//                 const axiosError = error as any;
//                 throw new Error(axiosError.response?.data?.error || 'Erreur lors de la récupération de l\'historique');
//             } else {
//                 throw new Error('Impossible de récupérer l\'historique');
//             }
//         }
//     },
//
//     /**
//      * Obtenir les détails d'une détection spécifique
//      */
//     getDetectionDetails: async (detectionId: number): Promise<DetectionDetailsResponse> => {
//         try {
//             const response = await diseaseApi.get(`/disease/${detectionId}`);
//             return response.data;
//         } catch (error: unknown) {
//             console.error('Erreur lors de la récupération des détails:', error);
//
//             if (error && typeof error === 'object' && 'response' in error) {
//                 const axiosError = error as any;
//                 throw new Error(axiosError.response?.data?.error || 'Erreur lors de la récupération des détails');
//             } else {
//                 throw new Error('Impossible de récupérer les détails');
//             }
//         }
//     }
// };

// API pour la détection de maladies
const API_BASE_URL_DISEASE = 'http://localhost:5000/api';

// Create axios instance for disease detection service
const diseaseApi = axios.create({
    baseURL: API_BASE_URL_DISEASE,
    timeout: 30000, // Plus long timeout pour l'upload d'images
});

export interface DetectionResult {
    id: number;
    disease_name: string;
    confidence_score: number;
    plant_type: string;
    created_at: string;
    severity: string;
    raw_prediction: string;
}

export interface Recommendation {
    id: number;
    treatment_type: string;
    description: string;
    products: string[];
    application_method: string;
    dosage: string;
    frequency: string;
    prevention_tips: string[];
    urgency_level: string;
    recovery_time: string;
}

export interface DetectionResponse {
    success: boolean;
    detection: DetectionResult;
    recommendation: Recommendation;
    error?: string;
}

export interface HistoryItem {
    id: number;
    disease_name: string;
    confidence_score: number;
    plant_type: string;
    created_at: string;
    recommendation?: {
        treatment_type: string;
        urgency_level: string;
        recovery_time: string;
    };
}

export interface HistoryResponse {
    success: boolean;
    history: HistoryItem[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
    error?: string;
}

export interface DetectionDetailsResponse {
    success: boolean;
    detection: DetectionResult;
    recommendation: Recommendation | null;
    error?: string;
}

// Utilitaires pour la gestion du fuseau horaire
export const timezoneUtils = {
    /**
     * Convertit une date UTC en fuseau horaire du Maroc (Africa/Casablanca)
     */
    convertToMoroccanTime: (utcDateString: string): string => {
        const date = new Date(utcDateString);

        // Créer un objet Date avec le fuseau horaire du Maroc
        const moroccanDate = new Date(date.toLocaleString("en-US", {
            timeZone: "Africa/Casablanca"
        }));

        return moroccanDate.toISOString();
    },

    /**
     * Formate une date pour l'affichage au Maroc
     */
    formatDateForMorocco: (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
        const date = new Date(dateString);

        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Africa/Casablanca",
            hour12: false // Format 24h
        };

        return date.toLocaleString("fr-MA", { ...defaultOptions, ...options });
    },

    /**
     * Formate une date pour l'affichage en français avec fuseau horaire Maroc
     */
    formatDateFrench: (dateString: string): string => {
        const date = new Date(dateString);

        return date.toLocaleString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Africa/Casablanca",
            hour12: false
        });
    },

    /**
     * Obtient la date actuelle au Maroc
     */
    getCurrentMoroccanTime: (): string => {
        const now = new Date();
        return now.toLocaleString("en-US", {
            timeZone: "Africa/Casablanca"
        });
    },

    /**
     * Convertit une date locale en UTC pour l'envoi au serveur
     */
    convertLocalToUTC: (localDateString: string): string => {
        const localDate = new Date(localDateString);
        return localDate.toISOString();
    }
};

// Service pour la détection de maladies
export const diseaseDetectionService = {
    /**
     * Analyser une image pour détecter les maladies
     */
    detectDisease: async (imageFile: File): Promise<DetectionResponse> => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await diseaseApi.post('/disease/detect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Traiter la réponse pour ajuster les dates
            const data = response.data;
            if (data.success && data.detection) {
                // Convertir la date au fuseau horaire du Maroc
                data.detection.created_at = timezoneUtils.convertToMoroccanTime(data.detection.created_at);
            }

            return data;
        } catch (error: unknown) {
            console.error('Erreur lors de la détection:', error);

            // Gestion des erreurs HTTP
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                throw new Error(axiosError.response?.data?.error || 'Erreur lors de l\'analyse');
            } else if (error && typeof error === 'object' && 'request' in error) {
                throw new Error('Impossible de contacter le serveur');
            } else {
                throw new Error('Erreur lors de l\'analyse de l\'image');
            }
        }
    },

    /**
     * Obtenir l'historique des détections
     */
    getDetectionHistory: async (page = 1, perPage = 10): Promise<HistoryResponse> => {
        try {
            const response = await diseaseApi.get('/disease/history', {
                params: { page, per_page: perPage }
            });

            const data = response.data;

            // Traiter la réponse pour ajuster les dates
            if (data.success && data.history) {
                data.history = data.history.map((item: HistoryItem) => ({
                    ...item,
                    created_at: timezoneUtils.convertToMoroccanTime(item.created_at)
                }));
            }

            return data;
        } catch (error: unknown) {
            console.error('Erreur lors de la récupération de l\'historique:', error);

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                throw new Error(axiosError.response?.data?.error || 'Erreur lors de la récupération de l\'historique');
            } else {
                throw new Error('Impossible de récupérer l\'historique');
            }
        }
    },

    /**
     * Obtenir les détails d'une détection spécifique
     */
    getDetectionDetails: async (detectionId: number): Promise<DetectionDetailsResponse> => {
        try {
            const response = await diseaseApi.get(`/disease/${detectionId}`);

            const data = response.data;

            // Traiter la réponse pour ajuster les dates
            if (data.success && data.detection) {
                data.detection.created_at = timezoneUtils.convertToMoroccanTime(data.detection.created_at);
            }

            return data;
        } catch (error: unknown) {
            console.error('Erreur lors de la récupération des détails:', error);

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                throw new Error(axiosError.response?.data?.error || 'Erreur lors de la récupération des détails');
            } else {
                throw new Error('Impossible de récupérer les détails');
            }
        }
    }
};