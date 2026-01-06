import { BasePageLayout } from '../../layouts/BaseAuthLayout';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { Button, Link, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AuthBackground } from '../../layouts/AuthBackground';
import { useMemo } from 'react';
import { getForgotSchema } from '../../i18n/authSchema.ts';
import i18n from 'i18next';
import { useAuth } from '../../hooks/useAuth.ts';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => getForgotSchema(t), [t]);
  const { recovery } = useAuth();

  return (
    <AuthBackground>
      <BasePageLayout
        title={t('auth.forgot')}
        subtitle={t('auth.enterYourCredentialsEmail')}
      >
        <Formik
          key={i18n.language}
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            recovery({
              email: values.email,
            });
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

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {t('auth.forgot')}
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
      </BasePageLayout>
    </AuthBackground>
  );
}
