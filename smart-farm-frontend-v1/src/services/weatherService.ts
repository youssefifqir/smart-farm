import { ms1Api } from './api';

export interface WeatherForecastParams {
  latitude?: number;
  longitude?: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezoneAbbreviation: string;
  dailyUnits: {
    time: string;
    temperature2mMax: string;
    temperature2mMin: string;
    precipitationSum: string;
  };
  daily: {
    time: string[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    precipitationSum: number[];
  };
}

export const weatherService = {
  // Get weather forecast as JSON (original format)
  getWeatherForecastJson: async (params: WeatherForecastParams = {}): Promise<any> => {
    try {
      const response = await ms1Api.get('/weather/forecast', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast (JSON):', error);
      throw error;
    }
  },

  // Get weather forecast as structured record
  getWeatherForecast: async (params: WeatherForecastParams = {}): Promise<WeatherData> => {
    try {
      const response = await ms1Api.get('/weather/forecast/record', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast (Record):', error);
      throw error;
    }
  },

  // Trigger weather forecast broadcast via WebSocket
  broadcastWeatherForecast: async (params: WeatherForecastParams = {}): Promise<void> => {
    try {
      await ms1Api.post('/weather/broadcast', params);
      console.log('Weather forecast broadcast triggered');
    } catch (error) {
      console.error('Error triggering weather forecast broadcast:', error);
      throw error;
    }
  }
};

// Export for use in other components
export default weatherService;