import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';

export function PublicRoute() {
  const { initialized, isAuthenticated } = useAppSelector((s) => s.auth);

  if (initialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
