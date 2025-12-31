import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Outlet } from 'react-router-dom';
import type { SidebarItem } from '../types/types';
import { useTranslation } from 'react-i18next';
import { AsyncButton } from '../components/AsyncButton';

export function DashboardLayout() {
  const { t } = useTranslation();

  const sidebarItems: SidebarItem[] = [
    { type: 'link', label: t('sidebar.home'), path: '/dashboard' },
    {
      type: 'dropdown',
      label: t('sidebar.patients'),
      children: [
        { label: t('sidebar.patients_list'), path: '/dashboard/patients' },
        { label: t('sidebar.patients_add'), path: '/dashboard/patients/add' },
      ],
    },
    {
      type: 'dropdown',
      label: t('sidebar.doctors'),
      children: [
        { label: t('sidebar.doctors_list'), path: '/dashboard/doctors' },
        { label: t('sidebar.doctors_add'), path: '/dashboard/doctors/add' },
      ],
    },
  ];

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
