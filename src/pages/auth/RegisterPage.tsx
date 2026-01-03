import {BasePageLayout} from '../../layouts/BaseAuthLayout';
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-mui';
import {Button, Link, Stack} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {AuthBackground} from '../../layouts/AuthBackground';
import {useMemo} from "react";
import {getRegisterSchema} from "../../i18n/authSchema.ts";
import i18n from "i18next";
import {useAuth} from "../../hooks/useAuth.ts";

export function RegisterPage() {
    const {t} = useTranslation();
    const {register} = useAuth();
    const validationSchema = useMemo(() => getRegisterSchema(t), [t]);

    return (
        <AuthBackground>

            <BasePageLayout title={t('auth.register')}
                            subtitle={t('auth.enterYourCredentials')}>
                <Formik
                    key={i18n.language}
                    initialValues={{
                        email: '',
                        name: '',
                        surname: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, {setSubmitting}) => {
                        try {
                            const data = await register({
                                email: values.email,
                                name: values.name,
                                surname: values.surname,
                                password: values.password,
                                confirmPassword: values.confirmPassword
                            });

                            console.log(data);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Stack spacing={2}>
                                <Field component={TextField}
                                       name="name"
                                       label={t('auth.name')}
                                       fullWidth
                                />
                                <Field component={TextField}
                                       name="surname"
                                       label={t('auth.surname')}
                                       fullWidth
                                />
                                <Field component={TextField}
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
