import { useEffect, useState } from 'react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { logoutThunk } from '../../features/auth/auth.thunks.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { PATIENT_REFRESH_TOKEN } from '../../constants.ts';
import { useNavigate } from 'react-router-dom';

export function useSessionTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem(PATIENT_REFRESH_TOKEN);
    if (!refreshToken) return;

    const { exp } = jwtDecode<Required<JwtPayload>>(refreshToken);

    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      const diff = Math.floor(exp - now);

      if (diff <= 0) {
        clearInterval(interval);
        dispatch(logoutThunk());
        navigate('/login', { replace: true });
        return;
      }

      setSecondsLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return secondsLeft;
}
