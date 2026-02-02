import { BasePageLayout } from '../../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import i18n from 'i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks.ts';
import { loginThunk } from '../../auth/auth.thunks.ts';
import { AsyncButton } from '../../../components/AsyncButton.tsx';
import type { SnackbarState } from '../../../types/types.ts';
import * as Yup from 'yup';
import { MIN_PASSWORD_LENGTH } from '../../../constants.ts';
import { PasswordAdornment } from '../../../components/PasswordAdornment.tsx';
import { toggle } from '../../../utils/toggleState.ts';

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = () =>
    Yup.object({
      email: Yup.string().email(t('validation.emailRequired')).required(t('validation.emailRequired')),

      password: Yup.string()
        .required(t('validation.passwordRequired'))
        .min(MIN_PASSWORD_LENGTH, t('validation.passwordMin', { min: MIN_PASSWORD_LENGTH })),
    });

  const location = useLocation();

  const from =
    location.state?.from?.pathname && location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/dashboard';

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = (payload: Omit<SnackbarState, 'open'>) =>
    setSnackbar({
      open: true,
      ...payload,
    });

  const handleLogin = async (
    values: LoginForm,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      const action = await dispatch(
        loginThunk({
          email: values.email,
          password: values.password,
        }),
      );

      if (loginThunk.fulfilled.match(action)) {
        showSnackbar({
          type: 'success',
          message: t('auth.loginSuccess'),
        });

        navigate(from, { replace: true });
      } else {
        showSnackbar({
          type: 'error',
          message: action.payload || t('auth.loginFailed'),
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BasePageLayout title={t('auth.login')} subtitle={t('auth.enterYourCredentials')}>
      <Formik
        key={i18n.language}
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="email" label={t('auth.email')} fullWidth />
              <Field
                component={TextField}
                name="password"
                type={showPassword ? 'text' : 'password'}
                label={t('auth.password')}
                InputProps={{
                  endAdornment: <PasswordAdornment visible={showPassword} onToggle={() => toggle(setShowPassword)} />,
                }}
                fullWidth
              />

              <AsyncButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
                {t('auth.login')}
              </AsyncButton>

              <Stack spacing={1} alignItems="center">
                <Link component={RouterLink} to="/register" underline="none">
                  {t('auth.createAccount')}
                </Link>
                <Link component={RouterLink} to="/forgot-password" underline="none">
                  {t('auth.forgotPassword')}
                </Link>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.type} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BasePageLayout>
  );
}
