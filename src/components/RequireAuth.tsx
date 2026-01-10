import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { isTokenValid } from '../utils/isTokenValid';

export function RequireAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isTokenValid(token)) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}
