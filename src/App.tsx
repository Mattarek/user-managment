import 'normalize.css';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/auth';
import { DashboardLayout } from './layouts/DasbhoardLayout.tsx';
import { ErrorPage } from './pages';
import { appPaths } from './routes.tsx';
import { RequireAuth } from './components/RequireAuth.tsx';
import { PublicOnly } from './components/PublicOnly.tsx';
import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { getMeThunk } from './features/auth/auth.thunks.ts';
import { AddDoctor, AddPatient, DashboardHome, Doctors, Patients } from './pages/dashboard';
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
            path={appPaths.dashboard.root}
            element={<DashboardLayout />}
          >
            <Route
              index
              element={<DashboardHome />}
            />
            <Route
              path={appPaths.dashboard.patients}
              element={<Patients />}
            />
            <Route
              path={appPaths.dashboard.patientsAdd}
              element={<AddPatient />}
            />
            <Route
              path={appPaths.dashboard.doctors}
              element={<Doctors />}
            />
            <Route
              path={appPaths.dashboard.doctorsAdd}
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
