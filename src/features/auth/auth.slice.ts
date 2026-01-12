import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './auth.types';
import { getMeThunk, loginThunk, logoutThunk } from './auth.thunks';

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
      // LOGIN
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

      // GET ME
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
      })

      // LOGOUT
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
