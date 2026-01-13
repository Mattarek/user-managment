import { Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher.tsx';
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx';

type Props = {
  children: ReactNode;
};

export function AuthBackground({ children }: Readonly<Props>) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: theme.customBackground.auth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Box>
      {children}
    </Box>
  );
}
