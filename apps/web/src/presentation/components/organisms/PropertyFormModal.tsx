'use client';

import { useState, useEffect } from 'react';
import { SerializableProperty } from '../../../store/slices/propertySlice';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  property?: SerializableProperty | null;
  mode: 'create' | 'edit';
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  price: number;
  idOwner: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: 'm²' | 'sqft';
  propertyType?: string;
  image?: string;
}

export function PropertyFormModal({
  isOpen,
  onClose,
  onSubmit,
  property,
  mode,
}: PropertyFormModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    city: '',
    price: 0,
    idOwner: 'owner-001',
    bedrooms: undefined,
    bathrooms: undefined,
    area: undefined,
    areaUnit: 'm²',
    propertyType: 'House',
    image: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && property && mode === 'edit') {
      setFormData({
        name: property.name,
        address: property.location.split(',')[0] || '',
        city: property.location.split(',').slice(1).join(',').trim() || '',
        price: property.price,
        idOwner: 'owner-001',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        areaUnit: property.areaUnit === 'm2' ? 'm²' : 'sqft',
        propertyType: property.propertyType,
        image: property.images?.[0] || '',
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: '',
        address: '',
        city: '',
        price: 0,
        idOwner: 'owner-001',
        bedrooms: undefined,
        bathrooms: undefined,
        area: undefined,
        areaUnit: 'm²',
        propertyType: 'House',
        image: '',
      });
    }
    setErrors({});
  }, [isOpen, property, mode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save property' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-card shadow-xl transition-all border border-border">
          <div className="bg-card px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'create' ? 'Create New Property' : 'Edit Property'}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card px-6 py-4">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${errors.name ? 'border-red-500' : 'border-border'}`}
                    placeholder="Modern Luxury Apartment"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${errors.address ? 'border-red-500' : 'border-border'}`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${errors.city ? 'border-red-500' : 'border-border'}`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${errors.price ? 'border-red-500' : 'border-border'}`}
                    placeholder="850000"
                    min="0"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="3"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.area || ''}
                      onChange={(e) => handleChange('area', e.target.value ? Number(e.target.value) : undefined)}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="120"
                      min="0"
                    />
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => handleChange('areaUnit', e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="m²">m²</option>
                      <option value="sqft">sqft</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleChange('image', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>{mode === 'create' ? 'Create Property' : 'Save Changes'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

