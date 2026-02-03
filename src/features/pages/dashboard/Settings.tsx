import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks.ts';
import { useMemo } from 'react';

type FormState = {
  email: string;
  name: string;
  login: string;
  surname: string;
};

export function Settings() {
  const { t } = useTranslation();
  const me = useAppSelector((s) => s.auth.user);

  const form: FormState = useMemo(
    () => ({
      email: me?.email ?? '',
      login: me?.login ?? '',
      name: me?.name ?? '',
      surname: me?.surname ?? '',
    }),
    [me],
  );

  const readOnlyFieldProps = {
    htmlInput: { readOnly: true },
  } as const;

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={700}>
              {t('settings.title')}
            </Typography>
          }
          subheader={t('settings.account_settings')}
          sx={{ pb: 1.5 }}
        />
        <Divider />

        <CardContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={t('auth.email', 'Email')}
                type="email"
                value={form.email}
                fullWidth
                slotProps={{
                  ...readOnlyFieldProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                autoComplete="email"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={t('auth.login', 'Login')}
                value={form.login}
                fullWidth
                slotProps={{
                  ...readOnlyFieldProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                autoComplete="username"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={t('auth.name', 'Imię')}
                value={form.name}
                fullWidth
                slotProps={{
                  ...readOnlyFieldProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                autoComplete="given-name"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={t('auth.surname')}
                value={form.surname}
                fullWidth
                slotProps={{
                  ...readOnlyFieldProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                autoComplete="family-name"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
