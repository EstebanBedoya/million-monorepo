import { configureStore } from '@reduxjs/toolkit';
import propertySlice from '../../../src/store/slices/propertySlice';
import uiSlice from '../../../src/store/slices/uiSlice';
import {
  selectProperties,
  selectSelectedProperty,
  selectPropertiesLoading,
  selectPropertiesError,
  selectPropertiesPagination,
  selectPropertiesFilter,
  selectAvailableProperties,
  selectExpensiveProperties,
  selectPropertiesByType,
  selectPropertiesByPriceRange,
  selectPropertiesStats,
  selectFilteredProperties,
} from '../../../src/store/selectors/propertySelectors';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock property data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Available Property',
    description: 'Available property',
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
    features: ['Parking'],
    images: ['image1.jpg'],
    status: PropertyStatus.AVAILABLE,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    isAvailable: () => true,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 100,000',
  },
  {
    id: '2',
    title: 'Expensive Property',
    description: 'Expensive property',
    price: 2000000,
    currency: 'USD',
    location: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      getFullAddress: () => '456 Oak Ave, Los Angeles, CA, USA',
    },
    propertyType: PropertyType.HOUSE,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    areaUnit: AreaUnit.M2,
    features: ['Garden', 'Pool'],
    images: ['image2.jpg'],
    status: PropertyStatus.AVAILABLE,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
    isAvailable: () => true,
    isExpensive: () => true,
    getFormattedPrice: () => 'USD 2,000,000',
  },
  {
    id: '3',
    title: 'Sold Property',
    description: 'Sold property',
    price: 150000,
    currency: 'USD',
    location: {
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      getFullAddress: () => '789 Pine St, Chicago, IL, USA',
    },
    propertyType: PropertyType.COMMERCIAL,
    bedrooms: 0,
    bathrooms: 1,
    area: 100,
    areaUnit: AreaUnit.M2,
    features: ['Storage'],
    images: ['image3.jpg'],
    status: PropertyStatus.SOLD,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
    isAvailable: () => false,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 150,000',
  },
] as Property[];

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

describe('Property Selectors', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Basic Selectors', () => {
    it('should select properties', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result = selectProperties(store.getState());
      expect(result).toEqual(mockProperties);
    });

    it('should select selected property', () => {
      store.dispatch({
        type: 'properties/fetchPropertyById/fulfilled',
        payload: mockProperties[0],
      });

      const result = selectSelectedProperty(store.getState());
      expect(result).toEqual(mockProperties[0]);
    });

    it('should select loading state', () => {
      store.dispatch({ type: 'properties/fetchProperties/pending' });

      const result = selectPropertiesLoading(store.getState());
      expect(result).toBe(true);
    });

    it('should select error state', () => {
      store.dispatch({
        type: 'properties/fetchProperties/rejected',
        error: { message: 'Network error' },
      });

      const result = selectPropertiesError(store.getState());
      expect(result).toBe('Network error');
    });

    it('should select pagination', () => {
      const pagination = {
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination },
      });

      const result = selectPropertiesPagination(store.getState());
      expect(result).toEqual(pagination);
    });

    it('should select filter', () => {
      store.dispatch({ type: 'properties/setFilter', payload: 'available' });

      const result = selectPropertiesFilter(store.getState());
      expect(result).toBe('available');
    });
  });

  describe('Memoized Selectors', () => {
    beforeEach(() => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });
    });

    it('should select available properties', () => {
      const result = selectAvailableProperties(store.getState());
      
      expect(result).toHaveLength(2);
      expect(result).toContain(mockProperties[0]); // Available property
      expect(result).toContain(mockProperties[1]); // Expensive but available
      expect(result).not.toContain(mockProperties[2]); // Sold property
    });

    it('should select expensive properties', () => {
      const result = selectExpensiveProperties(store.getState());
      
      expect(result).toHaveLength(1);
      expect(result).toContain(mockProperties[1]); // Expensive property
      expect(result).not.toContain(mockProperties[0]); // Cheap property
      expect(result).not.toContain(mockProperties[2]); // Sold property
    });

    it('should select properties by type', () => {
      const result = selectPropertiesByType(store.getState(), PropertyType.APARTMENT);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockProperties[0]);
    });

    it('should select properties by price range', () => {
      const result = selectPropertiesByPriceRange(store.getState(), 50000, 200000);
      
      expect(result).toHaveLength(2);
      expect(result).toContain(mockProperties[0]); // $100,000
      expect(result).toContain(mockProperties[2]); // $150,000
      expect(result).not.toContain(mockProperties[1]); // $2,000,000
    });

    it('should select properties stats', () => {
      const result = selectPropertiesStats(store.getState());
      
      expect(result).toEqual({
        total: 3,
        available: 2,
        expensive: 1,
        averagePrice: (100000 + 2000000 + 150000) / 3,
      });
    });

    it('should select filtered properties with all filter', () => {
      store.dispatch({ type: 'properties/setFilter', payload: 'all' });
      
      const result = selectFilteredProperties(store.getState());
      expect(result).toEqual(mockProperties);
    });

    it('should select filtered properties with available filter', () => {
      store.dispatch({ type: 'properties/setFilter', payload: 'available' });
      
      const result = selectFilteredProperties(store.getState());
      expect(result).toHaveLength(2);
      expect(result).toContain(mockProperties[0]);
      expect(result).toContain(mockProperties[1]);
      expect(result).not.toContain(mockProperties[2]);
    });

    it('should select filtered properties with expensive filter', () => {
      store.dispatch({ type: 'properties/setFilter', payload: 'expensive' });
      
      const result = selectFilteredProperties(store.getState());
      expect(result).toHaveLength(1);
      expect(result).toContain(mockProperties[1]);
      expect(result).not.toContain(mockProperties[0]);
      expect(result).not.toContain(mockProperties[2]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty properties array', () => {
      const result = selectAvailableProperties(store.getState());
      expect(result).toEqual([]);
    });

    it('should handle properties stats with empty array', () => {
      const result = selectPropertiesStats(store.getState());
      expect(result).toEqual({
        total: 0,
        available: 0,
        expensive: 0,
        averagePrice: 0,
      });
    });

    it('should handle properties by type with no matches', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result = selectPropertiesByType(store.getState(), 'nonexistent');
      expect(result).toEqual([]);
    });

    it('should handle properties by price range with no matches', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result = selectPropertiesByPriceRange(store.getState(), 5000000, 10000000);
      expect(result).toEqual([]);
    });

    it('should handle invalid filter', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      // Manually set invalid filter
      const state = store.getState();
      state.properties.filter = 'invalid' as any;

      const result = selectFilteredProperties(state);
      expect(result).toEqual(mockProperties); // Should return all properties for invalid filter
    });
  });

  describe('Selector Memoization', () => {
    it('should memoize available properties selector', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result1 = selectAvailableProperties(store.getState());
      const result2 = selectAvailableProperties(store.getState());
      
      expect(result1).toBe(result2); // Same reference due to memoization
    });

    it('should recalculate when properties change', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: [mockProperties[0]], pagination: null },
      });

      const result1 = selectAvailableProperties(store.getState());
      
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result2 = selectAvailableProperties(store.getState());
      
      expect(result1).not.toBe(result2); // Different references
      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(2);
    });

    it('should memoize properties stats selector', () => {
      store.dispatch({
        type: 'properties/fetchProperties/fulfilled',
        payload: { data: mockProperties, pagination: null },
      });

      const result1 = selectPropertiesStats(store.getState());
      const result2 = selectPropertiesStats(store.getState());
      
      expect(result1).toBe(result2); // Same reference due to memoization
    });
  });
});
