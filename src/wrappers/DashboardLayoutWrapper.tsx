import { useTranslation } from 'react-i18next';
import type { SidebarItem } from '../components/Sidebar.tsx';
import { DashboardLayout } from '../layouts/DasbhoardLayout.tsx';

export const DashboardLayoutWrapper = () => {
  const { t } = useTranslation();

  const sidebarItems: SidebarItem[] = [
    { type: 'link', label: t('sidebar.home'), path: '/dashboard' },
    {
      type: 'dropdown',
      label: t('sidebar.patients'),
      children: [
        {
          label: t('sidebar.patients_list'),
          path: '/dashboard/patients',
        },
        {
          label: t('sidebar.patients_add'),
          path: '/dashboard/patients/add',
        },
      ],
    },
    {
      type: 'dropdown',
      label: t('sidebar.doctors'),
      children: [
        { label: t('sidebar.doctors_list'), path: '/dashboard/doctors' },
        {
          label: t('sidebar.doctors_add'),
          path: '/dashboard/doctors/add',
        },
      ],
    },
  ];
  return <DashboardLayout sidebarItems={sidebarItems} />;
};
