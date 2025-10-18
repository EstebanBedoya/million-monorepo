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
}: PropertyCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      router.push(`/properties/${property.id}`);
    }
  };

  const images = property.image ? [property.image] : [];
  const location = `${property.address}, ${property.city}`;

  return (
    <article className="card-elevated overflow-hidden group cursor-pointer h-full flex flex-col" role="article">
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
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {property.name}
          </h3>

          <div className="mb-3">
            <Price amount={property.price} size="lg" />
          </div>

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
        </div>

        <Button
          onClick={handleViewDetails}
          className="w-full mt-4"
          aria-label={`View details for ${property.name}`}
        >
          View Details
        </Button>
      </div>
    </article>
  );
}
