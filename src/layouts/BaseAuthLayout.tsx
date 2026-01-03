import {Box, Container, Paper, Typography} from '@mui/material';
import {type ReactNode} from 'react';
import {AuthBackground} from './AuthBackground';

type BasePageLayoutProps = {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    rightSide?: ReactNode;
};

export function BasePageLayout({
                                   title,
                                   subtitle,
                                   children,
                                   rightSide,
                               }: Readonly<BasePageLayoutProps>) {
    return (
        <AuthBackground>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: {xs: 2, md: 6},
                }}
            >
                <Container maxWidth="sm">
                    <Paper sx={{p: {xs: 3, md: 5}, width: '32rem'}}>
                        {title && (
                            <Typography variant="h4" fontWeight={700} mb={1}>
                                {title}
                            </Typography>
                        )}

                        {subtitle && (
                            <Typography color="text.secondary" mb={3}>
                                {subtitle}
                            </Typography>
                        )}

                        {children}
                    </Paper>
                </Container>
            </Box>

            {rightSide && <AuthBackground>{rightSide}</AuthBackground>}
        </AuthBackground>
    );
}
