import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useTheme } from '../../../src/presentation/hooks/useTheme';
import uiReducer from '../../../src/store/slices/uiSlice';
import propertyReducer from '../../../src/store/slices/propertySlice';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      properties: propertyReducer,
    },
    preloadedState: initialState,
  });
};

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
  it('should initialize with light theme by default', async () => {
    const store = createTestStore();
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    expect(result.current.theme).toBe('light');
    // After initial render, mounted should be true
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(result.current.mounted).toBe(true);
  });

  it('should toggle to next theme', () => {
    const store = createTestStore();
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    // Start with light theme
    expect(result.current.theme).toBe('light');

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('should apply theme classes to document when mounted', () => {
    const store = createTestStore();
    const mockClassList = {
      add: jest.fn(),
      remove: jest.fn(),
    };

    Object.defineProperty(document, 'documentElement', {
      value: { classList: mockClassList },
      writable: true,
    });

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    // Wait for component to mount
    act(() => {
      // Simulate mounting
    });

    // Should apply light theme classes initially
    expect(mockClassList.add).toHaveBeenCalledWith('theme-light');
  });

  it('should handle theme changes correctly', () => {
    const store = createTestStore({
      ui: { theme: 'dark', sidebarOpen: false, modalOpen: false, notifications: [] }
    });
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    expect(result.current.theme).toBe('dark');
  });
});
