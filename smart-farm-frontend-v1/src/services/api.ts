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
    }
};

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