'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyDetailSkeleton } from '../components/molecules/PropertyDetailSkeleton';
import { NotFound } from '../components/organisms/NotFound';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { ArrowLeft, Edit2, Trash2, Calendar, DollarSign, MapPin, Home, User, History } from 'lucide-react';
import { Badge } from '../components/atoms/Badge';
import { Price } from '../components/atoms/Price';
import { Image } from '../components/atoms/Image';
import { PropertyFormModal, PropertyFormData } from '../components/organisms/PropertyFormModal';
import { ConfirmDialog } from '../components/atoms/ConfirmDialog';
import { ImageCarousel } from '../components/molecules/ImageCarousel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProperty, deleteProperty, fetchPropertyById, SerializableProperty } from '../../store/slices/propertySlice';
import { PropertyType, AreaUnit } from '../../domain/entities/Property';

export interface PropertyDetailPageProps {
  id: string;
}

export const PropertyDetailPage = ({ id }: PropertyDetailPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Use Redux selectors instead of local state
  const { property, isLoading, error } = useAppSelector(state => ({
    property: state.properties.selectedProperty,
    isLoading: state.properties.loading,
    error: state.properties.error
  }));
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SerializableProperty | null>(null);

  useEffect(() => {
    // Use Redux action instead of direct fetch
    dispatch(fetchPropertyById(id));
  }, [dispatch, id]);

  const handleBack = () => {
    router.push('/');
  };

  const handleEdit = useCallback(() => {
    if (!property) return;

    const serializableProperty: SerializableProperty = {
      id: property.id,
      name: property.name,
      description: property.description,
      price: property.price,
      currency: property.currency,
      location: property.location,
      propertyType: property.propertyType as PropertyType || PropertyType.HOUSE,
      area: property.area || 0,
      areaUnit: property.areaUnit === 'sqft' ? AreaUnit.SQFT : AreaUnit.M2,
      features: property.features,
      images: property.images,
      status: property.status,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
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
          description: `${data.name} located at ${data.address}`,
          price: data.price,
          currency: 'USD',
          location: data.address,
          propertyType: 'house',
          area: 0,
          areaUnit: 'm2',
          features: [],
          images: data.image ? [data.image] : [],
          status: 'available',
        },
      })).unwrap();

      // Refresh property data using Redux
      dispatch(fetchPropertyById(id));

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

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return <NotFound />;
  }

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

              <div className="mb-6">
                <ImageCarousel
                  images={property.images || []}
                  alt={property.name}
                  className="h-[350px] md:h-[450px]"
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
                     <p className="font-medium text-foreground">{property.location}</p>
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
                Additional Information
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">Full Address</dt>
                  <dd className="font-medium text-foreground">{property.location}</dd>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">Property Code</dt>
                  <dd className="font-medium text-foreground">{property.id}</dd>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">Year Built</dt>
                  <dd className="font-medium text-foreground">{property.year || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Owner Information Section */}
            {property.owner && (
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <Icon icon={User} size="sm" className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Property Owner
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center">
                      {property.owner.photo ? (
                        <Image
                          src={property.owner.photo}
                          alt={property.owner.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          fallbackSrc="/placeholder-property.jpg"
                        />
                      ) : (
                        <Icon icon={User} size="sm" className="text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{property.owner.name}</p>
                      <p className="text-sm text-secondary">Owner ID: {property.owner.idOwner}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">Owner Address</dt>
                    <dd className="font-medium text-foreground">{property.owner.address}</dd>
                  </div>

                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">Birthday</dt>
                    <dd className="font-medium text-foreground">
                      {property.owner.birthday ? new Date(property.owner.birthday).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Traces Section */}
            {property.traces && property.traces.length > 0 && (
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <Icon icon={History} size="sm" className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Transaction History
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {property.traces.map((trace, index) => (
                    <div key={trace.idPropertyTrace || index} className="p-4 bg-background rounded-lg border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <dt className="text-sm text-secondary mb-1">Transaction ID</dt>
                          <dd className="font-medium text-foreground text-sm">{trace.idPropertyTrace}</dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">Sale Date</dt>
                          <dd className="font-medium text-foreground">
                            {trace.dateSale ? new Date(trace.dateSale).toLocaleDateString() : 'N/A'}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">Value</dt>
                          <dd className="font-medium text-foreground">
                            ${trace.value?.toLocaleString() || 'N/A'}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">Tax</dt>
                          <dd className="font-medium text-foreground">
                            ${trace.tax?.toLocaleString() || 'N/A'}
                          </dd>
                        </div>
                      </div>
                      
                      {trace.name && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <dt className="text-sm text-secondary mb-1">Associated Name</dt>
                          <dd className="font-medium text-foreground">{trace.name}</dd>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <span className="font-medium text-foreground text-right">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">Type</span>
                    <span className="font-medium text-foreground">{property.propertyType || 'N/A'}</span>
                  </div>

                  {property.year && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">Year</span>
                      <span className="font-medium text-foreground">{property.year}</span>
                    </div>
                  )}

                  {property.owner && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">Owner</span>
                      <span className="font-medium text-foreground text-right">{property.owner.name}</span>
                    </div>
                  )}

                  {property.traces && property.traces.length > 0 && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">Transactions</span>
                      <span className="font-medium text-foreground">{property.traces.length}</span>
                    </div>
                  )}
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
