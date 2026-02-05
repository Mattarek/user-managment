import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginPayload, RegisterPayload } from './auth.types';
import { axiosSecureInstance } from '../../libs/axiosSecureInstance.ts';
import { axiosInstance } from '../../libs/axiosInstance.ts';
import axios from 'axios';
import { PATIENTS_ACCESS_TOKEN, PATIENTS_REFRESH_TOKEN } from '../../constants.ts';
import type { ApiErrorResponse } from '../../types/patientsApi.types.ts';
import type { ChangePasswordPayload, ProfileFormState } from '../../types/types.ts';

export const loginThunk = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const {
      data: { accessToken, refreshToken },
    } = await axiosSecureInstance.post('auth/login', payload);

    localStorage.setItem(PATIENTS_ACCESS_TOKEN, accessToken);
    localStorage.setItem(PATIENTS_REFRESH_TOKEN, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return rejectWithValue(extractAxiosError(error, 'loginThunk failed'));
  }
});

type ResetPasswordPayload = {
  token: string;
  password: string;
};

export const resetPasswordThunk = createAsyncThunk<void, ResetPasswordPayload, { rejectValue: string }>(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        return rejectWithValue(msg || 'Reset password failed');
      }
    } catch (error) {
      return rejectWithValue(extractAxiosError(error, 'Network error'));
    }
  },
);

export const refreshTokenThunk = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

  if (!refreshToken) return rejectWithValue('NO_REFRESH_TOKEN');

  try {
    const res = await axiosInstance.post('auth/refresh-token', { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = res.data;

    localStorage.setItem(PATIENTS_ACCESS_TOKEN, accessToken);
    localStorage.setItem(PATIENTS_REFRESH_TOKEN, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    localStorage.removeItem(PATIENTS_ACCESS_TOKEN);
    localStorage.removeItem(PATIENTS_REFRESH_TOKEN);
    return rejectWithValue('REFRESH_FAILED');
  }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosSecureInstance.get('/users/getMe');
    return res.data;
  } catch (error) {
    return rejectWithValue(extractAxiosError(error, 'GetMe failed'));
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
    await axiosSecureInstance.post('auth/register', payload);
    return;
  } catch (error) {
    return rejectWithValue(extractAxiosError(error, 'Register failed'));
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);
    const accessToken = localStorage.getItem(PATIENTS_ACCESS_TOKEN);

    await axiosSecureInstance.post('auth/logout', {
      refreshToken,
      accessToken,
    });
  } finally {
    localStorage.removeItem(PATIENTS_REFRESH_TOKEN);
    localStorage.removeItem(PATIENTS_ACCESS_TOKEN);
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
    await axiosSecureInstance.post('auth/remind-password', { email });
  } catch (error) {
    return rejectWithValue(extractAxiosError(error, 'User not found'));
  }
});

export const updateProfileThunk = createAsyncThunk<unknown, ProfileFormState, { rejectValue: string }>(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('auth/updateProfile', payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractAxiosError(error, 'Error while updating profile /api/auth/updateProfile.'));
    }
  },
);

export const changePasswordThunk = createAsyncThunk<unknown, ChangePasswordPayload, { rejectValue: string }>(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put('auth/changePassword', payload);
      return data;
    } catch (error) {
      return rejectWithValue(extractAxiosError(error, 'Error: /api/auth/changePassword.'));
    }
  },
);

const extractAxiosError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : fallback;
};
