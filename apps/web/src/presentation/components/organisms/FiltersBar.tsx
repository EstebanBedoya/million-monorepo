'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchInput } from '@/presentation/components/molecules/SearchInput';
import { PropertyTypeSelect } from '@/presentation/components/molecules/PropertyTypeSelect';
import { PriceRange } from '@/presentation/components/molecules/PriceRange';
import { ClearFiltersButton } from '@/presentation/components/molecules/ClearFiltersButton';
import { useDictionary } from '@/i18n/client';

export interface FilterValues {
  search: string;
  minPrice: number;
  maxPrice: number;
  propertyType?: string;
}

interface FiltersBarProps {
  onFilterChange: (filters: FilterValues) => void;
  defaultFilters?: Partial<FilterValues>;
  skipInitialCall?: boolean;
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

export function FiltersBar({ onFilterChange, defaultFilters, skipInitialCall = true }: FiltersBarProps) {
  const dict = useDictionary();
  const [search, setSearch] = useState(defaultFilters?.search || '');
  const [minPrice, setMinPrice] = useState(defaultFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(defaultFilters?.maxPrice || 1000000000);
  const [propertyType, setPropertyType] = useState(defaultFilters?.propertyType || '');

  const isFirstRender = useRef(skipInitialCall);
  const onFilterChangeRef = useRef(onFilterChange);

  const debouncedSearch = useDebounce(search, 400);

  // Update ref when callback changes
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    // Skip first render if skipInitialCall is true
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
          label={dict.filters.searchLabel}
          value={search}
          onChange={setSearch}
          placeholder={dict.filters.searchPlaceholder}
        />

        <PropertyTypeSelect
          id="property-type"
          label={dict.filters.propertyType}
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
