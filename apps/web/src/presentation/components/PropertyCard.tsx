'use client';

import { MockPropertyType } from '../../domain/schemas/property.schema';
import Image from 'next/image';

interface PropertyCardProps {
  property: MockPropertyType;
  onViewDetails?: (property: MockPropertyType) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className="card-elevated overflow-hidden group cursor-pointer" role="article">
      {/* Image container */}
      <div className="relative h-64 overflow-hidden bg-secondary/10">
        <Image
          src={property.image || '/placeholder-property.jpg'}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-property.jpg';
          }}
        />
        
        {/* Property type badge */}
        {property.propertyType && (
          <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
            <span className="text-xs font-medium text-foreground">
              {property.propertyType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <p className="text-3xl font-semibold text-accent">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 mb-4">
          <svg 
            className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-secondary line-clamp-2">
              {property.address}
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {property.city}
            </p>
          </div>
        </div>

        {/* Property details */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
                <svg 
                  className="w-4 h-4 text-secondary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                <span className="text-sm text-foreground font-medium">
                  {property.bedrooms} <span className="text-secondary font-normal">bd</span>
                </span>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
                <svg 
                  className="w-4 h-4 text-secondary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
                  />
                </svg>
                <span className="text-sm text-foreground font-medium">
                  {property.bathrooms} <span className="text-secondary font-normal">ba</span>
                </span>
              </div>
            )}
            
            {property.area && (
              <div className="flex items-center gap-1.5" title={`${property.area} ${property.areaUnit || 'm²'}`}>
                <svg 
                  className="w-4 h-4 text-secondary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
                  />
                </svg>
                <span className="text-sm text-foreground font-medium">
                  {property.area} <span className="text-secondary font-normal">{property.areaUnit || 'm²'}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* View Details Button (optional) */}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(property)}
            className="mt-4 w-full btn-primary"
            aria-label={`View details for ${property.name}`}
          >
            View Details
          </button>
        )}
      </div>
    </article>
  );
}
