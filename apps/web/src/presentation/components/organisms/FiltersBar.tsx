'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchInput } from '../molecules/SearchInput';
import { PropertyTypeSelect } from '../molecules/PropertyTypeSelect';
import { PriceRange } from '../molecules/PriceRange';
import { ClearFiltersButton } from '../molecules/ClearFiltersButton';

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
  const [maxPrice, setMaxPrice] = useState(defaultFilters?.maxPrice || 1000000000);
  const [propertyType, setPropertyType] = useState(defaultFilters?.propertyType || '');
  
  const isFirstRender = useRef(true);
  const onFilterChangeRef = useRef(onFilterChange);

  const debouncedSearch = useDebounce(search, 400);

  // Update ref when callback changes
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    // Skip first render to avoid calling on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onFilterChangeRef.current({
      search: debouncedSearch,
      minPrice,
      maxPrice,
      propertyType,
    });
  }, [debouncedSearch, minPrice, maxPrice, propertyType]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setMinPrice(0);
    setMaxPrice(1000000000);
    setPropertyType('');
  }, []);

  const hasActiveFilters = search || minPrice > 0 || maxPrice < 1000000000 || propertyType;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchInput
          id="search"
          label="Search by name or address"
          value={search}
          onChange={setSearch}
          placeholder="e.g., Modern Villa, Los Angeles..."
        />

        <PropertyTypeSelect
          id="property-type"
          label="Property Type"
          value={propertyType}
          onChange={setPropertyType}
        />
      </div>

      <PriceRange
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />

      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <ClearFiltersButton onClick={handleClearFilters} />
        </div>
      )}
    </div>
  );
}
