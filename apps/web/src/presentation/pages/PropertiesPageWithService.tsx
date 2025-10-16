'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyList } from '../components/PropertyList';
import { FiltersBar, FilterValues } from '../components/organisms/FiltersBar';
import { Pagination } from '../components/organisms/Pagination';
import { ThemeToggle } from '../components/molecules/ThemeToggle';
import { ErrorSimulationPanel } from '../components/molecules/ErrorSimulationPanel';
import { usePropertyService } from '../hooks/usePropertyService';

interface PropertiesPageProps {
  initialProperties?: MockPropertyType[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function PropertiesPageWithService({ 
  initialProperties = [], 
  initialPagination 
}: PropertiesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use the new property service hook
  const {
    properties,
    pagination,
    loading,
    error,
    fetchProperties,
    retry,
    setErrorSimulation,
  } = usePropertyService({
    baseUrl: '/api/mock/properties',
    simulateErrors: process.env.NODE_ENV === 'development',
    errorRate: 0.1,
  });

  // Get filters from URL
  const getFiltersFromURL = useCallback((): FilterValues => {
    return {
      search: searchParams.get('search') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 5000000,
      propertyType: searchParams.get('propertyType') || '',
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterValues>(getFiltersFromURL());

  // Update URL with filters
  const updateURL = useCallback((newFilters: FilterValues, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 5000000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);
    if (page > 1) params.set('page', page.toString());

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [router]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
    fetchProperties(newFilters, 1);
  }, [updateURL, fetchProperties]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    updateURL(filters, page);
    fetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, updateURL, fetchProperties]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const defaultFilters: FilterValues = {
      search: '',
      minPrice: 0,
      maxPrice: 5000000,
      propertyType: '',
    };
    setFilters(defaultFilters);
    updateURL(defaultFilters, 1);
    fetchProperties(defaultFilters, 1);
  }, [updateURL, fetchProperties]);

  // Initial load from URL params
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    const page = Number(searchParams.get('page')) || 1;
    
    setFilters(urlFilters);
    fetchProperties(urlFilters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Memoized filtered properties (for client-side additional filtering if needed)
  const displayedProperties = useMemo(() => {
    let filtered = [...properties];

    // Additional client-side filtering by property type if needed
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    return filtered;
  }, [properties, filters.propertyType]);

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Error Simulation Panel (Development only) */}
      <ErrorSimulationPanel
        onSetErrorSimulation={setErrorSimulation}
        onSetErrorTypes={(types) => {
          // This would need to be implemented in the service
          console.log('Setting error types:', types);
        }}
      />
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-3">
              ESTATELY
            </h1>
            <p className="text-xl text-accent mb-2">
              Find Your Dream Home
            </p>
            <p className="text-secondary max-w-2xl mx-auto">
              Discover exceptional properties with elegant design and unparalleled luxury
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <FiltersBar 
          onFilterChange={handleFilterChange}
          defaultFilters={filters}
        />

        {/* Results count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-secondary">
              {pagination && pagination.total > 0 ? (
                <>
                  Showing <span className="font-medium text-foreground">{properties.length}</span> of{' '}
                  <span className="font-medium text-foreground">{pagination.total}</span> properties
                </>
              ) : (
                'No properties found'
              )}
            </p>
          </div>
        )}

        {/* Property list */}
        <PropertyList 
          properties={displayedProperties}
          loading={loading}
          error={error}
          onRetry={retry}
          onClearFilters={handleClearFilters}
        />

        {/* Pagination */}
        {!loading && properties.length > 0 && pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-secondary">
            <p>© 2025 ESTATELY. Luxury Real Estate Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
