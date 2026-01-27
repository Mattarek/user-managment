import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { PATIENTS_ACCESS_TOKEN } from '../../constants.ts';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
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
    const accessToken = localStorage.getItem(PATIENTS_ACCESS_TOKEN);
    console.log('accessToken: ' + accessToken);
    if (!accessToken) return;

    const decoded = jwtDecode<Required<JwtPayload>>(accessToken);

    const startSessionCountdown = () => {
      const interval = setInterval(() => {
        const now = Date.now() / 1000;
        const diff = Math.floor(decoded.exp - now);

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
