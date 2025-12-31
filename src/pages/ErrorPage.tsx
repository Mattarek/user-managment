import { Box, Button, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg,#6fb1fc 0%,#4364f7 50%,#1e3c72 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Stack spacing={2} maxWidth={500}>
        <Typography variant="h2" fontWeight={800}>
          Oops!
        </Typography>

        <Typography variant="h5">Something went wrong or this page does not exist.</Typography>

        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Please try refreshing the page or return to the dashboard.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            component={Link}
            to="/dashboard"
            sx={{ bgcolor: 'white', color: '#1e3c72' }}
          >
            Go to Dashboard
          </Button>

          <Button
            variant="outlined"
            component={Link}
            to="/login"
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Back to Login
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
