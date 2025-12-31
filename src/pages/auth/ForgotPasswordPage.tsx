import { BasePageLayout } from '../../layouts/BasePageLayout';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Button, Stack, Box, Link, IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ForgotSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPasswordPage() {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg,#6fb1fc 0%,#4364f7 50%,#1e3c72 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Language Dropdown */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton sx={{ color: 'white' }} onClick={(e) => setAnchorEl(e.currentTarget)}>
          <LanguageIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => {
              i18n.changeLanguage('pl');
              setAnchorEl(null);
            }}
          >
            🇵🇱 {t('auth.lang_pl')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              i18n.changeLanguage('en');
              setAnchorEl(null);
            }}
          >
            🇬🇧 {t('auth.lang_en')}
          </MenuItem>
        </Menu>
      </Box>

      <BasePageLayout title={t('auth.forgot')} subtitle={t('auth.enterYourCredentials')}>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotSchema}
          onSubmit={async (values) => console.log('FORGOT', values)}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <Field component={TextField} name="email" label={t('auth.email')} fullWidth />

                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {t('auth.forgot')}
                </Button>

                <Stack spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Link href="/login" underline="hover">
                    {t('auth.login')}
                  </Link>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </BasePageLayout>
    </Box>
  );
}
