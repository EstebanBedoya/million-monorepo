'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/uiSlice';
import { selectTheme, selectNextTheme } from '@/store/selectors/uiSelectors';

// Theme configuration
const THEMES = {
  light: {
    classes: ['theme-light']
  },
  dark: {
    classes: ['dark', 'theme-dark']
  }
} as const;

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const nextTheme = useAppSelector(selectNextTheme);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(THEMES).forEach(themeConfig => {
      themeConfig.classes.forEach(className => {
        root.classList.remove(className);
      });
    });
    
    // Apply new theme classes
    const themeConfig = THEMES[theme];
    themeConfig.classes.forEach(className => {
      root.classList.add(className);
    });
  }, [theme, mounted]);

  // Toggle to next theme
  const toggleTheme = () => {
    dispatch(setTheme(nextTheme));
  };

  return {
    theme,
    toggleTheme,
    mounted
  };
};
