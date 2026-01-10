import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AuthBackground } from '../../layouts/AuthBackground';
import { useMemo, useState } from 'react';
import { getLoginSchema } from '../../i18n/authSchema.ts';
import i18n from 'i18next';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const validationSchema = useMemo(() => getLoginSchema(t), [t]);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const showSnackbar = (type: 'success' | 'error', message: string) => setSnackbar({ open: true, type, message });

  return (
    <AuthBackground>
      <BasePageLayout
        title={t('auth.login')}
        subtitle={t('auth.enterYourCredentials')}
      >
        <Formik
          key={i18n.language}
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await login({
                email: values.email,
                password: values.password,
              });

              if (result.ok) {
                showSnackbar('success', t('auth.loginSuccess'));
                navigate('/dashboard');
              } else {
                showSnackbar('error', result.message || t('auth.loginFailed'));
              }
            } catch (e: unknown) {
              if (e instanceof Error) {
                showSnackbar('error', e.message);
              } else {
                showSnackbar('error', t('auth.loginFailed'));
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <Field
                  component={TextField}
                  name="email"
                  label={t('auth.email')}
                  fullWidth
                />

                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  label={t('auth.password')}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {t('auth.login')}
                </Button>

                <Stack
                  spacing={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Link
                    href="/register"
                    underline="hover"
                  >
                    {t('auth.createAccount')}
                  </Link>

                  <Link
                    href="/forgot-password"
                    underline="hover"
                  >
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
          <Alert
            severity={snackbar.type}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </BasePageLayout>
    </AuthBackground>
  );
}
