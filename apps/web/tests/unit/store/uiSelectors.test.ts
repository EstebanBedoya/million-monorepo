import {
  selectTheme,
  selectSidebarOpen,
  selectModalOpen,
  selectNotifications,
  selectThemeInfo,
  selectIsLight,
  selectIsDark,
  selectNextTheme,
  selectAllThemes,
  selectThemeInfoByName,
} from '@/store/selectors/uiSelectors';
import { RootState } from '@/store/index';

describe('uiSelectors', () => {
  const createMockState = (uiState: Partial<RootState['ui']>): RootState =>
    ({
      ui: {
        theme: 'light',
        sidebarOpen: false,
        modalOpen: false,
        notifications: [],
        ...uiState,
      },
      properties: {
        byId: {},
        allIds: [],
        filteredIds: [],
        selectedProperty: null,
        loading: false,
        error: null,
        pagination: null,
        filters: {
          search: '',
          propertyType: undefined,
          minPrice: undefined,
          maxPrice: undefined,
        },
      },
    } as RootState);

  describe('Basic selectors', () => {
    it('should select theme', () => {
      const state = createMockState({ theme: 'dark' });
      expect(selectTheme(state)).toBe('dark');
    });

    it('should select sidebarOpen', () => {
      const state = createMockState({ sidebarOpen: true });
      expect(selectSidebarOpen(state)).toBe(true);
    });

    it('should select modalOpen', () => {
      const state = createMockState({ modalOpen: true });
      expect(selectModalOpen(state)).toBe(true);
    });

    it('should select notifications', () => {
      const notifications = [
        { id: '1', message: 'Test', type: 'success' as const, timestamp: Date.now() },
      ];
      const state = createMockState({ notifications });
      expect(selectNotifications(state)).toEqual(notifications);
    });
  });

  describe('Theme-related selectors', () => {
    it('should select theme info for light theme', () => {
      const state = createMockState({ theme: 'light' });
      const themeInfo = selectThemeInfo(state);
      expect(themeInfo.name).toBe('light');
      expect(themeInfo.displayName).toBe('☀️ Light');
      expect(themeInfo.isDefault).toBe(true);
    });

    it('should select theme info for dark theme', () => {
      const state = createMockState({ theme: 'dark' });
      const themeInfo = selectThemeInfo(state);
      expect(themeInfo.name).toBe('dark');
      expect(themeInfo.displayName).toBe('🌙 Dark');
      expect(themeInfo.isDefault).toBe(false);
    });

    it('should detect light theme', () => {
      const state = createMockState({ theme: 'light' });
      expect(selectIsLight(state)).toBe(true);
      expect(selectIsDark(state)).toBe(false);
    });

    it('should detect dark theme', () => {
      const state = createMockState({ theme: 'dark' });
      expect(selectIsLight(state)).toBe(false);
      expect(selectIsDark(state)).toBe(true);
    });

    it('should select next theme from light', () => {
      const state = createMockState({ theme: 'light' });
      expect(selectNextTheme(state)).toBe('dark');
    });

    it('should select next theme from dark', () => {
      const state = createMockState({ theme: 'dark' });
      expect(selectNextTheme(state)).toBe('light');
    });
  });

  describe('Theme utilities', () => {
    it('should get all themes', () => {
      const themes = selectAllThemes();
      expect(themes).toHaveLength(2);
      expect(themes.find((t) => t.name === 'light')).toBeDefined();
      expect(themes.find((t) => t.name === 'dark')).toBeDefined();
    });

    it('should get theme info by name', () => {
      const lightTheme = selectThemeInfoByName('light');
      expect(lightTheme.name).toBe('light');
      
      const darkTheme = selectThemeInfoByName('dark');
      expect(darkTheme.name).toBe('dark');
    });
  });
});

