import axios from 'axios';
import { axiosInstance } from './axiosInstance.ts';
import { PATIENTS_ACCESS_TOKEN, PATIENTS_REFRESH_TOKEN } from '../constants.ts';

const API_URL = import.meta.env.VITE_API_URL;
export const axiosSecureInstance = axios.create({
  baseURL: API_URL,
});

axiosSecureInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(PATIENTS_ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosSecureInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axiosInstance.post('/refresh-token', {
        refreshToken,
      });

      localStorage.setItem(PATIENTS_ACCESS_TOKEN, res.data.accessToken);
      localStorage.setItem(PATIENTS_REFRESH_TOKEN, res.data.refreshToken);

      return axiosSecureInstance(originalRequest);
    } catch {
      localStorage.removeItem(PATIENTS_ACCESS_TOKEN);
      localStorage.removeItem(PATIENTS_REFRESH_TOKEN);
      return Promise.reject(error);
    }
  },
);
