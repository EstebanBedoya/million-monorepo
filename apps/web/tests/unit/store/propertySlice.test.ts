import propertyReducer, {
  setFilter,
  setSearchFilters,
  clearSearchFilters,
  setSelectedProperty,
  clearError,
} from '@/store/slices/propertySlice';

describe('propertySlice', () => {
  const initialState = {
    byId: {},
    allIds: [],
    filteredIds: [],
    selectedProperty: null,
    loading: false,
    error: null,
    pagination: null,
    filter: 'all' as const,
    searchFilters: {
      search: '',
      minPrice: 0,
      maxPrice: 1000000000,
      propertyType: '',
    },
    cache: {
      timestamp: 0,
      ttl: 5 * 60 * 1000,
      filters: {},
      needsRefresh: true,
    },
  };

  it('should return initial state', () => {
    expect(propertyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setFilter', () => {
    it('should set filter to available', () => {
      const state = propertyReducer(initialState, setFilter('available'));
      expect(state.filter).toBe('available');
    });

    it('should set filter to expensive', () => {
      const state = propertyReducer(initialState, setFilter('expensive'));
      expect(state.filter).toBe('expensive');
    });

    it('should set filter to all', () => {
      const currentState = { ...initialState, filter: 'available' as const };
      const state = propertyReducer(currentState, setFilter('all'));
      expect(state.filter).toBe('all');
    });
  });

  describe('setSearchFilters', () => {
    it('should set search filter', () => {
      const state = propertyReducer(
        initialState,
        setSearchFilters({ search: 'test property' })
      );
      expect(state.searchFilters.search).toBe('test property');
    });

    it('should set price range filters', () => {
      const state = propertyReducer(
        initialState,
        setSearchFilters({ minPrice: 100000, maxPrice: 500000 })
      );
      expect(state.searchFilters.minPrice).toBe(100000);
      expect(state.searchFilters.maxPrice).toBe(500000);
    });

    it('should set property type filter', () => {
      const state = propertyReducer(
        initialState,
        setSearchFilters({ propertyType: 'house' })
      );
      expect(state.searchFilters.propertyType).toBe('house');
    });

    it('should merge filters', () => {
      let state = propertyReducer(
        initialState,
        setSearchFilters({ search: 'test' })
      );
      state = propertyReducer(state, setSearchFilters({ minPrice: 100000 }));
      expect(state.searchFilters.search).toBe('test');
      expect(state.searchFilters.minPrice).toBe(100000);
    });
  });

  describe('clearSearchFilters', () => {
    it('should reset search filters to initial state', () => {
      const currentState = {
        ...initialState,
        searchFilters: {
          search: 'test',
          minPrice: 100000,
          maxPrice: 500000,
          propertyType: 'house',
        },
      };
      const state = propertyReducer(currentState, clearSearchFilters());
      expect(state.searchFilters).toEqual(initialState.searchFilters);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const currentState = { ...initialState, error: 'Test error' };
      const state = propertyReducer(currentState, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('setSelectedProperty', () => {
    it('should clear selected property when null', () => {
      const currentState = {
        ...initialState,
        selectedProperty: {
          id: '1',
          name: 'Test',
          description: '',
          price: 100,
          currency: 'USD',
          location: '',
          propertyType: 'house' as const,
          area: 100,
          areaUnit: 'm2' as const,
          features: [],
          images: [],
          status: 'available' as const,
          createdAt: '',
          updatedAt: '',
        },
      };
      const state = propertyReducer(currentState, setSelectedProperty(null));
      expect(state.selectedProperty).toBeNull();
    });
  });
});

