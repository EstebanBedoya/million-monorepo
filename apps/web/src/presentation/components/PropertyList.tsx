'use client';

import { Property } from '../../domain/entities/Property';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  loading?: boolean;
}

export function PropertyList({ properties, onPropertyClick, loading }: PropertyListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No properties found</div>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
