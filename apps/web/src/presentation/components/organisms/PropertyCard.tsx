'use client';

import { useRouter } from 'next/navigation';
import { Property } from '../../../domain/entities/Property';
import { Image } from '../atoms/Image';
import { Badge } from '../atoms/Badge';
import { Price } from '../atoms/Price';
import { Button } from '../atoms/Button';
import { LocationInfo } from '../molecules/LocationInfo';
import { PropertyDetails } from '../molecules/PropertyDetails';

export interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      router.push(`/properties/${property.id}`);
    }
  };

  return (
    <article className="card-elevated overflow-hidden group cursor-pointer" role="article">
      <div className="relative h-64 overflow-hidden bg-secondary/10">
        <Image
          src={property.images[0]}
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

      <div className="p-6">
        <div className="mb-3">
          <Price amount={property.price} size="xl" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.name}
        </h3>

        <LocationInfo 
          address={property.location}
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
