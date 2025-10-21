'use client';

import { useState, useEffect } from 'react';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyCard } from './organisms/PropertyCard';
import { PropertyCardSkeleton } from './molecules/PropertyCardSkeleton';
import { EmptyState } from './molecules/EmptyState';
import { ErrorState } from './molecules/ErrorState';

interface PropertyListProps {
  properties: MockPropertyType[];
  onPropertyClick?: (property: MockPropertyType) => void;
  onPropertyEdit?: (property: MockPropertyType) => void;
  onPropertyDelete?: (property: MockPropertyType) => void;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  showActions?: boolean;
}

export function PropertyList({ 
  properties, 
  onPropertyClick, 
  onPropertyEdit,
  onPropertyDelete,
  loading, 
  error, 
  onRetry, 
  onClearFilters,
  showActions = true
}: PropertyListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return <EmptyState onReset={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <PropertyCard
          key={`property-${property.id}-${index}`}
          property={property}
          onViewDetails={onPropertyClick}
          onEdit={onPropertyEdit}
          onDelete={onPropertyDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
