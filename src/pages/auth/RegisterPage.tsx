import {BasePageLayout} from '../../layouts/BaseAuthLayout';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {TextField} from 'formik-mui';
import {Button, Link, Stack} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {emailSchema, passwordSchema} from '../../auth/authSchemas';
import {AuthBackground} from '../../layouts/AuthBackground';

const registerSchema = Yup.object({
    email: emailSchema,
    password: passwordSchema,
});

export default function RegisterPage() {
    const {t} = useTranslation();

    return (
        <AuthBackground>

            <BasePageLayout title={t('auth.register')}
                            subtitle={t('auth.enterYourCredentials')}>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={registerSchema}
                    onSubmit={async (values) => console.log('REGISTER', values)}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Stack spacing={2}>
                                <Field component={TextField} name="email"
                                       label={t('auth.email')} fullWidth/>

                                <Field
                                    component={TextField}
                                    name="password"
                                    type="password"
                                    label={t('auth.password')}
                                    fullWidth
                                />

                                <Field
                                    component={TextField}
                                    name="confirmPassword"
                                    type="password"
                                    label={t('auth.password')}
                                    fullWidth
                                />

                                <Button type="submit" variant="contained"
                                        disabled={isSubmitting}>
                                    {t('auth.register')}
                                </Button>

                                <Stack spacing={1} sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Link href="/login" underline="hover">
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
