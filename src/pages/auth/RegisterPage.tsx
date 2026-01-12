import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AuthBackground } from '../../layouts/AuthBackground';
import { useMemo, useState } from 'react';
import { getRegisterSchema } from '../../i18n/authSchema.ts';
import i18n from 'i18next';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const validationSchema = useMemo(() => getRegisterSchema(t), [t]);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = (type: 'success' | 'error', message: string) => setSnackbar({ open: true, type, message });
  return (
    <AuthBackground>
      <BasePageLayout
        title={t('auth.register')}
        subtitle={t('auth.enterYourCredentials')}
      >
        <Formik
          key={i18n.language}
          initialValues={{
            email: '',
            name: '',
            surname: '',
            password: '',
            repeatedPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await register({
                email: values.email,
                name: values.name,
                surname: values.surname,
                password: values.password,
                repeatedPassword: values.repeatedPassword,
              });

              if (result.ok) {
                showSnackbar('success', t('auth.registerSuccess'));
                navigate('/login');
              } else {
                showSnackbar('error', result.message || t('auth.registerFailed'));
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
                  name="name"
                  label={t('auth.name')}
                  fullWidth
                />
                <Field
                  component={TextField}
                  name="surname"
                  label={t('auth.surname')}
                  fullWidth
                />
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

                <Field
                  component={TextField}
                  name="repeatedPassword"
                  type="password"
                  label={t('auth.repeatPassword')}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {t('auth.register')}
                </Button>

                <Stack
                  spacing={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Link
                    href="/login"
                    underline="hover"
                  >
                    {t('auth.login')}
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.type}
            variant="filled"
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </BasePageLayout>
    </AuthBackground>
  );
}
