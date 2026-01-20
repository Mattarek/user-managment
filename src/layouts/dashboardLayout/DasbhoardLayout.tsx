import { Sidebar, type SidebarItem } from './components/Sidebar.tsx';
import { Topbar } from './components/Topbar.tsx';
import { Breadcrumbs } from '../../components/Breadcrumbs.tsx';
import { Outlet } from 'react-router-dom';

interface Props {
  sidebarItems: SidebarItem[];
}

export function DashboardLayout({ sidebarItems }: Readonly<Props>) {
  return (
    <>
      <Topbar />
      <Sidebar items={sidebarItems} />
      <main style={{ marginLeft: 260, marginTop: 80, padding: 24 }}>
        <Breadcrumbs />
        <Outlet />
      </main>
    </>
  );
}
