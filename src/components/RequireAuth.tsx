import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
