import { api } from './axios';
import type { LoginPayload, RegisterPayload, User } from '../features/auth/auth.types';

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post('/login', payload);
  return data;
};

export const getMeApi = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await api.post('/register', payload);
  return data;
};

export const logoutApi = async () => {
  await api.post('/logout');
};

export const recoveryApi = async (email: string) => {
  await api.post('/users/remind-password', { email });
};
