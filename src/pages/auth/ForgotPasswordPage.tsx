import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { getForgotSchema } from '../../i18n/authSchema';
import i18n from 'i18next';
import { useAppDispatch } from '../../app/hooks';
import { recoveryThunk } from '../../features/auth/auth.thunks';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => getForgotSchema(t), [t]);
  const dispatch = useAppDispatch();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = (type: 'success' | 'error', message: string) =>
    setSnackbar({
      open: true,
      type,
      message,
    });

  return (
    <BasePageLayout title={t('auth.forgot')} subtitle={t('auth.enterYourCredentialsEmail')}>
      <Formik
        key={i18n.language}
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const action = await dispatch(recoveryThunk(values.email));

          if (recoveryThunk.fulfilled.match(action)) {
            showSnackbar('success', t('auth.recoverySuccess'));
          } else {
            showSnackbar('error', action.payload || t('auth.recoveryFailed'));
          }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="email" label={t('auth.email')} fullWidth />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {t('auth.forgot')}
              </Button>

              <Stack spacing={1} alignItems="center">
                <Link href="/login" underline="hover">
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
        <Alert severity={snackbar.type} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BasePageLayout>
  );
}
