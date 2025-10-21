'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockPropertyType } from '@/domain/schemas/property.schema';
import { PropertyList } from '@/presentation/components/PropertyList';
import { Sidebar } from '@/presentation/components/organisms/Sidebar';
import { Pagination } from '@/presentation/components/organisms/Pagination';
import { PaginationSkeleton } from '@/presentation/components/molecules/PaginationSkeleton';
import { FilterValues } from '@/presentation/components/organisms/FiltersBar';
import { ConfirmDialog } from '@/presentation/components/atoms/ConfirmDialog';
import { usePropertiesRedux } from '@/presentation/hooks/usePropertiesRedux';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectFilteredProperties } from '@/store/selectors/propertySelectors';
import { deleteProperty } from '@/store/slices/propertySlice';
import { useDictionary, useLocale } from '@/i18n/client';

const LIMIT_PAGINATION = 12;

function PropertiesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const dict = useDictionary();
  const lang = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const limit = LIMIT_PAGINATION;

  const {
    isLoading: loading,
    error,
    pagination,
    loadProperties,
    updateSearchFilters,
    clearFilters,
  } = usePropertiesRedux();

  // Local state (UI only)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Delete modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<MockPropertyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get filters from URL
  const getFiltersFromURL = useCallback((): FilterValues => ({
      search: searchParams.get('search') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 1000000000,
      propertyType: searchParams.get('propertyType') || '',
    }), [searchParams]);

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
    if (newFilters.maxPrice < 1000000000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.propertyType) params.set('propertyType', newFilters.propertyType);
    if (page > 1) params.set('page', page.toString());

    const queryString = params.toString();
    const url = queryString ? `/${lang}/properties?${queryString}` : `/${lang}/properties`;
    routerRef.current.push(url, { scroll: false });
  }, [lang]);

  // Load properties using Redux (server-side pagination)
  const loadPropertiesData = useCallback(async (page: number, limit: number) => {
    // Always load data for the requested page (server-side pagination)
    await loadProperties({ 
      page, 
      limit 
    }, true); // Force load to ensure we fetch from server
  }, [loadProperties]);

  // Handle filter changes
  const handleFilterChange = useCallback(async (newFilters: FilterValues) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
    
    // Update Redux filters
    updateSearchFilters({
      search: newFilters.search,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      propertyType: newFilters.propertyType || '',
    });
    
    // Reload data from page 1 with new filters
    try {
      await loadPropertiesData(1, limit);
    } catch (error) {
      console.error('Error loading properties with filters:', error);
    }
  }, [updateSearchFilters, updateURL, loadPropertiesData, limit]);

  // Handle page changes
  const handlePageChange = useCallback(async (page: number) => {
    setIsChangingPage(true);
    updateURL(filtersRef.current, page);
    
    // Load data for the new page (server-side pagination)
    try {
      await loadPropertiesData(page, limit);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsChangingPage(false);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateURL, loadPropertiesData, limit]);

  // Handle clear filters
  const handleClearFilters = useCallback(async () => {
    const defaultFilters: FilterValues = {
      search: '',
      minPrice: 0,
      maxPrice: 1000000000,
      propertyType: '',
    };
    setFilters(defaultFilters);
    updateURL(defaultFilters, 1);
    
    // Clear Redux filters
    clearFilters();
    
    // Reload data from page 1 without filters
    try {
      await loadPropertiesData(1, limit);
    } catch (error) {
      console.error('Error loading properties after clearing filters:', error);
    }
  }, [clearFilters, updateURL, loadPropertiesData, limit]);

  // CRUD handlers
  const handleCreateProperty = useCallback(() => {
    router.push(`/${lang}/properties/new`);
  }, [router, lang]);

  const handleEditProperty = useCallback((property: MockPropertyType) => {
    router.push(`/${lang}/properties/${property.id}/edit`);
  }, [router, lang]);

  const handleDeleteProperty = useCallback((property: MockPropertyType) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteProperty(propertyToDelete.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Failed to delete property:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setPropertyToDelete(null);
  }, []);

  // Initial load from URL params
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    const page = Number(searchParams.get('page')) || 1;
    
    setFilters(urlFilters);
    
    // Load properties for the current page with filters
    loadPropertiesData(page, limit).then(() => {
      // Sync filters with Redux after properties are loaded
      updateSearchFilters({
        search: urlFilters.search,
        minPrice: urlFilters.minPrice,
        maxPrice: urlFilters.maxPrice,
        propertyType: urlFilters.propertyType || '',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount


  // Use server-side pagination - properties are already paginated from the server
  const paginatedProperties = useAppSelector(selectFilteredProperties);
  
  // Use pagination info directly from server response
  const serverPagination = pagination;

  const displayedProperties = useMemo(() => {
    // Map PropertyType enum to MockPropertyType string
    const mapPropertyType = (type: string): 'House' | 'Apartment' | 'Villa' | 'Condo' | 'Townhouse' | 'Studio' => {
      const typeMap: Record<string, 'House' | 'Apartment' | 'Villa' | 'Condo' | 'Townhouse' | 'Studio'> = {
        'house': 'House',
        'apartment': 'Apartment',
        'commercial': 'Condo',
        'land': 'Villa',
      };
      return typeMap[type.toLowerCase()] || 'House';
    };
    
    // Convert Redux properties to MockPropertyType format for PropertyList
    return paginatedProperties.map((property) => {
      const locationParts = property.location.split(',');
      const address = locationParts[0]?.trim() || property.location;
      const city = locationParts.slice(1).join(',').trim() || 'Unknown City';
      
      // Extract first image - handle both string array and object array
      let firstImage = '/placeholder-property.jpg';
      if (property.images && property.images.length > 0) {
        const img = property.images[0];
        firstImage = typeof img === 'string' ? img : img.file;
      }
      
      return {
        id: property.id,
        idOwner: 'owner-001',
        name: property.name,
        address: address,
        city: city,
        price: property.price,
        image: firstImage,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        areaUnit: property.areaUnit === 'm2' ? 'm²' as const : 'sqft' as const,
        propertyType: mapPropertyType(property.propertyType),
      };
    });
  }, [paginatedProperties]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-3">
              {dict.header.title}
            </h1>
            <p className="text-xl text-accent mb-2">
              {dict.header.subtitle}
            </p>
            <p className="text-secondary max-w-2xl mx-auto">
              {dict.header.description}
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
                {dict.filters.mobileFilters}
              </button>
            </div>

            {/* Results count and Create button */}
            {!loading && mounted && (
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-secondary">
                  {serverPagination && serverPagination.total > 0 ? (
                    <>
                      {dict.properties.showing} <span className="font-medium text-foreground">{displayedProperties.length}</span> {dict.properties.of}{' '}
                      <span className="font-medium text-foreground">{serverPagination.total}</span> {dict.properties.properties}
                    </>
                  ) : (
                    dict.properties.noProperties
                  )}
                </p>
                <button
                  onClick={handleCreateProperty}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-lg sm:rounded-md hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="sm:inline">{dict.properties.createProperty}</span>
                </button>
              </div>
            )}

            {/* Property list */}
            <PropertyList 
              properties={displayedProperties}
              loading={loading}
              error={error}
              onRetry={() => loadProperties({ page: pagination?.page || 1, limit: 12 })}
              onClearFilters={handleClearFilters}
              onPropertyEdit={handleEditProperty}
              onPropertyDelete={handleDeleteProperty}
              showActions={true}
            />

            {/* Pagination */}
            {loading || isChangingPage ? (
              <PaginationSkeleton />
            ) : (
              mounted && displayedProperties.length > 0 && serverPagination && (
                <div className="mt-8">
                  <Pagination
                    currentPage={serverPagination.page}
                    totalPages={serverPagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNext={serverPagination.hasNext}
                    hasPrev={serverPagination.hasPrev}
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
            <p>{dict.footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={dict.properties.deleteProperty}
        message={`${dict.properties.confirmDelete} "${propertyToDelete?.name}"? ${dict.properties.deleteWarning}`}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

// Wrapper component with Suspense boundary for useSearchParams
export function PropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}
