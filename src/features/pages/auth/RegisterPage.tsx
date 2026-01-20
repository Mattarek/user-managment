import { BasePageLayout } from '../../../layouts/BaseAuthLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import { Alert, Button, FormHelperText, Link, Snackbar, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import i18n from 'i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks.ts';
import { registerThunk } from '../../auth/auth.thunks.ts';
import { type SnackbarState } from '../../../types/types.ts';
import * as Yup from 'yup';

type RegisterForm = {
  email: string;
  name: string;
  surname: string;
  password: string;
  repeatedPassword: string;
};

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validationSchema = () =>
    Yup.object({
      email: Yup.string().email(t('validation.emailRequired')).required(t('validation.required')),
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

  const handleRegister = async (
    values: RegisterForm,
    {
      setSubmitting,
      setFieldError,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setFieldError: (field: string, message: string) => void;
    },
  ) => {
    try {
      await dispatch(
        registerThunk({
          email: values.email,
          name: values.name,
          surname: values.surname,
          password: values.password,
          repeatedPassword: values.repeatedPassword,
        }),
      ).unwrap();

      showSnackbar({
        type: 'success',
        message: t('auth.registerSuccess'),
      });

      navigate('/login');
    } catch (err) {
      const error = typeof err === 'string' ? err : undefined;

      if (error === 'EMAIL_ALREADY_EXISTS') {
        setFieldError('email', t('validation.emailAlreadyExists'));
      } else {
        showSnackbar({
          type: 'error',
          message: error || t('auth.registerFailed'),
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BasePageLayout title={t('auth.register')} subtitle={t('auth.enterYourCredentials')}>
      <Formik
        key={i18n.language}
        initialValues={{
          email: '',
          name: '',
          surname: '',
          password: '',
          repeatedPassword: '',
          terms: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Field component={TextField} name="name" label={t('auth.name')} fullWidth />
              <Field component={TextField} name="surname" label={t('auth.surname')} fullWidth />
              <Field component={TextField} name="email" label={t('auth.email')} fullWidth />
              <Field component={TextField} name="password" type="password" label={t('auth.password')} fullWidth />
              <Field
                component={TextField}
                name="repeatedPassword"
                type="password"
                label={t('auth.repeatPassword')}
                fullWidth
              />
              <Field
                component={CheckboxWithLabel}
                name="terms"
                Label={{
                  label: (
                    <>
                      {t('auth.IAgreeToThe')}{' '}
                      <Link component={RouterLink} to="/terms" target="_blank" color="primary">
                        {t('auth.terms')}
                      </Link>{' '}
                      {t('auth.ofUse')}
                    </>
                  ),
                }}
              />
              <ErrorMessage name="terms">{(msg) => <FormHelperText error>{msg}</FormHelperText>}</ErrorMessage>

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {t('auth.register')}
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
