import { Navigate, Outlet } from 'react-router-dom';
import { PATIENT_ACCESS_TOKEN } from '../constants.ts';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

const timeStamp = Date.now();

export function PublicRoute() {
  const token = localStorage.getItem(PATIENT_ACCESS_TOKEN);

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const isExpired = decoded.exp ? decoded.exp * 1000 < timeStamp : true;

      if (!isExpired) {
        return <Navigate to="/dashboard" replace />;
      }

      localStorage.removeItem(PATIENT_ACCESS_TOKEN);
    } catch (e) {
      localStorage.removeItem(PATIENT_ACCESS_TOKEN);
    }
  }

  return <Outlet />;
}
