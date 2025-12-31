import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Button, Stack, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { emailSchema, passwordSchema } from '../../auth/authSchemas';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { AuthBackground } from '../../layouts/AuthBackground';

const LoginSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <AuthBackground>
      <LanguageSwitcher />
      <BasePageLayout title={t('auth.login')} subtitle={t('auth.enterYourCredentials')}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            console.log('LOGIN', values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <Field component={TextField} name="email" label={t('auth.email')} fullWidth />

                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  label={t('auth.password')}
                  fullWidth
                />

                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {t('auth.login')}
                </Button>

                <Stack spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
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
      </BasePageLayout>
    </AuthBackground>
  );
}
