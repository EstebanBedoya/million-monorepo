'use client';

import { Property } from '../../domain/entities/Property';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {property.location.getFullAddress()}
        </p>
        <p className="text-gray-700">
          {property.description}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-green-600">
            {property.getFormattedPrice()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.isAvailable() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
        
        <div className="flex gap-4 text-sm text-gray-600">
          {property.bedrooms && (
            <span>{property.bedrooms} bedrooms</span>
          )}
          {property.bathrooms && (
            <span>{property.bathrooms} bathrooms</span>
          )}
          <span>{property.area} {property.areaUnit}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(property)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
}
