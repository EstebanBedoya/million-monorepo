import { configureStore } from '@reduxjs/toolkit';
import propertySlice, {
  fetchProperties,
  fetchAvailableProperties,
  fetchExpensiveProperties,
  fetchPropertyById,
  createProperty,
  setSelectedProperty,
  setFilter,
  clearError,
  clearProperties,
} from '../../../src/store/slices/propertySlice';
import uiSlice from '../../../src/store/slices/uiSlice';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock the Container and PropertyService
jest.mock('../../../src/infrastructure/di/Container', () => ({
  Container: {
    getInstance: () => ({
      get: jest.fn().mockReturnValue({
        getAllProperties: jest.fn(),
        getAvailableProperties: jest.fn(),
        getExpensiveProperties: jest.fn(),
        getProperty: jest.fn(),
        createProperty: jest.fn(),
      }),
    }),
  },
}));

// Mock property data
const mockProperty: Property = {
  id: '1',
  title: 'Test Property',
  description: 'Test Description',
  price: 100000,
  currency: 'USD',
  location: {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    getFullAddress: () => '123 Main St, New York, NY, USA',
  },
  propertyType: PropertyType.APARTMENT,
  bedrooms: 2,
  bathrooms: 1,
  area: 85,
  areaUnit: AreaUnit.M2,
  features: ['Parking', 'Balcony'],
  images: ['image1.jpg'],
  status: PropertyStatus.AVAILABLE,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  isAvailable: () => true,
  isExpensive: () => false,
  getFormattedPrice: () => 'USD 100,000',
} as Property;

const mockProperties = [mockProperty];

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

describe('PropertySlice Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().properties;
      
      expect(state.properties).toEqual([]);
      expect(state.selectedProperty).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.pagination).toBeNull();
      expect(state.filter).toBe('all');
    });
  });

  describe('Synchronous Actions', () => {
    it('should set selected property', () => {
      store.dispatch(setSelectedProperty(mockProperty));
      
      const state = store.getState().properties;
      expect(state.selectedProperty).toEqual(mockProperty);
    });

    it('should clear selected property', () => {
      store.dispatch(setSelectedProperty(mockProperty));
      store.dispatch(setSelectedProperty(null));
      
      const state = store.getState().properties;
      expect(state.selectedProperty).toBeNull();
    });

    it('should set filter', () => {
      store.dispatch(setFilter('available'));
      
      const state = store.getState().properties;
      expect(state.filter).toBe('available');
    });

    it('should clear error', () => {
      // First set an error
      store.dispatch({ type: 'properties/fetchProperties/rejected', error: { message: 'Test error' } });
      
      let state = store.getState().properties;
      expect(state.error).toBe('Test error');
      
      // Then clear it
      store.dispatch(clearError());
      
      state = store.getState().properties;
      expect(state.error).toBeNull();
    });

    it('should clear properties', () => {
      // First set some properties
      store.dispatch({ 
        type: 'properties/fetchProperties/fulfilled', 
        payload: { data: mockProperties, pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false } }
      });
      
      let state = store.getState().properties;
      expect(state.properties).toHaveLength(1);
      
      // Then clear them
      store.dispatch(clearProperties());
      
      state = store.getState().properties;
      expect(state.properties).toEqual([]);
      expect(state.pagination).toBeNull();
    });
  });

  describe('Async Thunks - fetchProperties', () => {
    it('should handle fetchProperties pending', () => {
      store.dispatch({ type: 'properties/fetchProperties/pending' });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProperties fulfilled', () => {
      const payload = {
        data: mockProperties,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
      
      store.dispatch({ type: 'properties/fetchProperties/fulfilled', payload });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual(mockProperties);
      expect(state.pagination).toEqual(payload.pagination);
      expect(state.error).toBeNull();
    });

    it('should handle fetchProperties rejected', () => {
      const error = { message: 'Failed to fetch properties' };
      
      store.dispatch({ type: 'properties/fetchProperties/rejected', error });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch properties');
    });
  });

  describe('Async Thunks - fetchAvailableProperties', () => {
    it('should handle fetchAvailableProperties pending', () => {
      store.dispatch({ type: 'properties/fetchAvailableProperties/pending' });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchAvailableProperties fulfilled', () => {
      store.dispatch({ type: 'properties/fetchAvailableProperties/fulfilled', payload: mockProperties });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual(mockProperties);
      expect(state.error).toBeNull();
    });

    it('should handle fetchAvailableProperties rejected', () => {
      const error = { message: 'Failed to fetch available properties' };
      
      store.dispatch({ type: 'properties/fetchAvailableProperties/rejected', error });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch available properties');
    });
  });

  describe('Async Thunks - fetchExpensiveProperties', () => {
    it('should handle fetchExpensiveProperties pending', () => {
      store.dispatch({ type: 'properties/fetchExpensiveProperties/pending' });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchExpensiveProperties fulfilled', () => {
      store.dispatch({ type: 'properties/fetchExpensiveProperties/fulfilled', payload: mockProperties });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual(mockProperties);
      expect(state.error).toBeNull();
    });

    it('should handle fetchExpensiveProperties rejected', () => {
      const error = { message: 'Failed to fetch expensive properties' };
      
      store.dispatch({ type: 'properties/fetchExpensiveProperties/rejected', error });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch expensive properties');
    });
  });

  describe('Async Thunks - fetchPropertyById', () => {
    it('should handle fetchPropertyById pending', () => {
      store.dispatch({ type: 'properties/fetchPropertyById/pending' });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropertyById fulfilled', () => {
      store.dispatch({ type: 'properties/fetchPropertyById/fulfilled', payload: mockProperty });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.selectedProperty).toEqual(mockProperty);
      expect(state.error).toBeNull();
    });

    it('should handle fetchPropertyById rejected', () => {
      const error = { message: 'Failed to fetch property' };
      
      store.dispatch({ type: 'properties/fetchPropertyById/rejected', error });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch property');
    });
  });

  describe('Async Thunks - createProperty', () => {
    it('should handle createProperty pending', () => {
      store.dispatch({ type: 'properties/createProperty/pending' });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle createProperty fulfilled', () => {
      const newProperty = { ...mockProperty, id: '2', title: 'New Property' };
      
      store.dispatch({ type: 'properties/createProperty/fulfilled', payload: newProperty });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toContain(newProperty);
      expect(state.properties[0]).toEqual(newProperty); // Should be added to beginning
      expect(state.error).toBeNull();
    });

    it('should handle createProperty rejected', () => {
      const error = { message: 'Failed to create property' };
      
      store.dispatch({ type: 'properties/createProperty/rejected', error });
      
      const state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to create property');
    });
  });

  describe('State Transitions', () => {
    it('should handle complete fetch properties flow', () => {
      // Initial state
      let state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual([]);
      
      // Pending
      store.dispatch({ type: 'properties/fetchProperties/pending' });
      state = store.getState().properties;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      
      // Fulfilled
      const payload = {
        data: mockProperties,
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
      };
      store.dispatch({ type: 'properties/fetchProperties/fulfilled', payload });
      state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual(mockProperties);
      expect(state.pagination).toEqual(payload.pagination);
      expect(state.error).toBeNull();
    });

    it('should handle error recovery', () => {
      // Set error
      store.dispatch({ type: 'properties/fetchProperties/rejected', error: { message: 'Network error' } });
      let state = store.getState().properties;
      expect(state.error).toBe('Network error');
      
      // Clear error
      store.dispatch(clearError());
      state = store.getState().properties;
      expect(state.error).toBeNull();
      
      // Successful fetch
      store.dispatch({ type: 'properties/fetchProperties/fulfilled', payload: { data: mockProperties, pagination: null } });
      state = store.getState().properties;
      expect(state.properties).toEqual(mockProperties);
      expect(state.error).toBeNull();
    });

    it('should handle multiple async operations', () => {
      // Start fetch properties
      store.dispatch({ type: 'properties/fetchProperties/pending' });
      let state = store.getState().properties;
      expect(state.loading).toBe(true);
      
      // Start fetch available properties (should not interfere)
      store.dispatch({ type: 'properties/fetchAvailableProperties/pending' });
      state = store.getState().properties;
      expect(state.loading).toBe(true);
      
      // Complete fetch properties
      store.dispatch({ type: 'properties/fetchProperties/fulfilled', payload: { data: mockProperties, pagination: null } });
      state = store.getState().properties;
      expect(state.properties).toEqual(mockProperties);
      expect(state.loading).toBe(true); // Still loading due to available properties
      
      // Complete fetch available properties
      store.dispatch({ type: 'properties/fetchAvailableProperties/fulfilled', payload: mockProperties });
      state = store.getState().properties;
      expect(state.loading).toBe(false);
      expect(state.properties).toEqual(mockProperties);
    });
  });

  describe('Filter Integration', () => {
    it('should maintain filter state during async operations', () => {
      // Set filter
      store.dispatch(setFilter('available'));
      let state = store.getState().properties;
      expect(state.filter).toBe('available');
      
      // Fetch properties
      store.dispatch({ type: 'properties/fetchProperties/pending' });
      state = store.getState().properties;
      expect(state.filter).toBe('available');
      
      store.dispatch({ type: 'properties/fetchProperties/fulfilled', payload: { data: mockProperties, pagination: null } });
      state = store.getState().properties;
      expect(state.filter).toBe('available');
    });
  });
});
