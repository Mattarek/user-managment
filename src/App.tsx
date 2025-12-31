import 'normalize.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layout/DasbhoardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<h1>Dashboard Home</h1>} />
          <Route path="patients" element={<h1>Patients</h1>} />
          <Route path="patients/add" element={<h1>Add patient</h1>} />

          <Route path="products" element={<h1>Products</h1>} />
          <Route path="products/add" element={<h1>Add product</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
