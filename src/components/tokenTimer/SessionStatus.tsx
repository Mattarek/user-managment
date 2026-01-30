import { Chip, Typography } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useSessionTimer } from './useSessionTimer';
import { useAppTheme } from '../../theme/useAppTheme.ts';
import { SessionExtendDialog } from './SessionExtendDialog.tsx';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SessionStatus() {
  const { mode } = useAppTheme();
  const { secondsLeft, isWarningOpen, isExtending, extend, closeWarning } = useSessionTimer(60);

  if (secondsLeft === null) return null;

  const iconColor = mode === 'light' ? 'inherit' : 'primary';

  return (
    <>
      <Chip
        variant="outlined"
        size="small"
        sx={{ color: iconColor, backgroundColor: 'transparent' }}
        icon={<HourglassBottomIcon color={iconColor} />}
        label={<Typography variant="caption">{formatTime(secondsLeft)}</Typography>}
      />

      <SessionExtendDialog
        open={isWarningOpen}
        secondsLeft={secondsLeft}
        onExtend={extend}
        onClose={closeWarning}
        isExtending={isExtending}
      />
    </>
  );
}
