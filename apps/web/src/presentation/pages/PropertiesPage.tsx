'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyList } from '../components/PropertyList';
import { Sidebar } from '../components/organisms/Sidebar';
import { Pagination } from '../components/organisms/Pagination';
import { PaginationSkeleton } from '../components/molecules/PaginationSkeleton';
import { FilterValues } from '../components/organisms/FiltersBar';
import { PropertyFormModal, PropertyFormData } from '../components/organisms/PropertyFormModal';
import { ConfirmDialog } from '../components/atoms/ConfirmDialog';
import { usePropertiesRedux } from '../hooks/usePropertiesRedux';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectPaginatedProperties, selectFilteredPagination } from '../../store/selectors/propertySelectors';
import { updateProperty, deleteProperty, createProperty, SerializableProperty } from '../../store/slices/propertySlice';
import { PropertyStatus, PropertyType, AreaUnit } from '../../domain/entities/Property';

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
  const dispatch = useAppDispatch();
  
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
  
  // CRUD modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedProperty, setSelectedProperty] = useState<SerializableProperty | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<MockPropertyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get filters from URL
  const getFiltersFromURL = useCallback((): FilterValues => {
    return {
      search: searchParams.get('search') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 1000000000,
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
    if (newFilters.maxPrice < 1000000000) params.set('maxPrice', newFilters.maxPrice.toString());
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
      await loadProperties({ 
        page: 1, // Always load from page 1 to get all properties
        limit: 1000 // Load a large number to get all properties
      });
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
      maxPrice: 1000000000,
      propertyType: '',
    };
    setFilters(defaultFilters);
    updateURL(defaultFilters, 1);
    
    // Clear Redux filters
    clearFilters();
  }, [clearFilters, updateURL]);

  // CRUD handlers
  const handleCreateProperty = useCallback(() => {
    setFormMode('create');
    setSelectedProperty(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEditProperty = useCallback((property: MockPropertyType) => {
    const serializableProperty: SerializableProperty = {
      id: property.id,
      name: property.name,
      description: property.name,
      price: property.price,
      currency: 'USD',
      location: `${property.address}, ${property.city}`,
      propertyType: property.propertyType as PropertyType || PropertyType.HOUSE,
      area: property.area || 0,
      areaUnit: property.areaUnit === 'sqft' ? AreaUnit.SQFT : AreaUnit.M2,
      features: [],
      images: property.image ? [property.image] : [],
      status: PropertyStatus.AVAILABLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    };
    setSelectedProperty(serializableProperty);
    setFormMode('edit');
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteProperty = useCallback((property: MockPropertyType) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = async (data: PropertyFormData) => {
    try {
      if (formMode === 'create') {
        await dispatch(createProperty({
          name: data.name,
          description: `${data.name} located at ${data.address}, ${data.city}`,
          price: data.price,
          currency: 'USD',
          location: `${data.address}, ${data.city}`,
          propertyType: data.propertyType || 'house',
          area: data.area || 0,
          areaUnit: data.areaUnit === 'sqft' ? 'sqft' : 'm2',
          features: [],
          images: data.image ? [data.image] : [],
          status: 'available',
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
        })).unwrap();
      } else if (selectedProperty) {
        await dispatch(updateProperty({
          id: selectedProperty.id,
          data: {
            name: data.name,
            description: `${data.name} located at ${data.address}, ${data.city}`,
            price: data.price,
            currency: 'USD',
            location: `${data.address}, ${data.city}`,
            propertyType: data.propertyType || 'house',
            area: data.area || 0,
            areaUnit: data.areaUnit === 'sqft' ? 'sqft' : 'm2',
            features: [],
            images: data.image ? [data.image] : [],
            status: 'available',
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
          },
        })).unwrap();
      }
      setIsFormModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Failed to save property:', error);
      throw error;
    }
  };

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
    
    // Load properties first, then apply filters
    loadPropertiesData(urlFilters, page).then(() => {
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


  // Get current page from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 12;

  // Use client-side pagination for filtered properties
  const paginatedProperties = useAppSelector(selectPaginatedProperties(currentPage, limit));
  const filteredPagination = useAppSelector(selectFilteredPagination(currentPage, limit));

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

            {/* Results count and Create button */}
            {!loading && (
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                <button
                  onClick={handleCreateProperty}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-lg sm:rounded-md hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="sm:inline">Create Property</span>
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

      {/* Modals */}
      <PropertyFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleFormSubmit}
        property={selectedProperty}
        mode={formMode}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
        isLoading={isDeleting}
      />
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
