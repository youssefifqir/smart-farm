import axios, { AxiosInstance } from 'axios';

// Base URLs
const API_BASE_URL_MS1: string = 'http://localhost:8036';
const API_BASE_URL_MS2: string = 'http://localhost:8081';

// Interfaces
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

// Axios instances
const ms1Api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL_MS1,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const ms2Api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL_MS2,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptors
[ms1Api, ms2Api].forEach(api =>
  api.interceptors.request.use(
    (config) => {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  )
);

[ms1Api, ms2Api].forEach(api =>
  api.interceptors.response.use(
    (response) => {
      console.log(`Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => Promise.reject(error)
  )
);

// MS1 - Sensor service
export const sensorService = {
  getCurrentReadings: async (): Promise<SensorReading[]> => {
    try {
      const res = await ms1Api.get('/sensor-data');
      return res.data;
    } catch (err) {
      console.error('Error fetching current sensor readings:', err);
      return [];
    }
  },

  getHistoricalData: async (params: HistoricalDataParams = {}): Promise<SensorReading[]> => {
    try {
      const res = await ms1Api.get('/sensor-data/history', { params });
      return res.data;
    } catch (err) {
      console.error('Error fetching historical sensor data:', err);
      return [];
    }
  },

  sendSensorData: async (data: {
    temperature: number;
    humidity: number;
    isFire: boolean;
    isRaining: boolean;
    timestamp?: string;
  }): Promise<SensorReading[]> => {
    try {
      const res = await ms1Api.post('/sensor-data', data);
      return res.data;
    } catch (err) {
      console.error('Erreur lors de l’envoi des données capteurs :', err);
      throw err;
    }
  },

  getAlerts: async (): Promise<Alert[]> => {
    try {
      const res = await ms1Api.get('/alerts');
      return res.data;
    } catch (err) {
      console.error('Error fetching alerts:', err);
      throw err;
    }
  },

  testConnection: async (): Promise<HealthResponse> => {
    try {
      const res = await ms1Api.get('/health');
      return res.data;
    } catch (err) {
      console.error('Backend connection test failed:', err);
      throw err;
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

// MS2 - Prediction service
export const predictionService = {
  getDiseasePredictions: async (): Promise<DiseasePrediction[]> => {
    try {
      const res = await ms2Api.get('/predictions/diseases');
      return res.data;
    } catch (err) {
      console.error('Error fetching disease predictions:', err);
      throw err;
    }
  },

  getWaterRecommendations: async (): Promise<WaterRecommendation[]> => {
    try {
      const res = await ms2Api.get('/predictions/water');
      return res.data;
    } catch (err) {
      console.error('Error fetching water recommendations:', err);
      throw err;
    }
  },

  getCropYieldPredictions: async (): Promise<CropYieldPrediction[]> => {
    try {
      const res = await ms2Api.get('/predictions/yield');
      return res.data;
    } catch (err) {
      console.error('Error fetching crop yield predictions:', err);
      throw err;
    }
  },

  testConnection: async (): Promise<HealthResponse> => {
    try {
      const res = await ms2Api.get('/health');
      return res.data;
    } catch (err) {
      console.error('MS2 connection test failed:', err);
      throw err;
    }
  },
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
}// Export WebSocket URL and instances
export const WS_BASE_URL: string = 'http://localhost:8036/ws';
export { ms1Api, ms2Api };
