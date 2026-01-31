import { Alert, Snackbar } from '@mui/material';

export function Toast({ open, message, onClose }: { open: boolean; message: string; onClose: () => void }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={(_, reason) => {
        if (reason === 'clickaway') return;
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="info" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
