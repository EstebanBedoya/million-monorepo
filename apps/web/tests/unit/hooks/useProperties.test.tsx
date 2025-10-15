import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useProperties } from '../../../src/presentation/hooks/useProperties';
import propertySlice from '../../../src/store/slices/propertySlice';
import uiSlice from '../../../src/store/slices/uiSlice';

// Mock the property service
jest.mock('../../../src/infrastructure/di/Container', () => ({
  Container: {
    getInstance: () => ({
      get: jest.fn().mockReturnValue({
        getAllProperties: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: 'Test Property',
              description: 'Test Description',
              price: 100000,
              currency: 'USD',
              status: 'available',
              isAvailable: () => true,
              isExpensive: () => false,
              getFormattedPrice: () => 'USD 100,000',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }),
        getAvailableProperties: jest.fn().mockResolvedValue([]),
        getExpensiveProperties: jest.fn().mockResolvedValue([]),
      }),
    }),
  },
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      properties: propertySlice,
      ui: uiSlice,
    },
    preloadedState: {
      properties: {
        properties: [],
        selectedProperty: null,
        loading: false,
        error: null,
        pagination: null,
        filter: 'all',
        ...initialState.properties,
      },
      ui: {
        theme: 'light',
        sidebarOpen: false,
        ...initialState.ui,
      },
    },
  });
};

// Test wrapper component
const TestWrapper = ({ children, store }: { children: React.ReactNode; store: any }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useProperties', () => {
  it('should return properties, loading, and error states', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    expect(result.current.properties).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.loadProperties).toBe('function');
    expect(typeof result.current.loadAvailableProperties).toBe('function');
    expect(typeof result.current.loadExpensiveProperties).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should dispatch fetchProperties on mount', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    // Should dispatch fetchProperties on mount
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/fetchProperties/pending',
      })
    );
  });

  it('should handle loading state correctly', () => {
    const store = createTestStore({
      properties: {
        loading: true,
        properties: [],
        selectedProperty: null,
        error: null,
        pagination: null,
        filter: 'all',
      },
    });

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    expect(result.current.loading).toBe(true);
  });

  it('should handle error state correctly', () => {
    const store = createTestStore({
      properties: {
        loading: false,
        properties: [],
        selectedProperty: null,
        error: 'Failed to fetch properties',
        pagination: null,
        filter: 'all',
      },
    });

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    expect(result.current.error).toBe('Failed to fetch properties');
  });

  it('should handle properties data correctly', () => {
    const mockProperties = [
      {
        id: '1',
        title: 'Test Property 1',
        description: 'Test Description 1',
        price: 100000,
        currency: 'USD',
        status: 'available',
        isAvailable: () => true,
        isExpensive: () => false,
        getFormattedPrice: () => 'USD 100,000',
      },
      {
        id: '2',
        title: 'Test Property 2',
        description: 'Test Description 2',
        price: 200000,
        currency: 'USD',
        status: 'sold',
        isAvailable: () => false,
        isExpensive: () => false,
        getFormattedPrice: () => 'USD 200,000',
      },
    ];

    const store = createTestStore({
      properties: {
        loading: false,
        properties: mockProperties,
        selectedProperty: null,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        filter: 'all',
      },
    });

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    expect(result.current.properties).toEqual(mockProperties);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should call loadProperties function', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    result.current.loadProperties();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/fetchProperties/pending',
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/setFilter',
        payload: 'all',
      })
    );
  });

  it('should call loadAvailableProperties function', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    result.current.loadAvailableProperties();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/fetchAvailableProperties/pending',
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/setFilter',
        payload: 'available',
      })
    );
  });

  it('should call loadExpensiveProperties function', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    result.current.loadExpensiveProperties();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/fetchExpensiveProperties/pending',
      })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/setFilter',
        payload: 'expensive',
      })
    );
  });

  it('should call refetch function (same as loadProperties)', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useProperties(), {
      wrapper: ({ children }) => <TestWrapper store={store} children={children} />,
    });

    result.current.refetch();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'properties/fetchProperties/pending',
      })
    );
  });
});
