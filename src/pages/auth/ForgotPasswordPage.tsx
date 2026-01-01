import {BasePageLayout} from '../../layouts/BaseAuthLayout';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {TextField} from 'formik-mui';
import {Button, Link, Stack} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {AuthBackground} from '../../layouts/AuthBackground';

const ForgotSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPasswordPage() {
    const {t} = useTranslation();

    return (
        <AuthBackground>
            <BasePageLayout title={t('auth.forgot')}
                            subtitle={t('auth.enterYourCredentialsEmail')}>
                <Formik
                    initialValues={{email: ''}}
                    validationSchema={ForgotSchema}
                    onSubmit={async (values) => console.log('FORGOT', values)}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Stack spacing={2}>
                                <Field component={TextField} name="email"
                                       label={t('auth.email')} fullWidth/>

                                <Button type="submit" variant="contained"
                                        disabled={isSubmitting}>
                                    {t('auth.forgot')}
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
