export const themes = {
  light: {
    name: 'light',
    className: 'theme-light',
  },
  dark: {
    name: 'dark',
    className: 'theme-dark',
  },
  corporate: {
    name: 'corporate',
    className: 'theme-corporate',
  },
} as const;

export type ThemeName = keyof typeof themes;
