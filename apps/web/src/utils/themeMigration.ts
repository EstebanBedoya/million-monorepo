/**
 * Theme migration utility to handle legacy localStorage theme storage
 * This ensures we only use Redux for theme management
 */

export const migrateLegacyTheme = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Check if there's a legacy theme stored
    const legacyTheme = localStorage.getItem('theme');
    
    if (legacyTheme && (legacyTheme === 'light' || legacyTheme === 'dark')) {
      // Remove legacy theme from localStorage
      localStorage.removeItem('theme');
      
      // Return the legacy theme so it can be set in Redux
      return legacyTheme;
    }
  } catch (error) {
    console.warn('Failed to migrate legacy theme:', error);
  }

  return null;
};

export const clearLegacyTheme = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Remove any legacy theme storage
    localStorage.removeItem('theme');
  } catch (error) {
    console.warn('Failed to clear legacy theme:', error);
  }
};
