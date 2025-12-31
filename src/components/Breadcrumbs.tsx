import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router-dom';

export function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const { t } = useTranslation();

  return (
    <MUIBreadcrumbs sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/dashboard">
        {t('dashboard')}
      </Link>

      {parts.map((part, idx) => {
        const path = '/' + parts.slice(0, idx + 1).join('/');

        const isLast = idx === parts.length - 1;

        return isLast ? (
          <Typography key={path}>{part}</Typography>
        ) : (
          <Link key={path} component={RouterLink} to={path}>
            {part}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
}
