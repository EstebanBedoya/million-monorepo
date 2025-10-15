'use client';

import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyCard } from './PropertyCard';
import { PropertyListSkeleton } from './PropertyCardSkeleton';
import { EmptyState } from './EmptyState';

interface PropertyListProps {
  properties: MockPropertyType[];
  onPropertyClick?: (property: MockPropertyType) => void;
  loading?: boolean;
  onClearFilters?: () => void;
}

export function PropertyList({ 
  properties, 
  onPropertyClick, 
  loading,
  onClearFilters 
}: PropertyListProps) {
  if (loading) {
    return <PropertyListSkeleton count={12} />;
  }

  if (properties.length === 0) {
    return <EmptyState onReset={onClearFilters} />;
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Properties list"
    >
      {properties.map((property) => (
        <div key={property.id} role="listitem">
          <PropertyCard
            property={property}
            onViewDetails={onPropertyClick}
          />
        </div>
      ))}
    </div>
  );
}
