import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../layouts/dashboardLayout/DasbhoardLayout.tsx';
import type { SidebarItem } from '../layouts/dashboardLayout/components/Sidebar.tsx';
import { useAppDispatch } from '../store/hooks.ts';
import { useEffect } from 'react';
import { PATIENTS_REFRESH_TOKEN } from '../constants.ts';
import { getMeThunk } from '../features/auth/auth.thunks.ts';

export const DashboardLayoutWrapper = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

  useEffect(() => {
    if (refreshToken) {
      dispatch(getMeThunk());
    }
  }, [dispatch, refreshToken]);

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
