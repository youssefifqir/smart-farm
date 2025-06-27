// import { useState, useEffect, ReactNode } from 'react';
// import { Cloud, CloudRain, CloudDrizzle, Sun, Wind, Thermometer, CloudSnow, AlertTriangle, ChevronRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import useWebSocket from '../../hooks/useWebSocket';
// import { WS_BASE_URL } from '../../services/api';

// type Weather = {
//   day: string;
//   temp: string;
//   condition: string;
//   icon: ReactNode;
// };

// const WeatherForecast = () => {
//   const navigate = useNavigate();
//   const { weatherData, connectionStatus } = useWebSocket(WS_BASE_URL);
//   const [forecast, setForecast] = useState<Weather[]>([]);

//   // Enhanced weather icon function with more detailed conditions
//   const getWeatherIcon = (precipitation: number, temp: number, size: number = 32) => {
//     const iconProps = { size, className: "transition-colors duration-200" };
    
//     // Heavy rain conditions
//     if (precipitation > 10) {
//       return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-600`} />;
//     }
    
//     // Moderate rain
//     if (precipitation > 5) {
//       return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-500`} />;
//     }
    
//     // Light rain/drizzle
//     if (precipitation > 1) {
//       return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-400`} />;
//     }
    
//     // Very light precipitation
//     if (precipitation > 0.1) {
//       return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-gray-500`} />;
//     }
    
//     // Snow conditions (if temperature is low)
//     if (temp < 2 && precipitation > 0) {
//       return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-300`} />;
//     }
    
//     // Clear sunny conditions
//     if (temp > 28) {
//       return <Sun {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
//     }
    
//     // Warm sunny conditions
//     if (temp > 22) {
//       return <Sun {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
//     }
    
//     // Mild conditions
//     if (temp > 15) {
//       return <Sun {...iconProps} className={`${iconProps.className} text-orange-400`} />;
//     }
    
//     // Cool/cloudy conditions
//     if (temp > 10) {
//       return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
//     }
    
//     // Cold conditions
//     return <Cloud {...iconProps} className={`${iconProps.className} text-gray-500`} />;
//   };

//   // Enhanced weather condition text with more descriptive labels
//   const getWeatherCondition = (precipitation: number, temp: number) => {
//     if (precipitation > 10) return 'Heavy Rain';
//     if (precipitation > 5) return 'Moderate Rain';
//     if (precipitation > 1) return 'Light Rain';
//     if (precipitation > 0.1) return 'Drizzle';
//     if (temp < 2 && precipitation > 0) return 'Snow';
//     if (temp > 35) return 'Very Hot';
//     if (temp > 28) return 'Hot & Sunny';
//     if (temp > 22) return 'Sunny';
//     if (temp > 15) return 'Mild';
//     if (temp > 10) return 'Cool';
//     if (temp > 5) return 'Cold';
//     return 'Very Cold';
//   };

//   // Helper function to format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) return 'Today';
//     if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
//     return date.toLocaleDateString('en-US', { weekday: 'short' });
//   };

//   // Process weather data when it changes
//   useEffect(() => {
//     if (weatherData && weatherData.daily) {
//       const processedForecast = weatherData.daily.time.slice(0, 5).map((time, index) => {
//         const tempMax = weatherData.daily.temperature2mMax[index];
//         const tempMin = weatherData.daily.temperature2mMin[index];
//         const precipitation = weatherData.daily.precipitationSum[index];
//         const avgTemp = Math.round((tempMax + tempMin) / 2);
        
//         return {
//           day: formatDate(time),
//           temp: `${avgTemp}°`,
//           condition: getWeatherCondition(precipitation, avgTemp),
//           icon: getWeatherIcon(precipitation, avgTemp, 32)
//         };
//       });
      
//       setForecast(processedForecast);
//     }
//   }, [weatherData]);

//   // Loading state
//   if (connectionStatus !== 'connected' || forecast.length === 0) {
//     return (
//       <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800">Weather Forecast</h2>
//           <div className="flex items-center space-x-2">
//             <div className={`w-2 h-2 rounded-full ${
//               connectionStatus === 'connected' ? 'bg-green-500' : 
//               connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
//             }`}></div>
//             <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
//           </div>
//         </div>
//         <div className="flex items-center justify-center h-32">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
//             <p className="text-sm text-gray-500">Loading weather data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">Weather Forecast</h2>
//         <button
//           onClick={() => navigate('/weather')}
//           className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors"
//         >
//           <span>View Details</span>
//           <ChevronRight size={16} />
//         </button>
//       </div>
      
//       <div className="grid grid-cols-5 gap-2">
//         {forecast.map((item, index) => (
//           <div 
//             key={index} 
//             className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
//           >
//             <span className="text-sm font-medium text-gray-700 mb-2">{item.day}</span>
//             <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
//               {item.icon}
//             </div>
//             <span className="text-xl font-semibold mb-1">{item.temp}</span>
//             <span className="text-xs text-gray-500 text-center leading-tight">
//               {item.condition}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeatherForecast;

import { useState, useEffect, ReactNode } from 'react';
import { Cloud, CloudRain, CloudDrizzle, Sun, Wind, Thermometer, CloudSnow, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../../hooks/useWebSocket';
import { WS_BASE_URL } from '../../services/api';

type Weather = {
  day: string;
  temp: string;
  condition: string;
  icon: ReactNode;
};

const WeatherForecast = () => {
  const navigate = useNavigate();
  const { weatherData, connectionStatus } = useWebSocket(WS_BASE_URL);
  const [forecast, setForecast] = useState<Weather[]>([]);

  // Enhanced weather icon function with more detailed conditions
  const getWeatherIcon = (precipitation: number, temp: number, size: number = 32) => {
    const iconProps = { size, className: "transition-colors duration-200" };
    
    // Heavy rain conditions
    if (precipitation > 10) {
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    }
    
    // Moderate rain
    if (precipitation > 5) {
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    }
    
    // Light rain/drizzle
    if (precipitation > 1) {
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-400`} />;
    }
    
    // Very light precipitation
    if (precipitation > 0.1) {
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
    
    // Snow conditions (if temperature is low)
    if (temp < 2 && precipitation > 0) {
      return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-300`} />;
    }
    
    // Clear sunny conditions
    if (temp > 28) {
      return <Sun {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    }
    
    // Warm sunny conditions
    if (temp > 22) {
      return <Sun {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    }
    
    // Mild conditions
    if (temp > 15) {
      return <Sun {...iconProps} className={`${iconProps.className} text-orange-400`} />;
    }
    
    // Cool/cloudy conditions
    if (temp > 10) {
      return <Cloud {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
    
    // Cold conditions
    return <Cloud {...iconProps} className={`${iconProps.className} text-gray-500`} />;
  };

  // Enhanced weather condition text with more descriptive labels
  const getWeatherCondition = (precipitation: number, temp: number) => {
    if (precipitation > 10) return 'Heavy Rain';
    if (precipitation > 5) return 'Moderate Rain';
    if (precipitation > 1) return 'Light Rain';
    if (precipitation > 0.1) return 'Drizzle';
    if (temp < 2 && precipitation > 0) return 'Snow';
    if (temp > 35) return 'Very Hot';
    if (temp > 28) return 'Hot & Sunny';
    if (temp > 22) return 'Sunny';
    if (temp > 15) return 'Mild';
    if (temp > 10) return 'Cool';
    if (temp > 5) return 'Cold';
    return 'Very Cold';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Process weather data when it changes
  useEffect(() => {
    if (weatherData && weatherData.daily) {
      const processedForecast = weatherData.daily.time.slice(0, 5).map((time, index) => {
        const tempMax = weatherData.daily.temperature2mMax[index];
        const tempMin = weatherData.daily.temperature2mMin[index];
        const precipitation = weatherData.daily.precipitationSum[index];
        const avgTemp = Math.round((tempMax + tempMin) / 2);
        
        return {
          day: formatDate(time),
          temp: `${avgTemp}°`,
          condition: getWeatherCondition(precipitation, avgTemp),
          icon: getWeatherIcon(precipitation, avgTemp, 32)
        };
      });
      
      setForecast(processedForecast);
    }
  }, [weatherData]);

  // Loading state
  if (connectionStatus !== 'connected' || forecast.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Weather Forecast</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Weather Forecast</h2>
        <button
          onClick={() => navigate('/weather')}
          className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700 mb-2">{item.day}</span>
            <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </div>
            <span className="text-xl font-semibold mb-1">{item.temp}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">
              {item.condition}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs text-gray-400">Average daily temperatures</span>
      </div>
    </div>
  );
};

export default WeatherForecast;