import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const createPlan = (planData) => api.post('/workouts/plans', planData);
export const getPlans = () => api.get('/workouts/plans');
export const createLog = (logData) => api.post('/workouts/logs', logData);
export const getLogs = () => api.get('/workouts/logs');

export default api;