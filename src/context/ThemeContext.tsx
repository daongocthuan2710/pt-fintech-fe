'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { themes, ThemeName } from '@/config/theme';

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName;
    const preferred = saved || 'light';
    setThemeState(preferred);
    document.documentElement.className = themes[preferred].className;
  }, []);

  const setTheme = (theme: ThemeName) => {
    setThemeState(theme);
    document.documentElement.className = themes[theme].className;
    localStorage.setItem('theme', theme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
