import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Basic selectors
export const selectProperties = (state: RootState) => state.properties.properties;
export const selectSelectedProperty = (state: RootState) => state.properties.selectedProperty;
export const selectPropertiesLoading = (state: RootState) => state.properties.loading;
export const selectPropertiesError = (state: RootState) => state.properties.error;
export const selectPropertiesPagination = (state: RootState) => state.properties.pagination;
export const selectPropertiesFilter = (state: RootState) => state.properties.filter;

// Memoized selectors
export const selectAvailableProperties = createSelector(
  [selectProperties],
  (properties) => properties.filter(property => property.isAvailable())
);

export const selectExpensiveProperties = createSelector(
  [selectProperties],
  (properties) => properties.filter(property => property.isExpensive())
);

export const selectPropertiesByType = createSelector(
  [selectProperties, (state: RootState, propertyType: string) => propertyType],
  (properties, propertyType) => properties.filter(property => property.propertyType === propertyType)
);

export const selectPropertiesByPriceRange = createSelector(
  [selectProperties, (state: RootState, minPrice: number, maxPrice: number) => ({ minPrice, maxPrice })],
  (properties, { minPrice, maxPrice }) => 
    properties.filter(property => property.price >= minPrice && property.price <= maxPrice)
);

export const selectPropertiesStats = createSelector(
  [selectProperties],
  (properties) => ({
    total: properties.length,
    available: properties.filter(p => p.isAvailable()).length,
    expensive: properties.filter(p => p.isExpensive()).length,
    averagePrice: properties.length > 0 
      ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
      : 0,
  })
);

export const selectFilteredProperties = createSelector(
  [selectProperties, selectPropertiesFilter],
  (properties, filter) => {
    switch (filter) {
      case 'available':
        return properties.filter(property => property.isAvailable());
      case 'expensive':
        return properties.filter(property => property.isExpensive());
      default:
        return properties;
    }
  }
);
