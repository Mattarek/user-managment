import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { getLoginSchema } from '../../i18n/authSchema';
import i18n from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { getMeThunk, loginThunk } from '../../features/auth/auth.thunks';
import { AsyncButton } from '../../components/AsyncButton.tsx';

export function LoginPage() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => getLoginSchema(t), [t]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const from =
    location.state?.from?.pathname && location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/dashboard';

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const showSnackbar = (type: 'success' | 'error', message: string) =>
    setSnackbar({
      open: true,
      type,
      message,
    });

  return (
    <BasePageLayout title={t('auth.login')} subtitle={t('auth.enterYourCredentials')}>
      <Formik
        key={i18n.language}
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const action = await dispatch(
            loginThunk({
              email: values.email,
              password: values.password,
            }),
          );

          if (loginThunk.fulfilled.match(action)) {
            await dispatch(getMeThunk());

            showSnackbar('success', t('auth.loginSuccess'));
            navigate(from, { replace: true });
          } else {
            showSnackbar('error', action.payload || t('auth.loginFailed'));
          }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="email" label={t('auth.email')} fullWidth />
              <Field component={TextField} name="password" type="password" label={t('auth.password')} fullWidth />

              <AsyncButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
                {t('auth.login')}
              </AsyncButton>

              <Stack spacing={1} alignItems="center">
                <Link href="/register" underline="hover">
                  {t('auth.createAccount')}
                </Link>

                <Link href="/forgot-password" underline="hover">
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
