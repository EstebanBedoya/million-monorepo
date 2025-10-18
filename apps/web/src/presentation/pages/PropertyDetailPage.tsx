'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MockPropertyType } from '../../domain/schemas/property.schema';
import { PropertyDetailSkeleton } from '../components/molecules/PropertyDetailSkeleton';
import { NotFound } from '../components/organisms/NotFound';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { ArrowLeft, Edit2, Trash2, Calendar, DollarSign, MapPin, Home } from 'lucide-react';
import { Image } from '../components/atoms/Image';
import { Badge } from '../components/atoms/Badge';
import { Price } from '../components/atoms/Price';
import { LocationInfo } from '../components/molecules/LocationInfo';
import { PropertyDetails } from '../components/molecules/PropertyDetails';
import { PropertyFormModal, PropertyFormData } from '../components/organisms/PropertyFormModal';
import { ConfirmDialog } from '../components/atoms/ConfirmDialog';
import { useAppDispatch } from '../../store/hooks';
import { updateProperty, deleteProperty, SerializableProperty } from '../../store/slices/propertySlice';
import { PropertyStatus, PropertyType, AreaUnit } from '../../domain/entities/Property';

export interface PropertyDetailPageProps {
  id: string;
}

export const PropertyDetailPage = ({ id }: PropertyDetailPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [property, setProperty] = useState<MockPropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SerializableProperty | null>(null);

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

  const handleEdit = useCallback(() => {
    if (!property) return;

    const serializableProperty: SerializableProperty = {
      id: property.id,
      name: property.name,
      description: property.name,
      price: property.price,
      currency: 'USD',
      location: `${property.address}, ${property.city}`,
      propertyType: property.propertyType as PropertyType || PropertyType.HOUSE,
      area: property.area || 0,
      areaUnit: property.areaUnit === 'sqft' ? AreaUnit.SQFT : AreaUnit.M2,
      features: [],
      images: property.image ? [property.image] : [],
      status: PropertyStatus.AVAILABLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    };
    
    setSelectedProperty(serializableProperty);
    setIsEditModalOpen(true);
  }, [property]);

  const handleDelete = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = async (data: PropertyFormData) => {
    if (!property) return;

    try {
      await dispatch(updateProperty({
        id: property.id,
        data: {
          name: data.name,
          description: `${data.name} located at ${data.address}, ${data.city}`,
          price: data.price,
          currency: 'USD',
          location: `${data.address}, ${data.city}`,
          propertyType: data.propertyType || 'house',
          area: data.area || 0,
          areaUnit: data.areaUnit === 'sqft' ? 'sqft' : 'm2',
          features: [],
          images: data.image ? [data.image] : [],
          status: 'available',
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
        },
      })).unwrap();

      // Refresh property data
      const response = await fetch(`/api/mock/properties/${id}`);
      if (response.ok) {
        const updatedData = await response.json();
        setProperty(updatedData);
      }

      setIsEditModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Failed to update property:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!property) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteProperty(property.id)).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Failed to delete property:', error);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (notFound || !property) {
    return <NotFound />;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="-ml-2"
              aria-label="Go back to properties list"
            >
              <Icon icon={ArrowLeft} size="sm" className="mr-2" />
              Back to Properties
            </Button>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h1 className="hidden sm:block text-lg font-semibold text-foreground">
              Property Details
            </h1>
          </div>

           <div className="flex items-center gap-2">
             <Button
               variant="outline"
               onClick={handleEdit}
               aria-label="Edit property"
             >
               <Icon icon={Edit2} size="sm" className="mr-2" />
               Edit
             </Button>

             <Button
               variant="outline"
               onClick={handleDelete}
               className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:hover:border-red-900"
               aria-label="Delete property"
             >
               <Icon icon={Trash2} size="sm" className="mr-2" />
               Delete
             </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {property.name}
                </h2>
                {property.propertyType && (
                  <Badge variant="secondary" className="text-sm">
                    {property.propertyType}
                  </Badge>
                )}
              </div>

              <div className="relative h-[350px] md:h-[450px] rounded-lg overflow-hidden bg-secondary/10 mb-6">
                <Image
                  src={property.image || '/placeholder-property.jpg'}
                  alt={property.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  fallbackSrc="/placeholder-property.jpg"
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={DollarSign} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">Price</p>
                     <Price amount={property.price} size="lg" />
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={MapPin} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">Location</p>
                     <p className="font-medium text-foreground">{property.city}</p>
                     <p className="text-sm text-secondary">{property.address}</p>
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={Home} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">Property Type</p>
                     <p className="font-medium text-foreground">{property.propertyType || 'N/A'}</p>
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={Calendar} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">Property ID</p>
                     <p className="font-medium text-foreground font-mono text-sm">{property.id}</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Property Specifications
              </h3>
              <PropertyDetails
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                areaUnit={property.areaUnit}
                className="p-4 bg-background border border-border rounded-lg"
              />
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Additional Information
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">Full Address</dt>
                  <dd className="font-medium text-foreground">{property.address}, {property.city}</dd>
                </div>

                {property.bedrooms !== undefined && (
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">Bedrooms</dt>
                    <dd className="font-medium text-foreground">{property.bedrooms}</dd>
                  </div>
                )}

                {property.bathrooms !== undefined && (
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">Bathrooms</dt>
                    <dd className="font-medium text-foreground">{property.bathrooms}</dd>
                  </div>
                )}

                {property.area && (
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">Total Area</dt>
                    <dd className="font-medium text-foreground">{property.area} {property.areaUnit || 'm²'}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card-elevated p-6 sticky top-8 space-y-6">
              <div>
                 <h3 className="text-lg font-semibold text-foreground mb-4">
                   Quick Actions
                 </h3>
                 <div className="space-y-3">
                   <Button 
                     onClick={handleEdit}
                     className="w-full"
                     aria-label="Edit property"
                   >
                     <Icon icon={Edit2} size="sm" className="mr-2" />
                     Edit Property
                   </Button>
 
                   <Button 
                     onClick={handleDelete}
                     variant="outline" 
                     className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:hover:border-red-900"
                     aria-label="Delete property"
                   >
                     <Icon icon={Trash2} size="sm" className="mr-2" />
                     Delete Property
                   </Button>
                 </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Summary
                </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between py-2">
                     <span className="text-sm text-secondary">Status</span>
                     <Badge variant="secondary">
                       Active
                     </Badge>
                   </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">Price</span>
                    <span className="font-semibold text-foreground">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">Location</span>
                    <span className="font-medium text-foreground text-right">{property.city}</span>
                  </div>

                  {property.area && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">Area</span>
                      <span className="font-medium text-foreground">{property.area} {property.areaUnit || 'm²'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">Type</span>
                    <span className="font-medium text-foreground">{property.propertyType || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PropertyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleFormSubmit}
        property={selectedProperty}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Property"
        message={`Are you sure you want to delete "${property?.name}"? This action cannot be undone and you will be redirected to the properties list.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
