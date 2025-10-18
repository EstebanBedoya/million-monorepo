'use client';

import { useRouter } from 'next/navigation';
import { MockPropertyType } from '../../../domain/schemas/property.schema';
import { Image } from '../atoms/Image';
import { Badge } from '../atoms/Badge';
import { Price } from '../atoms/Price';
import { Button } from '../atoms/Button';
import { LocationInfo } from '../molecules/LocationInfo';
import { PropertyDetails } from '../molecules/PropertyDetails';

export interface PropertyCardProps {
  property: MockPropertyType;
  onViewDetails?: (property: MockPropertyType) => void;
  onEdit?: (property: MockPropertyType) => void;
  onDelete?: (property: MockPropertyType) => void;
  showActions?: boolean;
}

export function PropertyCard({ 
  property, 
  onViewDetails, 
  onEdit, 
  onDelete,
  showActions = true 
}: PropertyCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      router.push(`/properties/${property.id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(property);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(property);
    }
  };

  const images = property.image ? [property.image] : [];
  const location = `${property.address}, ${property.city}`;

  return (
    <article className="card-elevated overflow-hidden group cursor-pointer" role="article">
      <div className="relative h-64 overflow-hidden bg-secondary/10">
        <Image
          src={images[0] || '/placeholder-property.jpg'}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          fallbackSrc="/placeholder-property.jpg"
        />
        
        {property.propertyType && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-gray-700/50 text-gray-100 backdrop-blur-sm shadow-sm">
              {property.propertyType}
            </Badge>
          </div>
        )}

        {showActions && (onEdit || onDelete) && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg transition-colors"
                aria-label={`Edit ${property.name}`}
                title="Edit Property"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-lg transition-colors"
                aria-label={`Delete ${property.name}`}
                title="Delete Property"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <Price amount={property.price} size="xl" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.name}
        </h3>

        <LocationInfo 
          address={location}
          className="mb-4"
        />

        <PropertyDetails
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          area={property.area}
          areaUnit={property.areaUnit}
        />

        <Button
          onClick={handleViewDetails}
          className="mt-4 w-full"
          aria-label={`View details for ${property.name}`}
        >
          View Details
        </Button>
      </div>
    </article>
  );
}
