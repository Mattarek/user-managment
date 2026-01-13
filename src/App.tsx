import 'normalize.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/auth';
import { DashboardLayout } from './layouts/DasbhoardLayout.tsx';
import { ErrorPage } from './pages';
import { appPaths } from './routes.tsx';
import { ProtectedRoute } from './auth/ProtectedRoute.tsx';
import { PublicRoute } from './auth/PublicRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { AddDoctor, AddPatient, DashboardHome, Doctors, Patients } from './pages/dashboard';

function App() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={appPaths.dashboard.root} replace />
            ) : (
              <Navigate to={appPaths.login} replace />
            )
          }
        />
        <Route element={<PublicRoute />}>
          <Route path={appPaths.login} element={<LoginPage />} />
          <Route path={appPaths.register} element={<RegisterPage />} />
          <Route path={appPaths.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={appPaths.dashboard.root} element={<DashboardLayout />}>
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
