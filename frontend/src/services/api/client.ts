import axios from 'axios';
import type { AxiosInstance } from 'axios';

// API Base Configuration
const API_BASE_URL = 'http://34.159.29.21:8080';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      console.log('✅ API Response:', response.status, response.data);
    }
    
    return response;
  },
  (error) => {
    // Log error in development
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
