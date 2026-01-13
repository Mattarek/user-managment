import { Button, Stack, Typography } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useSessionTimer } from './useSessionTimer';
import { refreshSession } from './session.service';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SessionStatusButton() {
  const secondsLeft = useSessionTimer();
  if (secondsLeft === null) return null;

  return (
    <Button
      size="small"
      variant="outlined"
      color="inherit"
      startIcon={<HourglassBottomIcon />}
      onClick={refreshSession}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="caption">{formatTime(secondsLeft)}</Typography>
      </Stack>
    </Button>
  );
}
