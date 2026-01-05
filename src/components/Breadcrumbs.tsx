import {Breadcrumbs as MUIBreadcrumbs, Link, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {Link as RouterLink, useLocation} from 'react-router-dom';

export function Breadcrumbs() {
    const location = useLocation();
    const {t} = useTranslation();

    const parts = location.pathname
        .split("/")
        .filter(Boolean);

    const base = "/" + parts[0];

    return (
        <MUIBreadcrumbs sx={{mb: 2}}>
            <Link component={RouterLink} to={base}>
                {t("breadcrumbs.dashboard")}
            </Link>

            {/* reszta */}
            {parts.slice(1).map((part, index) => {
                const isLast = index === parts.slice(1).length - 1;

                const path =
                    base + "/" + parts.slice(1, index + 1).join("/");

                const label = t(`breadcrumbs.${part}`, part);

                return isLast ? (
                    <Typography key={path} color="text.primary">
                        {label}
                    </Typography>
                ) : (
                    <Link key={path} component={RouterLink} to={path}>
                        {label}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
}
