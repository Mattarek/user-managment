import { Sidebar } from './components/Sidebar.tsx';
import { Topbar } from './components/Topbar.tsx';
import { Breadcrumbs } from '../../components/Breadcrumbs.tsx';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <>
      <Topbar />
      <Sidebar />
      <main style={{ marginLeft: 260, marginTop: 80, padding: 24 }}>
        <Breadcrumbs />
        <Outlet />
      </main>
    </>
  );
}
