import {BasePageLayout} from '../../layouts/BaseAuthLayout';
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-mui';
import {Button, Link, Stack} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {AuthBackground} from '../../layouts/AuthBackground';
import {useMemo} from "react";
import {getLoginSchema} from "../../i18n/authSchema.ts";
import i18n from "i18next";

export function LoginPage() {
    const {t} = useTranslation();
    const validationSchema = useMemo(() => getLoginSchema(t), [t]);

    return (
        <AuthBackground>
            <BasePageLayout title={t('auth.login')}
                            subtitle={t('auth.enterYourCredentials')}>
                <Formik
                    key={i18n.language}
                    initialValues={{email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        console.log('LOGIN', values);
                    }}
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

                                <Button type="submit" variant="contained"
                                        disabled={isSubmitting}>
                                    {t('auth.login')}
                                </Button>

                                <Stack spacing={1} sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Link href="/register" underline="hover">
                                        {t('auth.createAccount')}
                                    </Link>

                                    <Link href="/forgot-password"
                                          underline="hover">
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
