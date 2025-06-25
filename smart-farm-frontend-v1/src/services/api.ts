// import axios from 'axios';

// // This would be replaced with your actual API endpoints
// const API_BASE_URL_MS1 = 'https://api.example.com/ms1';
// const API_BASE_URL_MS2 = 'https://api.example.com/ms2';

// // Create axios instances for each microservice
// const ms1Api = axios.create({
//   baseURL: API_BASE_URL_MS1,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// const ms2Api = axios.create({
//   baseURL: API_BASE_URL_MS2,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // MS1 API services (sensor data)
// export const sensorService = {
//   // Get all current sensor readings
//   getCurrentReadings: async () => {
//     try {
//       const response = await ms1Api.get('/sensors/current');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching current sensor readings:', error);
//       throw error;
//     }
//   },
  
//   // Get historical sensor data with optional filters
//   getHistoricalData: async (params: {
//     startDate?: string;
//     endDate?: string;
//     sensorIds?: string[];
//     page?: number;
//     limit?: number;
//   }) => {
//     try {
//       const response = await ms1Api.get('/sensors/history', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching historical sensor data:', error);
//       throw error;
//     }
//   },
  
//   // Get active alerts
//   getAlerts: async () => {
//     try {
//       const response = await ms1Api.get('/alerts');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching alerts:', error);
//       throw error;
//     }
//   }
// };

// // MS2 API services (predictions)
// export const predictionService = {
//   // Get disease predictions
//   getDiseasePredictions: async () => {
//     try {
//       const response = await ms2Api.get('/predictions/diseases');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching disease predictions:', error);
//       throw error;
//     }
//   },
  
//   // Get water usage recommendations
//   getWaterRecommendations: async () => {
//     try {
//       const response = await ms2Api.get('/predictions/water');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching water recommendations:', error);
//       throw error;
//     }
//   },
  
//   // Get crop yield predictions
//   getCropYieldPredictions: async () => {
//     try {
//       const response = await ms2Api.get('/predictions/yield');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching crop yield predictions:', error);
//       throw error;
//     }
//   }
// };
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Update these URLs to point to your actual backend
const API_BASE_URL_MS1: string = 'http://localhost:8036'; // Changed from 8036 to default Spring Boot port
const API_BASE_URL_MS2: string = 'http://localhost:8081'; // Separate port for MS2 Flask API

// Interfaces for type safety
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

// Create axios instances for each microservice
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

// Add request interceptors for logging
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

// MS1 API services (sensor data)
export const sensorService = {
  // Get all current sensor readings
  getCurrentReadings: async (): Promise<SensorReading[]> => {
    try {
      const response: AxiosResponse<SensorReading[]> = await ms1Api.get('/sensors/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current sensor readings:', error);
      throw error;
    }
  },
  
  // Get historical sensor data with optional filters
  getHistoricalData: async (params: HistoricalDataParams = {}): Promise<SensorReading[]> => {
    try {
      const response: AxiosResponse<SensorReading[]> = await ms1Api.get('/sensors/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical sensor data:', error);
      throw error;
    }
  },
  
  // Get active alerts
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response: AxiosResponse<Alert[]> = await ms1Api.get('/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Test connection to backend
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

// MS2 API services (predictions)
export const predictionService = {
  // Get disease predictions
  getDiseasePredictions: async (): Promise<DiseasePrediction[]> => {
    try {
      const response: AxiosResponse<DiseasePrediction[]> = await ms2Api.get('/predictions/diseases');
      return response.data;
    } catch (error) {
      console.error('Error fetching disease predictions:', error);
      throw error;
    }
  },
  
  // Get water usage recommendations
  getWaterRecommendations: async (): Promise<WaterRecommendation[]> => {
    try {
      const response: AxiosResponse<WaterRecommendation[]> = await ms2Api.get('/predictions/water');
      return response.data;
    } catch (error) {
      console.error('Error fetching water recommendations:', error);
      throw error;
    }
  },
  
  // Get crop yield predictions
  getCropYieldPredictions: async (): Promise<CropYieldPrediction[]> => {
    try {
      const response: AxiosResponse<CropYieldPrediction[]> = await ms2Api.get('/predictions/yield');
      return response.data;
    } catch (error) {
      console.error('Error fetching crop yield predictions:', error);
      throw error;
    }
  },

  // Test connection to MS2
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

// Export base URLs for WebSocket connections
export const WS_BASE_URL: string = 'http://localhost:8036/ws'; // SockJS endpoint (HTTP, not WS)

// Export axios instances for advanced usage
export { ms1Api, ms2Api };