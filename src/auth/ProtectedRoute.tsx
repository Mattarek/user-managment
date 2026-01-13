import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks.ts';
import { AppLoader } from '../components/AppLoader.tsx';

export function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAppSelector((s) => s.auth);

  console.log('initialized: ' + initialized);
  if (!initialized) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
