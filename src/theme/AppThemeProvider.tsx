import {createContext, useContext, useEffect, useState} from "react";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

type Mode = "light" | "dark";

type ThemeCtx = {
    mode: Mode;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
    mode: "light",
    toggleTheme: () => {
    }
});

export const useAppTheme = () => useContext(ThemeContext);

export default function AppThemeProvider({children}: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<Mode>(() =>
        (localStorage.getItem("theme") as Mode) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light")
    );

    const theme = createTheme({
        palette: {mode},
        customBackground: {
            auth: mode === "light"
                ? "linear-gradient(135deg,#6fb1fc 0%,#4364f7 50%,#1e3c72 100%)"
                : "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
        }
    });

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const toggleTheme = () =>
        setMode(prev => prev === "light" ? "dark" : "light");

    return (
        <ThemeContext.Provider value={{mode, toggleTheme}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
