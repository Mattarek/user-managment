import { createContext } from 'react';
import type { Mode } from '../types/types.ts';

type ThemeCtx = {
  mode: Mode;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeCtx>({
  mode: 'light',
  toggleTheme: () => {},
});
