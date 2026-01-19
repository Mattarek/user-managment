import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks.ts';
import { useEffect } from 'react';
import { getMeThunk, refreshTokenThunk } from '../features/auth/auth.thunks.ts';
import { PATIENT_ACCESS_TOKEN, PATIENT_REFRESH_TOKEN } from '../constants.ts';
import { jwtDecode } from 'jwt-decode';

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(PATIENT_REFRESH_TOKEN);

    if (!token || !refreshToken) return;

    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      dispatch(refreshTokenThunk()).then(() => {
        dispatch(getMeThunk());
      });
    } else {
      dispatch(getMeThunk());
    }
  }, [dispatch]);

  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
