import 'normalize.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
} from './pages';
import { DashboardLayout } from './layouts/DasbhoardLayout.tsx';
import { appPaths } from './routes.tsx';
import { ProtectedRoute } from './auth/ProtectedRoute.tsx';
import { PublicRoute } from './auth/PublicRoute.tsx';

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
