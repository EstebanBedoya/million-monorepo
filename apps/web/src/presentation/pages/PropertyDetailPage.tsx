'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyDetailTemplate } from '../components/templates/PropertyDetailTemplate';
import { PropertyDetailSkeleton } from '../components/molecules/PropertyDetailSkeleton';
import { NotFound } from '../components/organisms/NotFound';

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

  return <PropertyDetailTemplate property={property} onBack={handleBack} />;
};

