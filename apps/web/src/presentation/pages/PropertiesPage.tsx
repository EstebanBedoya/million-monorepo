'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyList } from '../components/PropertyList';
import { Sidebar } from '../components/organisms/Sidebar';
import { Pagination } from '../components/organisms/Pagination';
import { ThemeToggle } from '../components/molecules/ThemeToggle';
import { FilterValues } from '../components/organisms/FiltersBar';

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

export function PropertiesPage({ 
  initialProperties = [], 
  initialPagination 
}: PropertiesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [properties, setProperties] = useState<MockPropertyType[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState(initialPagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
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

    routerRef.current.push(`/?${params.toString()}`, { scroll: false });
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(async (filterValues: FilterValues, page: number) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      
      if (filterValues.search) params.set('search', filterValues.search);
      if (filterValues.minPrice > 0) params.set('minPrice', filterValues.minPrice.toString());
      if (filterValues.maxPrice < 5000000) params.set('maxPrice', filterValues.maxPrice.toString());

      const response = await fetch(`/api/mock/properties?${params.toString()}`);
      const data = await response.json();

      setProperties(data.properties || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
    fetchProperties(newFilters, 1);
  }, []);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    updateURL(filtersRef.current, page);
    fetchProperties(filtersRef.current, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
  }, []);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme Toggle */}
      <ThemeToggle />
      
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
                  {pagination.total > 0 ? (
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
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            {!loading && properties.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-secondary">
            <p>© 2025 ESTATELY. Luxury Real Estate Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
