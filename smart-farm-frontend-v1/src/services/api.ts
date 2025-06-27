import axios from 'axios';

// This would be replaced with your actual API endpoints
const API_BASE_URL_MS1 = 'http://localhost:8081/api/v1/profitability';
const API_BASE_URL_PDF = 'http://localhost:8081/api/reports/pdf'; // Nouvelle URL pour les rapports PDF
const API_BASE_URL_MS2 = 'https://api.example.com/ms2';

// Create axios instances for each microservice
const ms1Api = axios.create({
    baseURL: API_BASE_URL_MS1,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Nouvelle instance axios pour les rapports PDF
const pdfApi = axios.create({
    baseURL: API_BASE_URL_PDF,
    timeout: 30000, // Timeout plus long pour la génération de PDF
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'blob' // Important pour recevoir les données binaires du PDF
});

const ms2Api = axios.create({
    baseURL: API_BASE_URL_MS2,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Types adaptés pour correspondre au composant ProfitabilityDashboard
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
    name: string;       // Nom du mois (Jan, Fév, etc.)
    revenue: number;    // Revenus pour ce mois
    cost: number;       // Coûts pour ce mois
    profit: number;     // Profit pour ce mois
}

export interface ResourceUsage {
    name: string;       // Nom de la ressource (Eau, Électricité, etc.)
    value: number;      // Valeur/quantité utilisée
    color: string;      // Couleur pour les graphiques
}

export interface CropProfitability {
    name: string;       // Nom de la culture
    revenue: number;    // Revenus générés par cette culture
    cost: number;       // Coûts associés à cette culture
    profit: number;     // Profit réalisé sur cette culture
}

export interface WaterEfficiency {
    name: string;       // Nom de la zone
    efficiency: number; // Efficacité de l'eau (entre 0 et 1)
    usage: number;      // Quantité d'eau utilisée (en L)
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

// Service de rentabilité pour lier avec le backend MS1
export const profitabilityService = {
    // Générer un rapport quotidien
    generateDailyReport: async (date: string) => {
        try {
            const response = await ms1Api.post('/generate-daily-report', null, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération du rapport quotidien:', error);
            throw error;
        }
    },

    // NOUVELLE FONCTION: Générer et télécharger un rapport PDF quotidien
    generateDailyPdfReport: async (date: string) => {
        try {
            const response = await pdfApi.get('/daily', {
                params: { date }
            });

            // Créer un blob à partir de la réponse
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Créer un lien de téléchargement temporaire
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Nom du fichier avec la date
            const fileName = `rapport_quotidien_${date}.pdf`;
            link.download = fileName;

            // Déclencher le téléchargement
            document.body.appendChild(link);
            link.click();

            // Nettoyer
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, fileName };
        } catch (error) {
            console.error('Erreur lors de la génération du rapport PDF quotidien:', error);
            throw error;
        }
    },
    generateMonthlyPdfReport: async (year: number, month: number) => {
        try {
            const response = await pdfApi.get('/monthly-pdf', {
                params: { year, month }
            });

            // Créer un blob à partir de la réponse
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Créer un lien de téléchargement temporaire
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Nom du fichier avec l'année et le mois
            const fileName = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.pdf`;
            link.download = fileName;

            // Déclencher le téléchargement
            document.body.appendChild(link);
            link.click();

            // Nettoyer
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
            const response = await ms1Api.post('/generate-monthly-report', null, {
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
            const response = await ms1Api.get('/weekly-financial-data');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données financières hebdomadaires:', error);
            throw error;
        }
    },

    // Récupérer les données financières mensuelles
    getMonthlyFinancialData: async (year: number) => {
        try {
            const response = await ms1Api.get('/monthly-financial-data', {
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
            const response = await ms1Api.get('/yearly-financial-data');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données financières annuelles:', error);
            throw error;
        }
    },

    // Récupérer les données d'utilisation des ressources
    getResourceUsageData: async (startDate: string, endDate: string) => {
        try {
            const response = await ms1Api.get('/resource-usage', {
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
            const response = await ms1Api.get('/crop-profitability', {
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
            const response = await ms1Api.get('/water-efficiency');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'efficacité d\'eau:', error);
            throw error;
        }
    },

    // Récupérer les KPIs du tableau de bord
    getDashboardKPIs: async (startDate: string, endDate: string) => {
        try {
            const response = await ms1Api.get('/dashboard-kpis', {
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
            const response = await ms1Api.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du rapport #${id}:`, error);
            throw error;
        }
    },

    // Récupérer tous les rapports
    getAllReports: async () => {
        try {
            const response = await ms1Api.get('/all');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les rapports:', error);
            throw error;
        }
    },

    // Récupérer les rapports entre deux dates
    getReportsByDateRange: async (startDate: string, endDate: string) => {
        try {
            const response = await ms1Api.get('/date-range', {
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
            const response = await ms1Api.get('/roi', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors du calcul du ROI:', error);
            throw error;
        }
    }
};

// MS2 API services (predictions) - conservés pour référence
export const predictionService = {
    // Get disease predictions
    getDiseasePredictions: async () => {
        try {
            const response = await ms2Api.get('/predictions/diseases');
            return response.data;
        } catch (error) {
            console.error('Error fetching disease predictions:', error);
            throw error;
        }
    },

    // Get water usage recommendations
    getWaterRecommendations: async () => {
        try {
            const response = await ms2Api.get('/predictions/water');
            return response.data;
        } catch (error) {
            console.error('Error fetching water recommendations:', error);
            throw error;
        }
    },

    // Get crop yield predictions
    getCropYieldPredictions: async () => {
        try {
            const response = await ms2Api.get('/predictions/yield');
            return response.data;
        } catch (error) {
            console.error('Error fetching crop yield predictions:', error);
            throw error;
        }
    }
};

// On conserve également le service de capteurs, qui pourrait être utilisé dans d'autres composants
export const sensorService = {
    // Get all current sensor readings
    getCurrentReadings: async () => {
        try {
            const response = await ms1Api.get('/sensors/current');
            return response.data;
        } catch (error) {
            console.error('Error fetching current sensor readings:', error);
            throw error;
        }
    },

    // Get historical sensor data with optional filters
    getHistoricalData: async (params: {
        startDate?: string;
        endDate?: string;
        sensorIds?: string[];
        page?: number;
        limit?: number;
    }) => {
        try {
            const response = await ms1Api.get('/sensors/history', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching historical sensor data:', error);
            throw error;
        }
    },

    // Get active alerts
    getAlerts: async () => {
        try {
            const response = await ms1Api.get('/alerts');
            return response.data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    }
};