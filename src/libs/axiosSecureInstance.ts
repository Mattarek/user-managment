import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance.ts';
import { PATIENTS_ACCESS_TOKEN, PATIENTS_REFRESH_TOKEN } from '../constants.ts';

const API_URL = import.meta.env.VITE_API_URL;
export const axiosSecureInstance = axios.create({
  baseURL: API_URL,
});
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
axiosSecureInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(PATIENTS_ACCESS_TOKEN);

  if (!token) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
});

// autoRefresh for learning, but I prefer to use button to renew session
axiosSecureInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest) throw error;
    if (error.response?.status !== 401) throw error;
    if (originalRequest.url?.includes('auth/refresh-token')) throw error;

    if (originalRequest._retry) throw error;
    originalRequest._retry = true;

    try {
      const res = await axiosInstance.post('auth/refresh-token', {
        refreshToken,
      });

      localStorage.setItem(PATIENTS_ACCESS_TOKEN, res.data.accessToken);
      localStorage.setItem(PATIENTS_REFRESH_TOKEN, res.data.refreshToken);

      return axiosSecureInstance(originalRequest);
    } catch {
      localStorage.removeItem(PATIENTS_ACCESS_TOKEN);
      localStorage.removeItem(PATIENTS_REFRESH_TOKEN);
      throw error;
    }
  },
);
