import {
  selectAllProperties,
  selectFilteredProperties,
  selectIsLoading,
  selectError,
  selectCurrentPage,
  selectTotalPages,
} from '@/store/selectors/propertySelectors';
import { RootState } from '@/store/index';
import { SerializableProperty } from '@/store/slices/propertySlice';

describe('propertySelectors', () => {
  const mockProperty: SerializableProperty = {
    id: '1',
    name: 'Test Property',
    description: 'Test description',
    price: 100000,
    currency: 'USD',
    location: 'Test Location',
    propertyType: 'house',
    area: 100,
    areaUnit: 'm2',
    features: [],
    images: [],
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const createMockState = (propertyState: any): RootState =>
    ({
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
        ...propertyState,
      },
      ui: {} as any,
    } as RootState);

  describe('selectAllProperties', () => {
    it('should return empty array when no properties', () => {
      const state = createMockState({});
      const result = selectAllProperties(state);
      expect(result).toEqual([]);
    });

    it('should return all properties', () => {
      const state = createMockState({
        byId: { '1': mockProperty },
        allIds: ['1'],
      });
      const result = selectAllProperties(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('selectFilteredProperties', () => {
    it('should return empty array when no filtered properties', () => {
      const state = createMockState({});
      const result = selectFilteredProperties(state);
      expect(result).toEqual([]);
    });

    it('should return filtered properties', () => {
      const state = createMockState({
        byId: { '1': mockProperty },
        filteredIds: ['1'],
      });
      const result = selectFilteredProperties(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('selectIsLoading', () => {
    it('should return false by default', () => {
      const state = createMockState({ loading: false });
      expect(selectIsLoading(state)).toBe(false);
    });

    it('should return true when loading', () => {
      const state = createMockState({ loading: true });
      expect(selectIsLoading(state)).toBe(true);
    });
  });

  describe('selectError', () => {
    it('should return null by default', () => {
      const state = createMockState({ error: null });
      expect(selectError(state)).toBeNull();
    });

    it('should return error when present', () => {
      const state = createMockState({ error: 'Test error' });
      expect(selectError(state)).toBe('Test error');
    });
  });

  describe('selectCurrentPage', () => {
    it('should return 1 by default', () => {
      const state = createMockState({ pagination: null });
      expect(selectCurrentPage(state)).toBe(1);
    });

    it('should return current page from pagination', () => {
      const state = createMockState({
        pagination: { page: 3, pageSize: 10, total: 100, totalPages: 10 },
      });
      expect(selectCurrentPage(state)).toBe(3);
    });
  });

  describe('selectTotalPages', () => {
    it('should return 0 by default', () => {
      const state = createMockState({ pagination: null });
      expect(selectTotalPages(state)).toBe(0);
    });

    it('should return total pages from pagination', () => {
      const state = createMockState({
        pagination: { page: 1, pageSize: 10, total: 100, totalPages: 10 },
      });
      expect(selectTotalPages(state)).toBe(10);
    });
  });

});

