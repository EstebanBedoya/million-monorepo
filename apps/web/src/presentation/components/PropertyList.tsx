'use client';

import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyCard } from './organisms/PropertyCard';
import { PropertyCardSkeleton } from './molecules/PropertyCardSkeleton';
import { EmptyState } from './molecules/EmptyState';
import { ErrorState } from './molecules/ErrorState';

interface PropertyListProps {
  properties: MockPropertyType[];
  onPropertyClick?: (property: MockPropertyType) => void;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export function PropertyList({ 
  properties, 
  onPropertyClick, 
  loading, 
  error, 
  onRetry, 
  onClearFilters 
}: PropertyListProps) {
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
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onViewDetails={onPropertyClick}
        />
      ))}
    </div>
  );
}
