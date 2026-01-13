import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './auth.types';
import { getMeThunk, loginThunk, logoutThunk, refreshTokenThunk } from './auth.thunks';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initDone(state) {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })

      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })

      .addCase(getMeThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (_, action) => {
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});
export const { initDone } = authSlice.actions;
export default authSlice.reducer;
