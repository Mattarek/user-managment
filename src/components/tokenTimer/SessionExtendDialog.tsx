import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SessionExtendDialog({
  open,
  secondsLeft,
  onExtend,
  onClose,
  isExtending,
}: Readonly<{
  open: boolean;
  secondsLeft: number;
  onExtend: () => void;
  onClose: () => void;
  isExtending: boolean;
}>) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('auth.sessionExpiringTitle')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          {t('auth.sessionTimeLeft')}: <b>{formatTime(secondsLeft)}</b>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t('auth.sessionExtendInfo')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('auth.sessionExtendCancel')}</Button>
        <Button variant="contained" onClick={onExtend}>
          {isExtending ? t('auth.sessionExtendLoading') : t('auth.sessionExtend')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
