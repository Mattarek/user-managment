import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthBackground } from '../layouts/AuthBackground';
import { useTranslation } from 'react-i18next';

export function ErrorPage() {
  const { t } = useTranslation();

  return (
    <AuthBackground>
      <Stack
        spacing={2}
        maxWidth={600}
        sx={{
          alignItems: 'center',
          color: 'white',
          '& .MuiTypography-root': {
            color: 'inherit',
          },
        }}
      >
        <Typography variant="h2" fontWeight={800}>
          {t('error.oops')}
        </Typography>

        <Typography variant="h5">{t('error.message')}</Typography>

        <Typography variant="body1">{t('error.hint')}</Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" component={Link} to="/dashboard" sx={{ bgcolor: 'white', color: '#1e3c72' }}>
            {t('error.goToDashboard')}
          </Button>

          <Button variant="outlined" component={Link} to="/login" sx={{ borderColor: 'white', color: 'white' }}>
            {t('error.backToLogin')}
          </Button>
        </Stack>
      </Stack>
    </AuthBackground>
  );
}
