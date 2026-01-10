import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { isTokenValid } from '../utils/isTokenValid';
import { Box, CircularProgress } from '@mui/material';

export function RequireAuth() {
  const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');

  if (!initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
