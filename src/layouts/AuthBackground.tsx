import { Box } from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function AuthBackground({ children }: Readonly<Props>) {
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
      {children}
    </Box>
  );
}
