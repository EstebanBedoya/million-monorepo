import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/index';
import { Property } from '@/domain/entities/Property';
import { SerializableProperty } from '@/store/slices/propertySlice';

// Helper function to convert serializable property to Property instance
const serializableToProperty = (data: SerializableProperty): Property => 
  Property.create({
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    currency: data.currency,
    location: data.location,
    propertyType: data.propertyType,
    area: data.area,
    areaUnit: data.areaUnit,
    features: data.features,
    images: data.images,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
  });

// Base selectors
const selectPropertyState = (state: RootState) => state.properties;

// Normalized data selectors
export const selectAllProperties = createSelector(
  [selectPropertyState],
  (propertyState) => {
    return propertyState.allIds
      .map((id: string) => propertyState.byId[id])
      .filter(Boolean)
      .map(serializableToProperty);
  }
);

export const selectFilteredProperties = createSelector(
  [selectPropertyState],
  (propertyState) => {
    return propertyState.filteredIds
      .map((id: string) => propertyState.byId[id])
      .filter(Boolean)
      .map(serializableToProperty);
  }
);

export const selectPropertyById = (id: string) => createSelector(
  [selectPropertyState],
  (propertyState) => {
    const propertyData = propertyState.byId[id];
    return propertyData ? serializableToProperty(propertyData) : null;
  }
);

export const selectPropertiesByIds = (ids: string[]) => createSelector(
  [selectPropertyState],
  (propertyState) => {
    return ids
      .map((id: string) => propertyState.byId[id])
      .filter(Boolean)
      .map(serializableToProperty);
  }
);

// UI state selectors
export const selectSelectedProperty = createSelector(
  [selectPropertyState],
  (propertyState) => {
    return propertyState.selectedProperty 
      ? serializableToProperty(propertyState.selectedProperty) 
      : null;
  }
);

export const selectIsLoading = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.loading
);

export const selectError = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.error
);

// Pagination selectors
export const selectPagination = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.pagination
);

export const selectCurrentPage = createSelector(
  [selectPagination],
  (pagination) => pagination?.page || 1
);

export const selectTotalPages = createSelector(
  [selectPagination],
  (pagination) => pagination?.totalPages || 0
);

export const selectHasNextPage = createSelector(
  [selectPagination],
  (pagination) => pagination?.hasNext || false
);

export const selectHasPrevPage = createSelector(
  [selectPagination],
  (pagination) => pagination?.hasPrev || false
);

// Filter selectors
export const selectCurrentFilter = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.filter
);

export const selectSearchFilters = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.searchFilters
);

// Cache selectors
export const selectCacheInfo = createSelector(
  [selectPropertyState],
  (propertyState) => propertyState.cache
);

export const selectIsCacheValid = createSelector(
  [selectCacheInfo],
  (cache) => {
    if (cache.needsRefresh) return false;
    const now = Date.now();
    return (now - cache.timestamp) < cache.ttl;
  }
);

export const selectNeedsRefresh = createSelector(
  [selectCacheInfo],
  (cache) => cache.needsRefresh
);

// Computed selectors
export const selectPropertiesCount = createSelector(
  [selectAllProperties],
  (properties) => properties.length
);

export const selectFilteredPropertiesCount = createSelector(
  [selectFilteredProperties],
  (properties) => properties.length
);

// Advanced selectors for specific use cases
export const selectAvailableProperties = createSelector(
  [selectAllProperties],
  (properties) => properties.filter((property: Property) => property.isAvailable())
);

export const selectExpensiveProperties = createSelector(
  [selectAllProperties],
  (properties) => properties.filter((property: Property) => property.isExpensive())
);

export const selectPropertiesByPriceRange = (minPrice: number, maxPrice: number) => createSelector(
  [selectAllProperties],
  (properties) => properties.filter((property: Property) => 
    property.price >= minPrice && property.price <= maxPrice
  )
);

export const selectPropertiesByType = (propertyType: string) => createSelector(
  [selectAllProperties],
  (properties) => properties.filter((property: Property) => 
    property.propertyType === propertyType
  )
);

// Performance optimized selectors for large datasets
export const selectPaginatedProperties = (page: number, limit: number) => createSelector(
  [selectFilteredProperties],
  (properties) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return properties.slice(startIndex, endIndex);
  }
);

// Pagination info for filtered properties
export const selectFilteredPagination = (page: number, limit: number) => createSelector(
  [selectFilteredProperties],
  (properties) => {
    const total = properties.length;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };
  }
);

export const selectPropertiesForVirtualization = (startIndex: number, endIndex: number) => createSelector(
  [selectFilteredProperties],
  (properties) => {
    return properties.slice(startIndex, endIndex);
  }
);

// Search selectors
export const selectPropertiesBySearch = (searchTerm: string) => createSelector(
  [selectAllProperties],
  (properties) => {
    if (!searchTerm.trim()) return properties;
    
    const term = searchTerm.toLowerCase();
    return properties.filter((property: Property) => 
      property.name.toLowerCase().includes(term) ||
      property.description.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term)
    );
  }
);

// Statistics selectors
export const selectPropertyStats = createSelector(
  [selectAllProperties],
  (properties) => {
    if (properties.length === 0) {
      return {
        total: 0,
        available: 0,
        expensive: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
      };
    }

    const prices = properties.map((p: Property) => p.price);
    const available = properties.filter((p: Property) => p.isAvailable()).length;
    const expensive = properties.filter((p: Property) => p.isExpensive()).length;
    
    return {
      total: properties.length,
      available,
      expensive,
      averagePrice: prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }
);