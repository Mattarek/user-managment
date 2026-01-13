import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext.ts';

export const useAppTheme = () => useContext(ThemeContext);
