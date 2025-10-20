'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary, useLocale } from '@/i18n/client';
import { OwnerSelector } from './OwnerSelector';
import { UnsplashImageGallery } from './UnsplashImageGallery';
import { Button } from '@/presentation/components/atoms/Button';
import { Input } from '@/presentation/components/atoms/Input';
import { Label } from '@/presentation/components/atoms/Label';
import { Container } from '@/infrastructure/di/Container';
import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';
import { CreatePropertyImageUseCase } from '@/application/use-cases/CreatePropertyImageUseCase';
import { ApiError } from '@/infrastructure/errors/ApiError';

export interface PropertyFormData {
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

interface SelectedImage {
  url: string;
  enabled: boolean;
}

interface PropertyFormProps {
  mode: 'create' | 'edit';
  propertyId?: string;
  initialData?: Partial<PropertyFormData>;
  initialImages?: SelectedImage[];
}

export function PropertyForm({
  mode,
  propertyId,
  initialData,
  initialImages = [],
}: PropertyFormProps) {
  const dict = useDictionary();
  const lang = useLocale();
  const router = useRouter();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    price: initialData?.price || 0,
    codeInternal: initialData?.codeInternal || '',
    year: initialData?.year || new Date().getFullYear(),
    idOwner: initialData?.idOwner || '',
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const container = Container.getInstance();
  const propertyApiClient = container.get<PropertyApiClient>('PropertyApiClient');
  const createPropertyImageUseCase = container.get<CreatePropertyImageUseCase>('CreatePropertyImageUseCase');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        price: initialData.price || 0,
        codeInternal: initialData.codeInternal || '',
        year: initialData.year || new Date().getFullYear(),
        idOwner: initialData.idOwner || '',
      });
    }
    if (initialImages.length > 0) {
      setSelectedImages(initialImages);
    }
  }, [initialData, initialImages]);

  // Validation rules configuration
  const validationRules: Record<string, { validate: (value: string | number) => boolean; message: string }> = {
    name: {
      validate: (value: string | number) => typeof value === 'string' && !value.trim(),
      message: dict.propertyForm?.required || 'This field is required'
    },
    address: {
      validate: (value: string | number) => typeof value === 'string' && !value.trim(),
      message: dict.propertyForm?.required || 'This field is required'
    },
    price: {
      validate: (value: string | number) => typeof value === 'number' && value <= 0,
      message: dict.propertyForm?.invalidPrice || 'Price must be greater than 0'
    },
    codeInternal: {
      validate: (value: string | number) => typeof value === 'string' && !value.trim(),
      message: dict.propertyForm?.required || 'This field is required'
    },
    year: {
      validate: (value: string | number) => typeof value === 'number' && (!value || value < 1800 || value > new Date().getFullYear() + 10),
      message: `Year must be between 1800 and ${new Date().getFullYear() + 10}`
    },
    idOwner: {
      validate: (value: string | number) => typeof value === 'string' && !value,
      message: dict.propertyForm?.required || 'This field is required'
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate each field using the rules configuration
    Object.entries(validationRules).forEach(([field, rule]) => {
      const value = formData[field as keyof PropertyFormData];
      if (rule.validate(value)) {
        newErrors[field] = rule.message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Error message mapping for cleaner error handling
  const getErrorMessage = (error: unknown): string => {
    const errorMappings = {
      ApiError: (apiError: ApiError) => {
        const statusMessages = {
          400: dict.errors?.validation || 'Validation error',
          404: dict.errors?.notFound || 'Resource not found',
          500: dict.errors?.server || 'Server error. Please try again later.',
        };
        
        if (apiError.code === 'NETWORK_ERROR') {
          return dict.errors?.network || 'Network error. Please check your connection.';
        }
        
        return statusMessages[apiError.status as keyof typeof statusMessages] || 
               apiError.message || 
               dict.errors?.generic || 'An error occurred';
      },
      AxiosError: (axiosError: { response?: { data?: { error?: { message?: string } } } }) => {
        const backendError = axiosError.response?.data?.error?.message;
        return backendError || dict.errors?.generic || 'An error occurred';
      },
      Error: (err: Error) => err.message,
      default: () => dict.errors?.generic || 'An error occurred'
    };

    if (error instanceof ApiError) {
      return errorMappings.ApiError(error);
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      return errorMappings.AxiosError(error as { response?: { data?: { error?: { message?: string } } } });
    }
    
    if (error instanceof Error) {
      return errorMappings.Error(error);
    }
    
    return errorMappings.default();
  };

  // Property operations mapping
  const propertyOperations = {
    create: () => propertyApiClient.createProperty({
      name: formData.name,
      address: formData.address,
      price: formData.price,
      codeInternal: formData.codeInternal,
      year: formData.year,
      idOwner: formData.idOwner,
    }),
    edit: () => {
      if (!propertyId) {
        throw new Error('Property ID is required for edit mode');
      }
      return propertyApiClient.updateProperty(propertyId, {
        name: formData.name,
        address: formData.address,
        price: formData.price,
        codeInternal: formData.codeInternal,
        year: formData.year,
        idOwner: formData.idOwner,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Execute property operation based on mode
      const propertyOperation = propertyOperations[mode];
      if (!propertyOperation) {
        throw new Error('Invalid mode');
      }

      const savedProperty = await propertyOperation();
      const savedPropertyId = savedProperty.idProperty;

      // Handle images if any are selected
      if (selectedImages.length > 0) {
        const imagePromises = selectedImages.map(image =>
          createPropertyImageUseCase.execute({
            propertyId: savedPropertyId,
            file: image.url,
            enabled: image.enabled,
          }).catch(error => {
            console.error('Error creating image:', error);
            return null;
          })
        );
        
        await Promise.all(imagePromises);
      }

      router.push(`/${lang}/properties`);
    } catch (error) {
      console.error('Error saving property:', error);
      
      const errorMessage = getErrorMessage(error);
      const operationText = mode === 'create' 
        ? dict.propertyForm?.createError || 'Failed to create property'
        : dict.propertyForm?.updateError || 'Failed to update property';
      
      setSubmitError(`${operationText}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${lang}/properties`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {dict.propertyForm.basicInformation}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label required className="mb-2">
              {dict.propertyForm.name}
            </Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              placeholder={dict.propertyForm.namePlaceholder}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <Label required className="mb-2">
              {dict.propertyForm?.address || 'Address'}
            </Label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={!!errors.address}
              placeholder="123 Main Street, Los Angeles, CA"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          <div>
            <Label required className="mb-2">
              {dict.propertyForm?.price || 'Price'} (USD)
            </Label>
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              error={!!errors.price}
              placeholder="500000"
              min="0"
              step="1000"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <Label required className="mb-2">
              {dict.propertyForm?.codeInternal || 'Internal Code'}
            </Label>
            <Input
              type="text"
              value={formData.codeInternal}
              onChange={(e) => handleChange('codeInternal', e.target.value)}
              error={!!errors.codeInternal}
              placeholder="PROP-2025-001"
            />
            {errors.codeInternal && <p className="mt-1 text-sm text-red-500">{errors.codeInternal}</p>}
          </div>

          <div className="md:col-span-2">
            <Label required className="mb-2">
              {dict.propertyForm?.year || 'Year Built'}
            </Label>
            <Input
              type="number"
              value={formData.year || ''}
              onChange={(e) => handleChange('year', Number(e.target.value))}
              error={!!errors.year}
              placeholder={new Date().getFullYear().toString()}
              min="1800"
              max={new Date().getFullYear() + 10}
            />
            {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {dict.propertyForm?.owner || 'Owner'}
        </h3>
        <OwnerSelector
          selectedOwnerId={formData.idOwner}
          onOwnerChange={(ownerId) => handleChange('idOwner', ownerId)}
          error={errors.idOwner}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {dict.propertyForm?.images || 'Images'}
        </h3>
        <UnsplashImageGallery
          selectedImages={selectedImages}
          onImagesChange={setSelectedImages}
        />
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          variant="secondary"
          size="lg"
        >
          {dict.propertyForm?.cancel || 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          variant="primary"
          size="lg"
        >
          {dict.propertyForm?.submit || 'Save Property'}
        </Button>
      </div>
    </form>
  );
}

