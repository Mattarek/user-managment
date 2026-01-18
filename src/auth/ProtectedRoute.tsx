import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks.ts';
import { useEffect } from 'react';
import { getMeThunk } from '../features/auth/auth.thunks.ts';
import { PATIENT_ACCESS_TOKEN } from '../constants.ts';

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

    if (token) {
      dispatch(getMeThunk());
    }
  }, [dispatch]);

  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
