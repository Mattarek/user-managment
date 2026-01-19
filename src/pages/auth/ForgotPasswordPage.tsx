import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { getForgotSchema } from '../../i18n/authSchema';
import i18n from 'i18next';
import { useAppDispatch } from '../../store/hooks.ts';
import { recoveryThunk } from '../../features/auth/auth.thunks';
import { Link as RouterLink } from 'react-router-dom';
import type { SnackbarState } from '../../types/types.ts';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => getForgotSchema(t), [t]);
  const dispatch = useAppDispatch();

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

  type RecoveryForm = {
    email: string;
  };

  const handleRecovery = async (
    values: RecoveryForm,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await dispatch(recoveryThunk(values.email)).unwrap();

      showSnackbar({
        type: 'success',
        message: t('auth.recoverySuccess'),
      });
    } catch (err) {
      const error = typeof err === 'string' ? err : undefined;

      showSnackbar({
        type: 'error',
        message: error || t('auth.recoveryFailed'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BasePageLayout title={t('auth.forgot')} subtitle={t('auth.enterYourCredentialsEmail')}>
      <Formik
        key={i18n.language}
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleRecovery}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="email" label={t('auth.email')} fullWidth />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {t('auth.forgot')}
              </Button>

              <Stack spacing={1} alignItems="center">
                <Link component={RouterLink} to="/login" underline="none">
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
