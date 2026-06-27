import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Har request jaane se pehle, agar token saved hai to usay automatically attach karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agar token expire/invalid ho jaye (401 error), to user ko login page pe bhej do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;