import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { PATIENTS_REFRESH_TOKEN } from '../../constants.ts';
import { logoutThunk } from '../../features/auth/auth.thunks.ts';

/**
 * Starts a countdown based on the refresh token expiration time.
 * When the timer reaches zero, the user is logged out and redirected to login.
 */
export function useSessionTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem(PATIENTS_REFRESH_TOKEN);
    if (!refreshToken) return;

    const { exp } = jwtDecode<Required<JwtPayload>>(refreshToken);

    const startSessionCountdown = () => {
      const interval = setInterval(() => {
        const now = Date.now() / 1000;
        const diff = Math.floor(exp - now);

        if (diff < 1) {
          clearInterval(interval);
          dispatch(logoutThunk());
          navigate('/login', { replace: true });
          return;
        }

        setSecondsLeft(diff);
      }, 1000);

      return interval;
    };

    const interval = startSessionCountdown();

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return secondsLeft;
}
