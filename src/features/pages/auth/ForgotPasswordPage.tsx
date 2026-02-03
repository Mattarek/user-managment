import { BasePageLayout } from '../../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import i18n from 'i18next';
import { useAppDispatch } from '../../../store/hooks.ts';
import { recoveryThunk } from '../../auth/auth.thunks.ts';
import { Link as RouterLink } from 'react-router-dom';
import type { SnackbarState } from '../../../types/types.ts';
import * as Yup from 'yup';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const validateSchema = () =>
    Yup.object({
      email: Yup.string().email(t('validation.emailRequired')).required(t('validation.emailRequired')),
    });

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
        validationSchema={validateSchema}
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
                  {t('auth.login_btn')}
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
