import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppTheme } from "../hooks/useAppTheme.ts";

export function ThemeSwitcher() {
  const { mode, toggleTheme } = useAppTheme();

  return <IconButton onClick={toggleTheme}>{mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>;
}
