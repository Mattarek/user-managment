import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { PATIENTS_ACCESS_TOKEN } from '../../constants.ts';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { logoutThunk, refreshTokenThunk } from '../../features/auth/auth.thunks.ts';

function safeGetExp(token: string): number | null {
  try {
    const decoded = jwtDecode<Required<JwtPayload>>(token);
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

/**
 * Starts a countdown based on the refresh token expiration time.
 * When the timer reaches zero, the user is logged out and redirected to login.
 */
export function useSessionTimer(warnAtSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const warningShownRef = useRef(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: number | undefined;

    const tick = () => {
      const token = localStorage.getItem(PATIENTS_ACCESS_TOKEN);
      if (!token) {
        setSecondsLeft(null);
        return;
      }

      const exp = safeGetExp(token);
      if (!exp) {
        dispatch(logoutThunk());
        navigate('/login', { replace: true });
        return;
      }

      const now = Date.now() / 1000;
      const diff = Math.floor(exp - now);

      if (diff < 1) {
        window.clearInterval(intervalId);
        warningShownRef.current = false;
        setIsWarningOpen(false);
        setSecondsLeft(0);
        dispatch(logoutThunk());
        navigate('/login', { replace: true });
        return;
      }

      setSecondsLeft(diff);

      if (diff <= warnAtSeconds && !warningShownRef.current) {
        warningShownRef.current = true;
        setIsWarningOpen(true);
      }
    };

    tick();
    intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [dispatch, navigate, warnAtSeconds]);

  const extend = useCallback(async () => {
    setIsExtending(true);
    try {
      await dispatch(refreshTokenThunk()).unwrap();
      setIsWarningOpen(false);
      warningShownRef.current = false; // pozwól pokazać warning przy następnym razie
    } catch {
      setIsWarningOpen(false);
      warningShownRef.current = false;
      await dispatch(logoutThunk());
      navigate('/login', { replace: true });
    } finally {
      setIsExtending(false);
    }
  }, [dispatch, navigate]);

  const closeWarning = useCallback(() => setIsWarningOpen(false), []);

  return { secondsLeft, isWarningOpen, isExtending, extend, closeWarning };
}
