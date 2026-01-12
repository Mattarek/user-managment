import 'normalize.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/auth';
import { DashboardLayout } from './layouts/DasbhoardLayout.tsx';
import { ErrorPage } from './pages';
import { appPaths } from './routes.tsx';
import { RequireAuth } from './components/RequireAuth.tsx';
import { PublicOnly } from './components/PublicOnly.tsx';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { getMeThunk } from './features/auth/auth.thunks.ts';
import { AddDoctor } from './pages/dashboard/doctors/AddDoctor.tsx';
import { AddPatient } from './pages/dashboard/patients/AddPatient.tsx';
import { Doctors } from './pages/dashboard/doctors/Doctors.tsx';
import { Patients } from './pages/dashboard/patients/Patients.tsx';
import { DashboardHome } from './pages/dashboard';
import { AppLoader } from './components/AppLoader.tsx';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  if (!initialized) {
    return <AppLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />
        <Route element={<PublicOnly />}>
          <Route
            path={appPaths.login}
            element={<LoginPage />}
          />
          <Route
            path={appPaths.register}
            element={<RegisterPage />}
          />
          <Route
            path={appPaths.forgotPassword}
            element={<ForgotPasswordPage />}
          />
        </Route>

        <Route element={<RequireAuth />}>
          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >
            <Route
              index
              element={<DashboardHome />}
            />
            <Route
              path="patients"
              element={<Patients />}
            />
            <Route
              path="patients/add"
              element={<AddPatient />}
            />
            <Route
              path="doctors"
              element={<Doctors />}
            />
            <Route
              path="doctors/add"
              element={<AddDoctor />}
            />
          </Route>
        </Route>

        <Route
          path={appPaths.notFound}
          element={<ErrorPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
