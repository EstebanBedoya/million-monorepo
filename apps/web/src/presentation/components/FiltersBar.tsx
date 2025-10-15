'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FilterValues {
  search: string;
  minPrice: number;
  maxPrice: number;
  propertyType?: string;
}

interface FiltersBarProps {
  onFilterChange: (filters: FilterValues) => void;
  defaultFilters?: Partial<FilterValues>;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function FiltersBar({ onFilterChange, defaultFilters }: FiltersBarProps) {
  const [search, setSearch] = useState(defaultFilters?.search || '');
  const [minPrice, setMinPrice] = useState(defaultFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(defaultFilters?.maxPrice || 5000000);
  const [propertyType, setPropertyType] = useState(defaultFilters?.propertyType || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce search input (400ms)
  const debouncedSearch = useDebounce(search, 400);

  // Trigger filter change when debounced values change
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      minPrice,
      maxPrice,
      propertyType,
    });
  }, [debouncedSearch, minPrice, maxPrice, propertyType, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setMinPrice(0);
    setMaxPrice(5000000);
    setPropertyType('');
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = search || minPrice > 0 || maxPrice < 5000000 || propertyType;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-8">
      {/* Mobile toggle button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-secondary/5 rounded-md"
          aria-expanded={isExpanded}
          aria-controls="filters-content"
        >
          <span className="font-medium text-foreground">Filters</span>
          <svg
            className={`w-5 h-5 text-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters content */}
      <div
        id="filters-content"
        className={`${isExpanded ? 'block' : 'hidden'} lg:block space-y-6`}
      >
        {/* Search field */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search by name or address
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g., Modern Villa, Los Angeles..."
                className="input-field pl-10"
                aria-label="Search properties by name or address"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="property-type" className="block text-sm font-medium text-foreground mb-2">
              Property Type
            </label>
            <select
              id="property-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="input-field"
              aria-label="Filter by property type"
            >
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
        </div>

        {/* Price range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-foreground">
              Price Range
            </label>
            <span className="text-sm text-accent font-medium">
              {formatPrice(minPrice)} - {formatPrice(maxPrice)}
            </span>
          </div>

          <div className="space-y-4">
            {/* Min Price Slider */}
            <div>
              <label htmlFor="min-price" className="text-xs text-secondary mb-1 block">
                Minimum Price
              </label>
              <input
                id="min-price"
                type="range"
                min="0"
                max="5000000"
                step="50000"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer 
                           accent-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="Minimum price"
                aria-valuemin={0}
                aria-valuemax={5000000}
                aria-valuenow={minPrice}
              />
            </div>

            {/* Max Price Slider */}
            <div>
              <label htmlFor="max-price" className="text-xs text-secondary mb-1 block">
                Maximum Price
              </label>
              <input
                id="max-price"
                type="range"
                min="0"
                max="5000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer 
                           accent-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="Maximum price"
                aria-valuemin={0}
                aria-valuemax={5000000}
                aria-valuenow={maxPrice}
              />
            </div>
          </div>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-border">
            <button
              onClick={handleClearFilters}
              className="w-full lg:w-auto btn-secondary flex items-center justify-center gap-2"
              aria-label="Clear all filters"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

