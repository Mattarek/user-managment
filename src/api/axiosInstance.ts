import axios from 'axios';
import { axiosSecuredInstance } from './axiosSecuredInstance.ts';
import { PATIENT_ACCESS_TOKEN, PATIENT_REFRESH_TOKEN } from '../constants.ts';

const API_URL = import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(PATIENT_REFRESH_TOKEN);

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axiosSecuredInstance.post('/refresh-token', {
        refreshToken,
      });

      localStorage.setItem(PATIENT_ACCESS_TOKEN, res.data.accessToken);
      localStorage.setItem(PATIENT_REFRESH_TOKEN, res.data.refreshToken);

      return api(originalRequest);
    } catch {
      localStorage.removeItem(PATIENT_ACCESS_TOKEN);
      localStorage.removeItem(PATIENT_REFRESH_TOKEN);
      return Promise.reject(error);
    }
  },
);
