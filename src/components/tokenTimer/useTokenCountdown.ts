import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  exp: number;
  iat?: number;
};

function getRemainingTime(token: string): number {
  const { exp } = jwtDecode<JwtPayload>(token);

  const now = Math.floor(Date.now() / 1000);
  return Math.max(exp - now, 0);
}

export function useTokenCountdown(token: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      setSecondsLeft(null);
      return;
    }

    setSecondsLeft(getRemainingTime(token));

    const interval = setInterval(() => {
      setSecondsLeft(getRemainingTime(token));
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  return secondsLeft;
}
