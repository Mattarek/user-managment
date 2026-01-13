import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { useEffect } from 'react';
import { getMeThunk } from '../features/auth/auth.thunks.ts';

export function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      dispatch(getMeThunk());
    }
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
