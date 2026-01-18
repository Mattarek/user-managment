import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginPayload, RegisterPayload } from './auth.types';
import { isTokenExpired } from '../../utils/isTokenExpired.ts';
import { api } from '../../api/axiosInstance.ts';
import { axiosSecuredInstance } from '../../api/axiosSecuredInstance.ts';
import axios from 'axios';

export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export const loginThunk = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/login', payload);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return rejectWithValue('Login failed');
  }
});

export const refreshTokenThunk = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return rejectWithValue('NO_REFRESH_TOKEN');
  }

  try {
    const res = await axiosSecuredInstance.post('/refresh-token', {
      refreshToken,
    });

    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };
  } catch {
    return rejectWithValue('REFRESH_FAILED');
  }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { dispatch, rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return rejectWithValue('NO_TOKEN');
  }

  if (isTokenExpired(token)) {
    const refreshResult = await dispatch(refreshTokenThunk());

    if (!refreshTokenThunk.fulfilled.match(refreshResult)) {
      return rejectWithValue('REFRESH_FAILED');
    }
  }

  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch {
    return rejectWithValue('UNAUTHORIZED');
  }
});

export const registerThunk = createAsyncThunk<
  void,
  RegisterPayload,
  {
    rejectValue: string;
  }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/register', payload);
    localStorage.setItem('accessToken', data.accessToken);
    return;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const status = error.response?.status;

      if (status === 422) {
        return rejectWithValue('EMAIL_ALREADY_EXISTS');
      }

      if (status === 400) {
        return rejectWithValue('VALIDATION_ERROR');
      }
    }

    return rejectWithValue('Register failed');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    await api.post('/logout', {
      refreshToken,
      accessToken,
    });
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

export const recoveryThunk = createAsyncThunk<
  void,
  string,
  {
    rejectValue: string;
  }
>('auth/recovery', async (email, { rejectWithValue }) => {
  try {
    await api.post('/users/remind-password', { email });
  } catch {
    return rejectWithValue('User not found');
  }
});
