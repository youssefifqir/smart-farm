import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

// Polyfill for global if not defined
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Lazy import SockJS to avoid immediate global reference error
let SockJS: any = null;

const loadSockJS = async (): Promise<any> => {
  if (!SockJS) {
    try {
      const sockjsModule = await import('sockjs-client');
      SockJS = sockjsModule.default;
    } catch (error) {
      console.error('Failed to load SockJS:', error);
      throw error;
    }
  }
  return SockJS;
};

export interface SensorData {
  id?: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  isFire?: boolean;
  isRaining?: boolean;
  timestamp?: string;
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

export interface UseWebSocketReturn {
  sensorData: SensorData | null;
  weatherData: WeatherData | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

const useWebSocket = (url: string): UseWebSocketReturn => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);

  const connect = async () => {
    if (clientRef.current?.connected) {
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      // Load SockJS dynamically
      const SockJSClass = await loadSockJS();
      
      // Ensure URL uses HTTP/HTTPS for SockJS, not WS/WSS
      let sockjsUrl = url;
      if (url.startsWith('ws://')) {
        sockjsUrl = url.replace('ws://', 'http://');
      } else if (url.startsWith('wss://')) {
        sockjsUrl = url.replace('wss://', 'https://');
      }
      
      console.log('Connecting to SockJS URL:', sockjsUrl);
      
      // Create SockJS connection
      const socket = new SockJSClass(sockjsUrl);
      
      // Create STOMP client
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = (frame) => {
        if (!mountedRef.current) return;
        
        console.log('Connected to WebSocket:', frame);
        setConnectionStatus('connected');
        setError(null);

        // Subscribe to sensor data topic
        client.subscribe('/topic/sensor-data', (message) => {
          if (!mountedRef.current) return;
          
          try {
            const data = JSON.parse(message.body);
            console.log('Received sensor data:', data);
            setSensorData(data);
          } catch (err) {
            console.error('Error parsing sensor data:', err);
            setError('Error parsing sensor data');
          }
        });

        // Subscribe to weather forecast topic
        client.subscribe('/topic/weather-forecast', (message) => {
          if (!mountedRef.current) return;
          
          try {
            const data = JSON.parse(message.body);
            console.log('Received weather data:', data);
            setWeatherData(data);
          } catch (err) {
            console.error('Error parsing weather data:', err);
            setError('Error parsing weather data');
          }
        });
      };

      client.onStompError = (frame) => {
        if (!mountedRef.current) return;
        
        console.error('STOMP Error:', frame);
        setConnectionStatus('error');
        setError(`STOMP Error: ${frame.headers['message'] || 'Unknown error'}`);
      };

      client.onWebSocketError = (event) => {
        if (!mountedRef.current) return;
        
        console.error('WebSocket Error:', event);
        setConnectionStatus('error');
        setError('WebSocket connection error');
      };

      client.onDisconnect = (frame) => {
        if (!mountedRef.current) return;
        
        console.log('Disconnected from WebSocket:', frame);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            console.log('Attempting to reconnect...');
            connect();
          }
        }, 5000);
      };

      clientRef.current = client;
      client.activate();

    } catch (err) {
      if (!mountedRef.current) return;
      
      console.error('Error creating WebSocket connection:', err);
      setConnectionStatus('error');
      setError(`Failed to create WebSocket connection: ${(err as Error).message || err}`);
    }
  };

  const disconnect = (): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  const reconnect = (): void => {
    disconnect();
    setTimeout(() => connect(), 1000);
  };

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [url]);

  return {
    sensorData,
    weatherData,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    error,
    reconnect,
  };
};

export default useWebSocket;
// import { useEffect, useRef, useState } from 'react';
// import { Client } from '@stomp/stompjs';

// // Polyfill for global if not defined
// if (typeof global === 'undefined') {
//   (window as any).global = window;
// }

// // Lazy import SockJS to avoid immediate global reference error
// let SockJS: any = null;

// const loadSockJS = async (): Promise<any> => {
//   if (!SockJS) {
//     try {
//       const sockjsModule = await import('sockjs-client');
//       SockJS = sockjsModule.default;
//     } catch (error) {
//       console.error('Failed to load SockJS:', error);
//       throw error;
//     }
//   }
//   return SockJS;
// };

// export interface SensorData {
//   id?: number;
//   temperature: number;
//   humidity: number;
//   soilMoisture: number;
//   lightIntensity: number;
//   isFire?: boolean;
//   isRaining?: boolean;
//   timestamp?: string;
// }

// export interface UseWebSocketReturn {
//   sensorData: SensorData | null;
//   connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
//   isConnected: boolean; // Added for compatibility with Dashboard
//   error: string | null;
//   reconnect: () => void;
// }

// const useWebSocket = (url: string): UseWebSocketReturn => {
//   const [sensorData, setSensorData] = useState<SensorData | null>(null);
//   const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
//   const [error, setError] = useState<string | null>(null);
//   const clientRef = useRef<Client | null>(null);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const mountedRef = useRef<boolean>(true);

//   const connect = async () => {
//     if (clientRef.current?.connected) {
//       return;
//     }

//     setConnectionStatus('connecting');
//     setError(null);

//     try {
//       // Load SockJS dynamically
//       const SockJSClass = await loadSockJS();
      
//       // Ensure URL uses HTTP/HTTPS for SockJS, not WS/WSS
//       let sockjsUrl = url;
//       if (url.startsWith('ws://')) {
//         sockjsUrl = url.replace('ws://', 'http://');
//       } else if (url.startsWith('wss://')) {
//         sockjsUrl = url.replace('wss://', 'https://');
//       }
      
//       console.log('Connecting to SockJS URL:', sockjsUrl);
      
//       // Create SockJS connection
//       const socket = new SockJSClass(sockjsUrl);
      
//       // Create STOMP client
//       const client = new Client({
//         webSocketFactory: () => socket,
//         debug: (str) => {
//           console.log('STOMP Debug:', str);
//         },
//         reconnectDelay: 5000,
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000,
//       });

//       client.onConnect = (frame) => {
//         if (!mountedRef.current) return;
        
//         console.log('Connected to WebSocket:', frame);
//         setConnectionStatus('connected');
//         setError(null);

//         // Subscribe to sensor data topic
//         client.subscribe('/topic/sensor-data', (message) => {
//           if (!mountedRef.current) return;
          
//           try {
//             const data = JSON.parse(message.body);
//             console.log('Received sensor data:', data);
//             setSensorData(data);
//           } catch (err) {
//             console.error('Error parsing sensor data:', err);
//             setError('Error parsing sensor data');
//           }
//         });
//       };

//       client.onStompError = (frame) => {
//         if (!mountedRef.current) return;
        
//         console.error('STOMP Error:', frame);
//         setConnectionStatus('error');
//         setError(`STOMP Error: ${frame.headers['message'] || 'Unknown error'}`);
//       };

//       client.onWebSocketError = (event) => {
//         if (!mountedRef.current) return;
        
//         console.error('WebSocket Error:', event);
//         setConnectionStatus('error');
//         setError('WebSocket connection error');
//       };

//       client.onDisconnect = (frame) => {
//         if (!mountedRef.current) return;
        
//         console.log('Disconnected from WebSocket:', frame);
//         setConnectionStatus('disconnected');
        
//         // Attempt to reconnect after 5 seconds
//         if (reconnectTimeoutRef.current) {
//           clearTimeout(reconnectTimeoutRef.current);
//         }
//         reconnectTimeoutRef.current = setTimeout(() => {
//           if (mountedRef.current) {
//             console.log('Attempting to reconnect...');
//             connect();
//           }
//         }, 5000);
//       };

//       clientRef.current = client;
//       client.activate();

//     } catch (err) {
//       if (!mountedRef.current) return;
      
//       console.error('Error creating WebSocket connection:', err);
//       setConnectionStatus('error');
//       setError(`Failed to create WebSocket connection: ${(err as Error).message || err}`);
//     }
//   };

//   const disconnect = (): void => {
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }

//     if (clientRef.current) {
//       clientRef.current.deactivate();
//       clientRef.current = null;
//     }
//     setConnectionStatus('disconnected');
//   };

//   const reconnect = (): void => {
//     disconnect();
//     setTimeout(() => connect(), 1000);
//   };

//   useEffect(() => {
//     mountedRef.current = true;
//     connect();

//     return () => {
//       mountedRef.current = false;
//       disconnect();
//     };
//   }, [url]);

//   return {
//     sensorData,
//     connectionStatus,
//     isConnected: connectionStatus === 'connected', // Added for compatibility
//     error,
//     reconnect,
//   };
// };

// export default useWebSocket;