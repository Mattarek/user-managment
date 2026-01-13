import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';
import { AppLoader } from '../components/AppLoader.tsx';

export function ProtectedRoute() {
  const { initialized, isAuthenticated, loading } = useAppSelector((s) => s.auth);

  if (loading) return null;

  if (!initialized) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
