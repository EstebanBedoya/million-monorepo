import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/index';
import { Theme } from '@/store/slices/uiSlice';

// Theme configuration - same as in useTheme hook
const THEMES = {
  light: {
    name: 'light',
    displayName: '☀️ Light',
    classes: ['theme-light'],
    isDefault: true
  },
  dark: {
    name: 'dark',
    displayName: '🌙 Dark',
    classes: ['dark', 'theme-dark'],
    isDefault: false
  }
} as const;

// Basic selectors
export const selectTheme = (state: RootState): Theme => state.ui.theme;
export const selectSidebarOpen = (state: RootState): boolean => state.ui.sidebarOpen;
export const selectModalOpen = (state: RootState): boolean => state.ui.modalOpen;
export const selectNotifications = (state: RootState) => state.ui.notifications;

// Theme-related selectors
export const selectThemeInfo = createSelector(
  [selectTheme],
  (theme) => THEMES[theme]
);

export const selectIsLight = createSelector(
  [selectTheme],
  (theme) => theme === 'light'
);

export const selectIsDark = createSelector(
  [selectTheme],
  (theme) => theme === 'dark'
);

// Theme order for cycling
const THEME_ORDER: Theme[] = ['light', 'dark'];

export const selectNextTheme = createSelector(
  [selectTheme],
  (currentTheme) => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    return THEME_ORDER[nextIndex];
  }
);

export const selectAllThemes = () => Object.values(THEMES);

export const selectThemeInfoByName = (themeName: Theme) => THEMES[themeName];
