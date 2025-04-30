import axios from 'axios';

// This would be replaced with your actual API endpoints
const API_BASE_URL_MS1 = 'https://api.example.com/ms1';
const API_BASE_URL_MS2 = 'https://api.example.com/ms2';

// Create axios instances for each microservice
const ms1Api = axios.create({
  baseURL: API_BASE_URL_MS1,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const ms2Api = axios.create({
  baseURL: API_BASE_URL_MS2,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// MS1 API services (sensor data)
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

// MS2 API services (predictions)
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