import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://besteam.onrender.com/';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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

apiClient.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      console.log('✅ API Response:', response.status, response.data);
    }
    
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
