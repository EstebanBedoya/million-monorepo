'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyDetailSkeleton } from '@/presentation/components/molecules/PropertyDetailSkeleton';
import { NotFound } from '@/presentation/components/organisms/NotFound';
import { Button } from '@/presentation/components/atoms/Button';
import { Icon } from '@/presentation/components/atoms/Icon';
import { ArrowLeft, Edit2, Trash2, Calendar, DollarSign, MapPin, Home, User, History } from 'lucide-react';
import { Badge } from '@/presentation/components/atoms/Badge';
import { Price } from '@/presentation/components/atoms/Price';
import { Image } from '@/presentation/components/atoms/Image';
import { PropertyFormModal, PropertyFormData } from '@/presentation/components/organisms/PropertyFormModal';
import { ConfirmDialog } from '@/presentation/components/atoms/ConfirmDialog';
import { ImageCarousel } from '@/presentation/components/molecules/ImageCarousel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProperty, deleteProperty, fetchPropertyById, SerializableProperty } from '@/store/slices/propertySlice';
import { PropertyType, AreaUnit } from '@/domain/entities/Property';
import { useDictionary, useLocale } from '@/i18n/client';

export interface PropertyDetailPageProps {
  id: string;
}

export const PropertyDetailPage = ({ id }: PropertyDetailPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dict = useDictionary();
  const lang = useLocale();
  
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
    router.push(`/${lang}/properties`);
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
      router.push(`/${lang}/properties`);
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
              {dict.propertyDetail.backToProperties}
            </Button>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h1 className="hidden sm:block text-lg font-semibold text-foreground">
              {dict.propertyDetail.propertyDetails}
            </h1>
          </div>

           <div className="flex items-center gap-2">
             <Button
               variant="outline"
               onClick={handleEdit}
               aria-label="Edit property"
             >
               <Icon icon={Edit2} size="sm" className="mr-2" />
               {dict.propertyDetail.edit}
             </Button>

             <Button
               variant="outline"
               onClick={handleDelete}
               className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:hover:border-red-900"
               aria-label="Delete property"
             >
               <Icon icon={Trash2} size="sm" className="mr-2" />
               {dict.propertyDetail.delete}
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
                     <p className="text-sm text-secondary mb-1">{dict.propertyDetail.price}</p>
                     <Price amount={property.price} size="lg" />
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={MapPin} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">{dict.propertyDetail.location}</p>
                     <p className="font-medium text-foreground">{property.location}</p>
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={Home} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">{dict.propertyDetail.propertyType}</p>
                     <p className="font-medium text-foreground">{property.propertyType || dict.propertyDetail.na}</p>
                   </div>
                 </div>
 
                 <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                   <div className="p-2 bg-secondary/50 rounded-lg">
                     <Icon icon={Calendar} size="sm" className="text-accent" />
                   </div>
                   <div>
                     <p className="text-sm text-secondary mb-1">{dict.propertyDetail.propertyId}</p>
                     <p className="font-medium text-foreground font-mono text-sm">{property.id}</p>
                   </div>
                 </div>
               </div>
            </div>


            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {dict.propertyDetail.additionalInfo}
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.fullAddress}</dt>
                  <dd className="font-medium text-foreground">{property.location}</dd>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.propertyCode}</dt>
                  <dd className="font-medium text-foreground">{property.id}</dd>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.yearBuilt}</dt>
                  <dd className="font-medium text-foreground">{property.year || dict.propertyDetail.na}</dd>
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
                    {dict.propertyDetail.ownerInfo}
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
                      <p className="text-sm text-secondary">{dict.propertyDetail.ownerId}: {property.owner.idOwner}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.ownerAddress}</dt>
                    <dd className="font-medium text-foreground">{property.owner.address}</dd>
                  </div>

                  <div className="p-4 bg-background rounded-lg border border-border">
                    <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.birthday}</dt>
                    <dd className="font-medium text-foreground">
                      {property.owner.birthday ? new Date(property.owner.birthday).toLocaleDateString() : dict.propertyDetail.na}
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
                    {dict.propertyDetail.transactionHistory}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {property.traces.map((trace, index) => (
                    <div key={trace.idPropertyTrace || index} className="p-4 bg-background rounded-lg border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.transactionId}</dt>
                          <dd className="font-medium text-foreground text-sm">{trace.idPropertyTrace}</dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.saleDate}</dt>
                          <dd className="font-medium text-foreground">
                            {trace.dateSale ? new Date(trace.dateSale).toLocaleDateString() : dict.propertyDetail.na}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.value}</dt>
                          <dd className="font-medium text-foreground">
                            ${trace.value?.toLocaleString() || dict.propertyDetail.na}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.tax}</dt>
                          <dd className="font-medium text-foreground">
                            ${trace.tax?.toLocaleString() || dict.propertyDetail.na}
                          </dd>
                        </div>
                      </div>
                      
                      {trace.name && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <dt className="text-sm text-secondary mb-1">{dict.propertyDetail.associatedName}</dt>
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
                   {dict.propertyDetail.quickActions}
                 </h3>
                 <div className="space-y-3">
                   <Button 
                     onClick={handleEdit}
                     className="w-full"
                     aria-label="Edit property"
                   >
                     <Icon icon={Edit2} size="sm" className="mr-2" />
                     {dict.propertyDetail.editProperty}
                   </Button>
 
                   <Button 
                     onClick={handleDelete}
                     variant="outline" 
                     className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:hover:border-red-900"
                     aria-label="Delete property"
                   >
                     <Icon icon={Trash2} size="sm" className="mr-2" />
                     {dict.propertyDetail.deleteProperty}
                   </Button>
                 </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {dict.propertyDetail.summary}
                </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between py-2">
                     <span className="text-sm text-secondary">{dict.propertyDetail.status}</span>
                     <Badge variant="secondary">
                       {dict.propertyDetail.active}
                     </Badge>
                   </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">{dict.propertyDetail.price}</span>
                    <span className="font-semibold text-foreground">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">{dict.propertyDetail.location}</span>
                    <span className="font-medium text-foreground text-right">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-secondary">{dict.propertyDetail.propertyType}</span>
                    <span className="font-medium text-foreground">{property.propertyType || dict.propertyDetail.na}</span>
                  </div>

                  {property.year && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">{dict.propertyDetail.yearBuilt}</span>
                      <span className="font-medium text-foreground">{property.year}</span>
                    </div>
                  )}

                  {property.owner && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">{dict.propertyDetail.owner}</span>
                      <span className="font-medium text-foreground text-right">{property.owner.name}</span>
                    </div>
                  )}

                  {property.traces && property.traces.length > 0 && (
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-secondary">{dict.propertyDetail.transactions}</span>
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
        title={dict.properties.deleteProperty}
        message={`${dict.properties.confirmDelete} "${property?.name}"? ${dict.properties.deleteWarning}`}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
