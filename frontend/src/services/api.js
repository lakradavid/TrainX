import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://train-x-qz8o.vercel.app/api';
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
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
export const deletePlan = (planId) => api.delete(`/workouts/plans/${planId}`);
export const createLog = (logData) => api.post('/workouts/logs', logData);
export const getLogs = () => api.get('/workouts/logs');

// Profile endpoints
export const getProfile = () => api.get('/profile');
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const addMeasurement = (measurementData) => api.post('/profile/measurements', measurementData);
export const addPersonalRecord = (recordData) => api.post('/profile/records', recordData);
export const getAnalytics = () => api.get('/profile/analytics');

// User profile endpoints
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);
export const uploadProfilePicture = (formData) => api.put('/users/profile-picture', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const removeProfilePicture = () => api.delete('/users/profile-picture');

// Fallback functions for when profile API is not available
export const getProfileSafe = async () => {
  try {
    return await getProfile();
  } catch (error) {
    console.log('Profile API not available, using defaults');
    return { data: null };
  }
};

export const updateProfileSafe = async (profileData) => {
  try {
    return await updateProfile(profileData);
  } catch (error) {
    console.log('Profile API not available, skipping update');
    return { data: null };
  }
};

export default api;