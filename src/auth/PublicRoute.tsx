import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';

export function PublicRoute() {
  const { initialized, isAuthenticated } = useAppSelector((s) => s.auth);
  console.log(isAuthenticated);
  console.log(initialized);
  if (initialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
