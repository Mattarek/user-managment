import { Chip, Typography } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useSessionTimer } from './useSessionTimer';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SessionStatus() {
  const secondsLeft = useSessionTimer();
  if (secondsLeft === null) return null;

  return (
    <Chip
      variant="outlined"
      size="small"
      icon={<HourglassBottomIcon />}
      label={<Typography variant="caption">{formatTime(secondsLeft)}</Typography>}
    />
  );
}
