'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyDetailSkeleton } from '../components/molecules/PropertyDetailSkeleton';
import { NotFound } from '../components/organisms/NotFound';
import { Breadcrumbs, BreadcrumbsProps } from '../components/molecules/Breadcrumbs';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { ArrowLeft } from 'lucide-react';
import { Image } from '../components/atoms/Image';
import { Badge } from '../components/atoms/Badge';
import { Price } from '../components/atoms/Price';
import { LocationInfo } from '../components/molecules/LocationInfo';
import { PropertyDetails } from '../components/molecules/PropertyDetails';

export interface PropertyDetailPageProps {
  id: string;
}

export const PropertyDetailPage = ({ id }: PropertyDetailPageProps) => {
  const router = useRouter();
  const [property, setProperty] = useState<MockPropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(`/api/mock/properties/${id}`);
        
        if (response.status === 404) {
          setNotFound(true);
          setProperty(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        setNotFound(true);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (notFound || !property) {
    return <NotFound />;
  }

  const breadcrumbItems: BreadcrumbsProps['items'] = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/' },
    { label: property.name }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 -ml-2"
            aria-label="Go back to properties list"
          >
            <Icon icon={ArrowLeft} size="sm" className="mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-secondary/10">
              <Image
                src={property.image || '/placeholder-property.jpg'}
                alt={property.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
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

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {property?.name}
              </h1>

              <div className="mb-6">
                <Price amount={property.price} size="lg" className="mb-3" />
                <LocationInfo 
                  address={`${property.address}, ${property.city}`}
                />
              </div>

              <PropertyDetails
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                areaUnit={property.areaUnit}
                className="p-4 bg-card border border-border rounded-lg"
              />
            </div>

            <div className="card-elevated p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Description
              </h2>
              <p className="text-secondary leading-relaxed">
                This beautiful {property.propertyType?.toLowerCase() || 'property'} is located in {property.address}, {property.city}, 
                offering {property.bedrooms ? `${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}` : 'spacious living areas'} 
                {property.bathrooms ? ` and ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}` : ''}
                {property.area ? ` with ${property.area} ${property.areaUnit || 'm²'} of living space` : ''}.
                Perfect for those seeking a comfortable and elegant living experience in a prime location.
              </p>
            </div>

            <div className="card-elevated p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Property Details
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-border pb-3">
                  <dt className="text-sm text-secondary mb-1">Property ID</dt>
                  <dd className="font-medium text-foreground">{property.id}</dd>
                </div>
                
                {property.propertyType && (
                  <div className="border-b border-border pb-3">
                    <dt className="text-sm text-secondary mb-1">Property Type</dt>
                    <dd className="font-medium text-foreground">{property.propertyType}</dd>
                  </div>
                )}
                
                <div className="border-b border-border pb-3">
                  <dt className="text-sm text-secondary mb-1">Address</dt>
                  <dd className="font-medium text-foreground">{property.address}, {property.city}</dd>
                </div>

                {property.bedrooms !== undefined && (
                  <div className="border-b border-border pb-3">
                    <dt className="text-sm text-secondary mb-1">Bedrooms</dt>
                    <dd className="font-medium text-foreground">{property.bedrooms}</dd>
                  </div>
                )}

                {property.bathrooms !== undefined && (
                  <div className="border-b border-border pb-3">
                    <dt className="text-sm text-secondary mb-1">Bathrooms</dt>
                    <dd className="font-medium text-foreground">{property.bathrooms}</dd>
                  </div>
                )}

                {property.area && (
                  <div className="border-b border-border pb-3">
                    <dt className="text-sm text-secondary mb-1">Total Area</dt>
                    <dd className="font-medium text-foreground">{property.area} {property.areaUnit || 'm²'}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card-elevated p-6 sticky top-8">
              <div className="mb-6">
                <Price amount={property.price} size="xl" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-secondary">Property Type</span>
                  <span className="font-medium text-foreground">{property.propertyType || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-secondary">Location</span>
                  <span className="font-medium text-foreground">{property.city}</span>
                </div>

                {property.area && (
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-secondary">Area</span>
                    <span className="font-medium text-foreground">{property.area} {property.areaUnit || 'm²'}</span>
                  </div>
                )}
              </div>

              <Button 
                className="w-full mb-3"
                aria-label="Contact about this property"
              >
                Contact Agent
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                aria-label="Schedule a viewing"
              >
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
