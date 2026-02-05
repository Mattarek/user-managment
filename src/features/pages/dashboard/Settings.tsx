import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { Toast } from '../../../components/Toast.tsx';
import { MIN_PASSWORD_LENGTH } from '../../../constants.ts';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import IconButton from '@mui/material/IconButton';
import { changePasswordThunk, updateProfileThunk } from '../../auth/auth.thunks.ts';

type ProfileFormState = {
  email: string;
  name: string;
  login: string;
  surname: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export function Settings() {
  const [showPass, setShowPass] = useState({
    current: false,
    next: false,
    repeat: false,
  });
  const dispatch = useAppDispatch();

  const toggleShow = (key: keyof typeof showPass) => {
    setShowPass((s) => ({ ...s, [key]: !s[key] }));
  };
  const eyeAdornment = (key: keyof typeof showPass) => (
    <InputAdornment position="end">
      <IconButton onClick={() => toggleShow(key)} edge="end" aria-label="toggle password visibility">
        {showPass[key] ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  const { t } = useTranslation();
  const me = useAppSelector((s) => s.auth.user);

  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const showToast = (message: string) => setToast({ open: true, message });
  const closeToast = () => setToast((x) => ({ ...x, open: false }));

  const profileInitialValues: ProfileFormState = useMemo(
    () => ({
      email: me?.email ?? '',
      login: me?.login ?? '',
      name: me?.name ?? '',
      surname: me?.surname ?? '',
    }),
    [me],
  );

  const profileSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string().email(t('validation.email')).required(t('validation.required')),
        login: Yup.string().min(3, t('validation.min_3')).required(t('validation.required')),
        name: Yup.string().min(2, t('validation.min_2')).required(t('validation.required')),
        surname: Yup.string().min(2, t('validation.min_2')).required(t('validation.required')),
      }),
    [t],
  );

  const passwordInitialValues: PasswordFormState = {
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  const passwordSchema = useMemo(
    () =>
      Yup.object({
        currentPassword: Yup.string().required(t('validation.required')),
        newPassword: Yup.string()
          .min(MIN_PASSWORD_LENGTH, t('validation.pass_min_10'))
          .required(t('validation.required')),
        repeatNewPassword: Yup.string()
          .oneOf([Yup.ref('newPassword')], t('auth.password_mismatch'))
          .required(t('validation.required')),
      }),
    [t],
  );

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
          <Formik
            enableReinitialize
            initialValues={profileInitialValues}
            validationSchema={profileSchema}
            onSubmit={async (values, helpers: FormikHelpers<ProfileFormState>) => {
              try {
                await dispatch(updateProfileThunk(values)).unwrap();

                showToast(t('settings.saved', 'Zapisano zmiany.'));
                helpers.resetForm({ values });
              } catch {
                showToast(t('settings.save_error', 'Nie udało się zapisać zmian.'));
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting, dirty }) => (
              <Form noValidate>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="email"
                      label={t('auth.email')}
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email ? errors.email : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="login"
                      label={t('auth.login')}
                      value={values.login}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="username"
                      error={!!touched.login && !!errors.login}
                      helperText={touched.login ? errors.login : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="name"
                      label={t('auth.name')}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="given-name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name ? errors.name : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="surname"
                      label={t('auth.surname')}
                      value={values.surname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="family-name"
                      error={!!touched.surname && !!errors.surname}
                      helperText={touched.surname ? errors.surname : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
                  <Button type="submit" variant="contained" disabled={!dirty || isSubmitting}>
                    {t('settings.save')}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mt: 2.5 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={700}>
              {t('settings.password_title')}
            </Typography>
          }
          subheader={t('settings.password_subtitle')}
          sx={{ pb: 1.5 }}
        />
        <Divider />

        <CardContent sx={{ pt: 3 }}>
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordSchema}
            onSubmit={async (values, helpers: FormikHelpers<PasswordFormState>) => {
              try {
                await dispatch(
                  changePasswordThunk({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                  }),
                ).unwrap();

                showToast(t('settings.password_changed'));
                helpers.resetForm();
              } catch {
                showToast(t('settings.password_change_error'));
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting, resetForm }) => (
              <Form noValidate>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="currentPassword"
                      label={t('auth.current_password')}
                      type={showPass.current ? 'text' : 'password'}
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="current-password"
                      error={!!touched.currentPassword && !!errors.currentPassword}
                      helperText={touched.currentPassword ? errors.currentPassword : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: eyeAdornment('current'),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="newPassword"
                      label={t('auth.new_password')}
                      type={showPass.next ? 'text' : 'password'}
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="new-password"
                      error={!!touched.newPassword && !!errors.newPassword}
                      helperText={touched.newPassword ? errors.newPassword : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: eyeAdornment('next'),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      name="repeatNewPassword"
                      label={t('auth.repeat_new_password')}
                      type={showPass.repeat ? 'text' : 'password'}
                      value={values.repeatNewPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      autoComplete="new-password"
                      error={!!touched.repeatNewPassword && !!errors.repeatNewPassword}
                      helperText={touched.repeatNewPassword ? errors.repeatNewPassword : undefined}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: eyeAdornment('repeat'),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {t('settings.change_password')}
                  </Button>

                  <Button type="button" variant="outlined" disabled={isSubmitting} onClick={() => resetForm()}>
                    {t('settings.clear_fields')}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <Toast open={toast.open} message={toast.message} onClose={closeToast} />
    </Box>
  );
}
