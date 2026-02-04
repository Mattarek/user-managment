import {createTheme} from '@mui/material/styles';

export function buildTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      auth: mode === 'dark' ? '#111111' : '#111111',
      settingsIcon: '#ffffff',
      background: {
        default: mode === 'dark' ? '#111111' : '#ffffff',

        paper: mode === 'dark' ? '#111111' : '#ffffff',
      },

      text: {
        primary: mode === 'dark' ? '#ffffff' : '#0d1b2a',
        secondary: mode === 'dark' ? '#bbbbbb' : '#555555',
      },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#1385ff',
            color: '#ffffff',
          }),
        },
      },
    },
  });
}
