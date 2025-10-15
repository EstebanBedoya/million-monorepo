import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../../src/presentation/hooks/useTheme';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Setup localStorage mock
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  // Setup matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  // Mock document.documentElement
  Object.defineProperty(document, 'documentElement', {
    value: {
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    },
    writable: true,
  });
});

describe('useTheme', () => {
  it('should initialize with light theme by default', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
    expect(result.current.isMcDonalds).toBe(false);
  });

  it('should initialize with saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should initialize with dark theme based on system preference', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: true });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should toggle to next theme in cycle', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    // Start with light theme
    expect(result.current.theme).toBe('light');

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');

    // Toggle to mcdonalds
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('mcdonalds');

    // Toggle to cyberpunk
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('cyberpunk');

    // Toggle back to light (cycle complete)
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('should set specific theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('cyberpunk');
    });

    expect(result.current.theme).toBe('cyberpunk');
    expect(result.current.isMcDonalds).toBe(false);
  });

  it('should not set invalid theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    const initialTheme = result.current.theme;

    act(() => {
      result.current.setTheme('invalid' as any);
    });

    expect(result.current.theme).toBe(initialTheme);
  });

  it('should save theme to localStorage when changed', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should apply theme classes to document', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const mockClassList = {
      add: jest.fn(),
      remove: jest.fn(),
    };

    Object.defineProperty(document, 'documentElement', {
      value: { classList: mockClassList },
      writable: true,
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    // Should remove all theme classes first
    expect(mockClassList.remove).toHaveBeenCalled();
    // Should add dark theme classes
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
    expect(mockClassList.add).toHaveBeenCalledWith('theme-dark');
  });

  it('should return correct theme info', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    expect(result.current.themeInfo).toEqual({
      name: 'light',
      displayName: '☀️ Light',
      classes: ['theme-light'],
      isDefault: true,
    });
  });

  it('should return all available themes', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    const allThemes = result.current.getAllThemes();
    expect(allThemes).toHaveLength(4);
    expect(allThemes.map(t => t.name)).toEqual(['light', 'dark', 'mcdonalds', 'cyberpunk']);
  });

  it('should return next theme correctly', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    expect(result.current.getNextTheme('light')).toBe('dark');
    expect(result.current.getNextTheme('dark')).toBe('mcdonalds');
    expect(result.current.getNextTheme('mcdonalds')).toBe('cyberpunk');
    expect(result.current.getNextTheme('cyberpunk')).toBe('light');
  });

  it('should return theme info for specific theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({ matches: false });

    const { result } = renderHook(() => useTheme());

    const mcdonaldsInfo = result.current.getThemeInfo('mcdonalds');
    expect(mcdonaldsInfo).toEqual({
      name: 'mcdonalds',
      displayName: '🍟 McDonald\'s',
      classes: ['mcdonalds', 'theme-mcdonalds'],
      isDefault: false,
    });
  });
});
