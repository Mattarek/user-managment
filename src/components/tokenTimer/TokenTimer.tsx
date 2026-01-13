import { Typography } from '@mui/material';
import { useTokenCountdown } from './useTokenCountdown.ts';

export const TokenTimer = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const secondsLeft = useTokenCountdown(refreshToken);

  function formatTime(seconds: number) {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return <>{secondsLeft !== null && <Typography variant="caption">{formatTime(secondsLeft)}</Typography>}</>;
};
