import { useCallback, useEffect, useRef, useState } from 'react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { PATIENTS_ACCESS_TOKEN } from '../../constants.ts';
import { logoutThunk, refreshTokenThunk } from '../../features/auth/auth.thunks.ts';
import { useTranslation } from 'react-i18next';

function safeGetExp(token: string): number | null {
  try {
    const decoded = jwtDecode<Required<JwtPayload>>(token);
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

export function useSessionTimer(warnAtSeconds = 60) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const { t } = useTranslation();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastOpen(true);
  }, []);
  const closeToast = useCallback(() => setToastOpen(false), []);

  const warningShownRef = useRef(false);

  const extendCooldownMs = 30_000;
  const lastExtendAtRef = useRef<number>(0);
  const extendInFlightRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line prefer-const
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
    const now = Date.now();

    if (now - lastExtendAtRef.current < extendCooldownMs) {
      showToast(t('auth.sessionNotExtended'));
      return;
    }

    if (extendInFlightRef.current) {
      return extendInFlightRef.current;
    }

    setIsExtending(true);

    const p = (async () => {
      try {
        lastExtendAtRef.current = now;
        await dispatch(refreshTokenThunk()).unwrap();
        setIsWarningOpen(false);
        warningShownRef.current = false;
        showToast(t('auth.sessionExtended'));
      } catch {
        setIsWarningOpen(false);
        warningShownRef.current = false;
        await dispatch(logoutThunk());
        navigate('/login', { replace: true });
      } finally {
        setIsExtending(false);
        extendInFlightRef.current = null;
      }
    })();

    extendInFlightRef.current = p;
    return p;
  }, [dispatch, navigate, showToast, t]);

  const closeWarning = useCallback(() => setIsWarningOpen(false), []);

  return {
    secondsLeft,
    isWarningOpen,
    isExtending,
    extend,
    closeWarning,
    toastOpen,
    toastMessage,
    closeToast,
  };
}
