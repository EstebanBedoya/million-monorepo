import { migrateLegacyTheme, clearLegacyTheme } from '@/utils/themeMigration';

describe('themeMigration', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  describe('migrateLegacyTheme', () => {
    it('should return null if no legacy theme exists', () => {
      const result = migrateLegacyTheme();
      expect(result).toBeNull();
    });

    it('should return and remove legacy light theme', () => {
      localStorageMock.setItem('theme', 'light');
      const result = migrateLegacyTheme();
      expect(result).toBe('light');
      expect(localStorageMock.getItem('theme')).toBeNull();
    });

    it('should return and remove legacy dark theme', () => {
      localStorageMock.setItem('theme', 'dark');
      const result = migrateLegacyTheme();
      expect(result).toBe('dark');
      expect(localStorageMock.getItem('theme')).toBeNull();
    });

    it('should return null for invalid theme value', () => {
      localStorageMock.setItem('theme', 'invalid');
      const result = migrateLegacyTheme();
      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage error');
          },
        },
        writable: true,
      });

      const result = migrateLegacyTheme();
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearLegacyTheme', () => {
    it('should remove legacy theme from localStorage', () => {
      localStorageMock.setItem('theme', 'light');
      clearLegacyTheme();
      expect(localStorageMock.getItem('theme')).toBeNull();
    });

    it('should work even if no theme is stored', () => {
      expect(() => clearLegacyTheme()).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: () => {
            throw new Error('localStorage error');
          },
        },
        writable: true,
      });

      expect(() => clearLegacyTheme()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });
  });
});

