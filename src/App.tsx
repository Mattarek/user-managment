import 'normalize.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/auth';
import { DashboardLayout } from './layouts/DasbhoardLayout.tsx';
import { ErrorPage } from './pages';
import { appPaths } from './routes.tsx';
import { RequireAuth } from './components/RequireAuth.tsx';
import { PublicOnly } from './components/PublicOnly.tsx';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks.ts';
import { getMeThunk } from './features/auth/auth.thunks.ts';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} />
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
              element={<h1>Dashboard Home</h1>}
            />

            <Route
              path={appPaths.dashboard.patients}
              element={<h1>Patients</h1>}
            />

            <Route
              path={appPaths.dashboard.patientsAdd}
              element={<h1>Add patient</h1>}
            />

            <Route
              path={appPaths.dashboard.doctors}
              element={<h1>Doctors</h1>}
            />

            <Route
              path={appPaths.dashboard.doctorsAdd}
              element={<h1>Add doctor</h1>}
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
