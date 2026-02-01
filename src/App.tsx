import 'normalize.css';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import {
  AddDoctor,
  AddPatient,
  DashboardHome,
  Doctors,
  ErrorPage,
  ForgotPasswordPage,
  LoginPage,
  Patients,
  RegisterPage,
  Terms,
} from './features/pages';
import { appPaths } from './routes.tsx';
import { DashboardLayoutWrapper } from './wrappers/DashboardLayoutWrapper.tsx';
import { PATIENTS_ACCESS_TOKEN, PATIENTS_REFRESH_TOKEN } from './constants.ts';
import { isTokenExpired } from './utils/isTokenExpired.ts';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks.ts';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenThunk } from './features/auth/auth.thunks.ts';
import { ResetPasswordPage } from './features/pages/auth/ResetPasswordPage.tsx';

function PublicRoute() {
  const token = localStorage.getItem(PATIENTS_REFRESH_TOKEN);
  const expired = isTokenExpired(token);

  useEffect(() => {
    if (token && expired) {
      localStorage.removeItem(PATIENTS_REFRESH_TOKEN);
    }
  }, [token, expired]);

  if (token && !expired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem(PATIENTS_ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

    if (!accessToken || !refreshToken) return;
    const { exp: accessExp } = jwtDecode<{ exp: number }>(accessToken);
    const now = Date.now() / 1000;
    const isAccessExpired = accessExp < now;

    if (isAccessExpired) {
      dispatch(refreshTokenThunk());
    }
  }, [dispatch]);

  const token = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Navigate to={appPaths.login} replace />} />
          <Route path={appPaths.login} element={<LoginPage />} />
          <Route path={appPaths.register} element={<RegisterPage />} />
          <Route path={appPaths.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={appPaths.terms} element={<Terms />} />
          <Route path={appPaths.resetPassword} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={appPaths.dashboard.root} element={<DashboardLayoutWrapper />}>
            <Route index element={<DashboardHome />} />
            <Route path={appPaths.dashboard.patients} element={<Patients />} />
            <Route path={appPaths.dashboard.patientsAdd} element={<AddPatient />} />
            <Route path={appPaths.dashboard.doctors} element={<Doctors />} />
            <Route path={appPaths.dashboard.doctorsAdd} element={<AddDoctor />} />
          </Route>
        </Route>

        <Route path={appPaths.notFound} element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
