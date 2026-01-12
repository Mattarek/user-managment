import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

export function buildTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: palette[mode].primary,
      },
    },

    customBackground: {
      auth: palette[mode].authGradient,
    },
  });
}
