import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customBackground: {
      auth: string;
    };
  }

  interface ThemeOptions {
    customBackground?: {
      auth?: string;
    };
  }
}
