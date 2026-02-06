import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './auth.types';
import { getMeThunk, loginThunk, logoutThunk, updateAvatarThunk } from './auth.thunks';

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
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

      .addCase(updateAvatarThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatarThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAvatarThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Avatar update failed';
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

export default authSlice.reducer;
