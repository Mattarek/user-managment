import { DashboardLayout } from '../layouts/dashboardLayout/DasbhoardLayout.tsx';
import { useAppDispatch } from '../store/hooks.ts';
import { useEffect } from 'react';
import { PATIENTS_REFRESH_TOKEN } from '../constants.ts';
import { getMeThunk } from '../features/auth/auth.thunks.ts';

export const DashboardLayoutWrapper = () => {
  const dispatch = useAppDispatch();
  const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);

  useEffect(() => {
    if (refreshToken) {
      dispatch(getMeThunk());
    }
  }, [dispatch, refreshToken]);

  return <DashboardLayout />;
};
