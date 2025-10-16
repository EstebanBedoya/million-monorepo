'use client';

import { MockPropertyType } from '../../../domain/schemas/property.schema';
import { PropertyCard } from '../organisms/PropertyCard';
import { AsyncBoundary } from '../molecules/AsyncBoundary';

interface PropertyListTemplateProps {
  properties: MockPropertyType[];
  onPropertyClick?: (property: MockPropertyType) => void;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export function PropertyListTemplate({ 
  properties, 
  onPropertyClick, 
  loading,
  error,
  onRetry,
  onClearFilters 
}: PropertyListTemplateProps) {
  return (
    <AsyncBoundary
      loading={loading}
      error={error}
      isEmpty={!loading && !error && properties.length === 0}
      onRetry={onRetry}
      onClearFilters={onClearFilters}
      emptyTitle="No Properties Found"
      emptyMessage="We couldn't find any properties matching your criteria. Try adjusting your filters."
    >
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
    </AsyncBoundary>
  );
}
