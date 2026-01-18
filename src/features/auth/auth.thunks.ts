import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginPayload, RegisterPayload } from './auth.types';
import { isTokenExpired } from '../../utils/isTokenExpired.ts';
import { axiosSecureInstance } from '../../libs/axiosSecureInstance.ts';
import { axiosInstance } from '../../libs/axiosInstance.ts';
import axios from 'axios';
import { PATIENT_ACCESS_TOKEN, PATIENT_REFRESH_TOKEN } from '../../constants.ts';

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
    const { data } = await axiosSecureInstance.post('/login', payload);

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
  const refreshToken = localStorage.getItem(PATIENT_REFRESH_TOKEN);

  if (!refreshToken) {
    return rejectWithValue('NO_REFRESH_TOKEN');
  }

  try {
    const res = await axiosInstance.post('/refresh-token', {
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
  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

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
    const res = await axiosSecureInstance.get('/users/me');
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
    const { data } = await axiosSecureInstance.post('/register', payload);
    localStorage.setItem(PATIENT_ACCESS_TOKEN, data.accessToken);
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
    const refreshToken = localStorage.getItem(PATIENT_REFRESH_TOKEN);
    const accessToken = localStorage.getItem(PATIENT_ACCESS_TOKEN);

    await axiosSecureInstance.post('/logout', {
      refreshToken,
      accessToken,
    });
  } finally {
    localStorage.removeItem(PATIENT_ACCESS_TOKEN);
    localStorage.removeItem(PATIENT_REFRESH_TOKEN);
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
    await axiosSecureInstance.post('/users/remind-password', { email });
  } catch {
    return rejectWithValue('User not found');
  }
});
