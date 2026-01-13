import { api } from './axios';
import type { LoginPayload, RegisterPayload } from '../features/auth/auth.types';

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post('/login', payload);
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await api.post('/register', payload);
  return data;
};

export const logoutApi = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  await api.post('/logout', {
    refreshToken,
    accessToken,
  });
};

export const recoveryApi = async (email: string) => {
  await api.post('/users/remind-password', { email });
};
