import axios from 'axios';
import toast from 'react-hot-toast';

// A SEPARATE axios client for the admin panel. It uses its own token
// ('adminToken') so the admin session is completely independent from the
// storefront/customer session ('token'). Logging into the admin panel does
// NOT log you into the shop, and vice-versa.
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isLoginSubmit = url.includes('/auth/login');
      if (!isLoginSubmit) {
        localStorage.removeItem('adminToken');
        const path = window.location.pathname;
        if (path.startsWith('/admin') && path !== '/admin/login') {
          if (url !== '/auth/profile') toast.error('Admin session expired. Please sign in again.');
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
