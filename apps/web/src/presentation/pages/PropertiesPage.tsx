'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyList } from '../components/PropertyList';
import { Sidebar } from '../components/organisms/Sidebar';
import { Pagination } from '../components/organisms/Pagination';
import { PaginationSkeleton } from '../components/molecules/PaginationSkeleton';
import { FilterValues } from '../components/organisms/FiltersBar';
import { usePropertiesRedux } from '../hooks/usePropertiesRedux';
import { useAppSelector } from '../../store/hooks';
import { selectPaginatedProperties, selectFilteredPagination } from '../../store/selectors/propertySelectors';

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

// Internal component that uses search params
function PropertiesPageContent({
  initialProperties = [],
  initialPagination
}: PropertiesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Redux hooks
  const {
    filteredProperties,
    isLoading: loading,
    error,
    pagination,
    currentFilter,
    searchFilters,
    loadProperties,
    loadAvailableProperties,
    loadExpensiveProperties,
    changeFilter,
    updateSearchFilters,
    clearFilters,
    clearError,
    isCacheValid,
    needsRefresh,
  } = usePropertiesRedux();
  
  // Local state (UI only)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);

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

  // Use refs to avoid dependency issues
  const filtersRef = useRef(filters);
  const routerRef = useRef(router);

  // Update refs when values change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Update URL with filters
  const updateURL = useCallback((newFilters: FilterValues, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 5000000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);
    if (page > 1) params.set('page', page.toString());

    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    routerRef.current.push(url, { scroll: false });
  }, []);

  // Load properties using Redux (load all properties once)
  const loadPropertiesData = useCallback(async (filterValues: FilterValues, page: number) => {
    // Check if we need to refresh data
    if (!isCacheValid || needsRefresh) {
      console.log('Cache expired, loading fresh data');
      await loadProperties({ 
        page: 1, // Always load from page 1 to get all properties
        limit: 1000 // Load a large number to get all properties
      });
    } else {
      console.log('Using cached data');
    }
  }, [loadProperties, isCacheValid, needsRefresh]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
    
    // Update Redux filters
    updateSearchFilters({
      search: newFilters.search,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      propertyType: newFilters.propertyType || '',
    });
  }, [updateSearchFilters, updateURL]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setIsChangingPage(true);
    updateURL(filtersRef.current, page);
    // No need to reload data, just update URL for client-side pagination
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset changing page state after a short delay to show smooth transition
    setTimeout(() => {
      setIsChangingPage(false);
    }, 300);
  }, [updateURL]);

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
    
    // Clear Redux filters
    clearFilters();
  }, [clearFilters, updateURL]);

  // Initial load from URL params
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    const page = Number(searchParams.get('page')) || 1;
    
    setFilters(urlFilters);
    
    // Sync filters with Redux
    updateSearchFilters({
      search: urlFilters.search,
      minPrice: urlFilters.minPrice,
      maxPrice: urlFilters.maxPrice,
      propertyType: urlFilters.propertyType || '',
    });
    
    loadPropertiesData(urlFilters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount


  // Get current page from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 12;

  // Use client-side pagination for filtered properties
  const paginatedProperties = useAppSelector(selectPaginatedProperties(currentPage, limit));
  const filteredPagination = useAppSelector(selectFilteredPagination(currentPage, limit));

  const displayedProperties = useMemo(() => {
    // Convert Redux properties to the expected format for PropertyList
    return paginatedProperties.map((property: any) => ({
      id: property.id,
      name: property.name,
      location: property.location,
      price: property.price,
      currency: property.currency,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area,
      areaUnit: property.areaUnit,
      images: property.images,
      status: property.status,
      features: property.features,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }));
  }, [paginatedProperties]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-3">
              MILLION
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

      {/* Main layout with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          onFilterChange={handleFilterChange}
          defaultFilters={filters}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Mobile filter toggle button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filters
              </button>
            </div>

            {/* Results count */}
            {!loading && (
              <div className="mb-6">
                <p className="text-sm text-secondary">
                  {filteredPagination && filteredPagination.total > 0 ? (
                    <>
                      Showing <span className="font-medium text-foreground">{displayedProperties.length}</span> of{' '}
                      <span className="font-medium text-foreground">{filteredPagination.total}</span> properties
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
              onRetry={() => loadProperties({ page: pagination?.page || 1, limit: 12 })}
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            {loading || isChangingPage ? (
              <PaginationSkeleton />
            ) : (
              displayedProperties.length > 0 && filteredPagination && (
                <div className="mt-8">
                  <Pagination
                    currentPage={filteredPagination.page}
                    totalPages={filteredPagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNext={filteredPagination.hasNext}
                    hasPrev={filteredPagination.hasPrev}
                  />
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-secondary">
            <p>© 2025 MILLION. Luxury Real Estate Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper component with Suspense boundary for useSearchParams
export function PropertiesPage(props: PropertiesPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPageContent {...props} />
    </Suspense>
  );
}
