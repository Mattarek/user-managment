import { Navigate, Outlet } from 'react-router-dom';
import { PATIENT_ACCESS_TOKEN } from '../constants';
import { useEffect } from 'react';
import { isTokenExpired } from '../utils/isTokenExpired.ts';

export function PublicRoute() {
  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);
  const expired = isTokenExpired(token);

  useEffect(() => {
    if (token && expired) {
      localStorage.removeItem(PATIENT_ACCESS_TOKEN);
    }
  }, [token, expired]);

  if (token && !expired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
