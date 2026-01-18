import { Navigate, Outlet } from 'react-router-dom';
import { PATIENT_ACCESS_TOKEN } from '../constants.ts';

export function PublicRoute() {
  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
