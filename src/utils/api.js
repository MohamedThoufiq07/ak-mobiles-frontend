import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is 401 Unauthorized, maybe redirect to login or clear token
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isAuthSubmit = url.includes('/auth/login') || 
                           url.includes('/auth/register') || 
                           url.includes('/auth/forgot-password') || 
                           url.includes('/auth/reset-password');
      
      if (!isAuthSubmit) {
        localStorage.removeItem('token');
        // Only show error if it's not a profile check on initial load
        if (error.config.url !== '/auth/profile') {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
