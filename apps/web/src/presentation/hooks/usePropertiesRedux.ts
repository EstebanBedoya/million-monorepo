import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchProperties,
  fetchAvailableProperties,
  fetchExpensiveProperties,
  fetchPropertyById,
  createProperty,
  setFilter,
  setSearchFilters,
  setSelectedProperty,
  clearError,
  clearSearchFilters,
  clearProperties,
  invalidateCache,
  updateCache,
} from '../../store/slices/propertySlice';
import {
  selectAllProperties,
  selectFilteredProperties,
  selectPropertyById,
  selectIsLoading,
  selectError,
  selectPagination,
  selectCurrentFilter,
  selectSearchFilters,
  selectIsCacheValid,
  selectNeedsRefresh,
  selectPropertiesCount,
  selectFilteredPropertiesCount,
  selectPropertyStats,
} from '../../store/selectors/propertySelectors';
import { CreatePropertyData } from '../../application/interfaces/PropertyService';
import { Property } from '../../domain/entities/Property';

/**
 * Custom hook for managing properties with Redux
 * Optimized for handling 1000+ properties with normalized state
 */
export function usePropertiesRedux() {
  const dispatch = useAppDispatch();

  // Selectors
  const allProperties = useAppSelector(selectAllProperties);
  const filteredProperties = useAppSelector(selectFilteredProperties);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const pagination = useAppSelector(selectPagination);
  const currentFilter = useAppSelector(selectCurrentFilter);
  const searchFilters = useAppSelector(selectSearchFilters);
  const isCacheValid = useAppSelector(selectIsCacheValid);
  const needsRefresh = useAppSelector(selectNeedsRefresh);
  const totalCount = useAppSelector(selectPropertiesCount);
  const filteredCount = useAppSelector(selectFilteredPropertiesCount);
  const stats = useAppSelector(selectPropertyStats);

  // Actions
  const loadProperties = useCallback((options: { page?: number; limit?: number } = {}) => {
    // Check cache validity before making request
    if (isCacheValid && !needsRefresh) {
      console.log('Using cached properties data');
      return;
    }
    
    dispatch(fetchProperties(options));
  }, [dispatch, isCacheValid, needsRefresh]);

  const loadAvailableProperties = useCallback(() => {
    if (isCacheValid && !needsRefresh && currentFilter === 'available') {
      console.log('Using cached available properties data');
      return;
    }
    
    dispatch(fetchAvailableProperties());
  }, [dispatch, isCacheValid, needsRefresh, currentFilter]);

  const loadExpensiveProperties = useCallback(() => {
    if (isCacheValid && !needsRefresh && currentFilter === 'expensive') {
      console.log('Using cached expensive properties data');
      return;
    }
    
    dispatch(fetchExpensiveProperties());
  }, [dispatch, isCacheValid, needsRefresh, currentFilter]);

  const loadPropertyById = useCallback((id: string) => {
    dispatch(fetchPropertyById(id));
  }, [dispatch]);

  const addProperty = useCallback((propertyData: CreatePropertyData) => {
    dispatch(createProperty(propertyData));
  }, [dispatch]);

  const changeFilter = useCallback((filter: 'all' | 'available' | 'expensive') => {
    dispatch(setFilter(filter));
  }, [dispatch]);

  const updateSearchFilters = useCallback((filters: Partial<{
    search: string;
    minPrice: number;
    maxPrice: number;
    propertyType: string;
  }>) => {
    dispatch(setSearchFilters(filters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(clearSearchFilters());
  }, [dispatch]);

  const selectProperty = useCallback((property: Property | null) => {
    dispatch(setSelectedProperty(property));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAllProperties = useCallback(() => {
    dispatch(clearProperties());
  }, [dispatch]);

  const refreshCache = useCallback(() => {
    dispatch(invalidateCache());
  }, [dispatch]);

  const updateCacheData = useCallback((filters: Record<string, unknown>) => {
    dispatch(updateCache({ filters }));
  }, [dispatch]);

  // Note: Pagination helpers should be used directly in components with useAppSelector

  // Computed values
  const hasProperties = allProperties.length > 0;
  const hasFilteredProperties = filteredProperties.length > 0;
  const isEmpty = !isLoading && !hasProperties;
  const isFilteredEmpty = !isLoading && !hasFilteredProperties && hasProperties;

  return {
    // Data
    allProperties,
    filteredProperties,
    totalCount,
    filteredCount,
    stats,
    
    // UI State
    isLoading,
    error,
    isEmpty,
    isFilteredEmpty,
    hasProperties,
    hasFilteredProperties,
    
    // Pagination
    pagination,
    currentPage: pagination?.page || 1,
    totalPages: pagination?.totalPages || 0,
    hasNextPage: pagination?.hasNext || false,
    hasPrevPage: pagination?.hasPrev || false,
    
    // Filter
    currentFilter,
    searchFilters,
    
    // Cache
    isCacheValid,
    needsRefresh,
    
    // Actions
    loadProperties,
    loadAvailableProperties,
    loadExpensiveProperties,
    loadPropertyById,
    addProperty,
    changeFilter,
    updateSearchFilters,
    clearFilters,
    selectProperty,
    clearError: clearErrorState,
    clearAllProperties,
    refreshCache,
    updateCacheData,
    
  };
}

/**
 * Hook for getting a specific property by ID
 * Uses memoized selector for optimal performance
 */
export function usePropertyById(id: string) {
  const property = useAppSelector(selectPropertyById(id));
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    property,
    isLoading,
    error,
    exists: !!property,
  };
}

/**
 * Hook for property statistics
 * Useful for dashboard or analytics components
 */
export function usePropertyStats() {
  const stats = useAppSelector(selectPropertyStats);
  const isLoading = useAppSelector(selectIsLoading);

  return {
    stats,
    isLoading,
  };
}
