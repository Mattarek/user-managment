import axios from 'axios';
import { refreshApi } from './refreshApi.ts';

const API_URL = import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await refreshApi.post('/refresh-token', {
        refreshToken,
      });

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      return api(originalRequest);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return Promise.reject(error);
    }
  },
);
