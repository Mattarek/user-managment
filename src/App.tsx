import 'normalize.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DasbhoardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import { RequireAuth } from './components/RequireAuth';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<h1>Dashboard Home</h1>} />
            <Route path="patients" element={<h1>Patients</h1>} />
            <Route path="patients/add" element={<h1>Add patient</h1>} />
            <Route path="products" element={<h1>Products</h1>} />
            <Route path="products/add" element={<h1>Add product</h1>} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
