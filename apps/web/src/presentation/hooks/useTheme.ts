'use client';

import { useState, useEffect } from 'react';

// Theme configuration - easy to add new themes
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
  },
  mcdonalds: {
    name: 'mcdonalds',
    displayName: '🍟 McDonald\'s',
    classes: ['mcdonalds', 'theme-mcdonalds'],
    isDefault: false
  },
  cyberpunk: {
    name: 'cyberpunk',
    displayName: '🤖 Cyberpunk',
    classes: ['cyberpunk', 'theme-cyberpunk'],
    isDefault: false
  }
} as const;

type Theme = keyof typeof THEMES;

// Theme order for cycling
const THEME_ORDER: Theme[] = ['light', 'dark', 'mcdonalds', 'cyberpunk'];

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && THEMES[savedTheme]) {
      return savedTheme;
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(THEMES).forEach(themeConfig => {
      themeConfig.classes.forEach(className => {
        root.classList.remove(className);
      });
    });
    
    // Apply new theme classes
    const themeConfig = THEMES[newTheme];
    themeConfig.classes.forEach(className => {
      root.classList.add(className);
    });
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Get next theme in cycle
  const getNextTheme = (currentTheme: Theme): Theme => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    return THEME_ORDER[nextIndex];
  };

  // Toggle to next theme
  const toggleTheme = () => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme: Theme) => {
    if (!THEMES[newTheme]) return;
    setTheme(newTheme);
  };

  // Get current theme info
  const currentThemeInfo = THEMES[theme];

  // Create theme checker functions
  const isTheme = (themeName: Theme) => theme === themeName;

  return {
    // Current theme
    theme,
    themeInfo: currentThemeInfo,
    
    // Theme actions
    toggleTheme,
    setTheme: setSpecificTheme,
    
    // Theme checkers
    isLight: isTheme('light'),
    isDark: isTheme('dark'),
    isMcDonalds: isTheme('mcdonalds'),
    
    // Utility functions
    getNextTheme,
    getAllThemes: () => Object.values(THEMES),
    getThemeInfo: (themeName: Theme) => THEMES[themeName]
  };
};
