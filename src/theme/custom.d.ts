import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    settingsIcon: string;
  }

  interface Palette {
    settingsIcon: string;
    auth: string;
  }

  interface PaletteOptions {
    settingsIcon?: string;
    auth: string;
  }

  interface ThemeOptions {
    customBackground?: {
      auth?: string;
    };
  }
}
