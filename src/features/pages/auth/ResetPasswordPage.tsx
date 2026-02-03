import { BasePageLayout } from '../../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { MIN_PASSWORD_LENGTH } from '../../../constants.ts';
import type { SnackbarState } from '../../../types/types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks.ts';
import { resetPasswordThunk } from '../../auth/auth.thunks.ts';

type ResetForm = {
  password: string;
  repeatedPassword: string;
};

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    type: 'success',
    message: '',
  });

  const showSnackbar = (payload: Readonly<Omit<SnackbarState, 'open'>>) => setSnackbar({ open: true, ...payload });

  const validationSchema = useMemo(
    () =>
      Yup.object({
        password: Yup.string()
          .required(t('validation.passwordRequired'))
          .min(MIN_PASSWORD_LENGTH, t('validation.passwordMin', { min: MIN_PASSWORD_LENGTH })),
        repeatedPassword: Yup.string()
          .required(t('validation.passwordRepeatRequired'))
          .oneOf([Yup.ref('password')], t('validation.passwordNotMatch')),
      }),
    [t],
  );

  const handleSubmit = async (values: ResetForm, { setSubmitting }: { setSubmitting: (v: boolean) => void }) => {
    try {
      if (!token) {
        showSnackbar({ type: 'error', message: t('auth.resetTokenMissing') });
        return;
      }

      await dispatch(
        resetPasswordThunk({
          token,
          password: values.password,
        }),
      ).unwrap();

      showSnackbar({ type: 'success', message: t('auth.resetSuccess') });

      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      const error = typeof err === 'string' ? err : undefined;

      showSnackbar({
        type: 'error',
        message: error || t('auth.resetFailed'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BasePageLayout title={t('auth.resetPassword')} subtitle={t('auth.enterNewPassword')}>
      <Formik
        initialValues={{ password: '', repeatedPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="password" type="password" label={t('auth.newPassword')} fullWidth />

              <Field
                component={TextField}
                name="repeatedPassword"
                type="password"
                label={t('auth.repeatPassword')}
                fullWidth
              />

              <Button type="submit" variant="contained" disabled={isSubmitting || !token}>
                {t('auth.resetPassword')}
              </Button>
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
