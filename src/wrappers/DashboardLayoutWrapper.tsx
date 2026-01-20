import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../layouts/DasbhoardLayout.tsx';
import type { SidebarItem } from '../layouts/Sidebar.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { useEffect } from 'react';
import { PATIENTS_REFRESH_TOKEN } from '../constants.ts';
import { getMeThunk } from '../features/auth/auth.thunks.ts';

export const DashboardLayoutWrapper = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    console.log('🔵 DashboardLayoutWrapper mounted');
    console.log('refreshToken:', refreshToken);

    if (refreshToken) {
      console.log('➡️ dispatch getMeThunk');
      dispatch(getMeThunk());
    }
  }, [dispatch, refreshToken]);
  console.log('user:', user);

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
