'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDictionary } from '@/i18n/client';
import { CreateOwnerDto } from '@/domain/entities/Owner';
import { Button } from '@/presentation/components/atoms/Button';
import { Input } from '@/presentation/components/atoms/Input';
import { Label } from '@/presentation/components/atoms/Label';

interface OwnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOwnerDto) => Promise<void>;
}

export function OwnerFormModal({
  isOpen,
  onClose,
  onSubmit,
}: OwnerFormModalProps) {
  const dict = useDictionary();
  const [formData, setFormData] = useState<CreateOwnerDto>({
    name: '',
    address: '',
    photo: '',
    birthday: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        address: '',
        photo: '',
        birthday: '',
      });
      setErrors({});
    }
  }, [isOpen]);

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
      newErrors.name = dict.propertyForm?.required || 'This field is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = dict.propertyForm?.required || 'This field is required';
    }
    if (!formData.birthday) {
      newErrors.birthday = dict.propertyForm?.required || 'This field is required';
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
      console.error('Error creating owner:', error);
      setErrors({ submit: 'Failed to create owner' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateOwnerDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-card shadow-2xl transition-all border border-border z-[10000]">
          <div className="bg-card px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {dict.ownerForm?.createTitle || 'Create New Owner'}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card px-6 py-4">
            <div className="space-y-4">
              <div>
                <Label required className="mb-2">
                  {dict.ownerForm?.name || 'Name'}
                </Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label required className="mb-2">
                  {dict.ownerForm?.address || 'Address'}
                </Label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  error={!!errors.address}
                  placeholder="123 Main St, City"
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              <div>
                <Label className="mb-2">
                  {dict.ownerForm?.photo || 'Photo URL'}
                </Label>
                <Input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => handleChange('photo', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label required className="mb-2">
                  {dict.ownerForm?.birthday || 'Birthday'}
                </Label>
                <Input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  error={!!errors.birthday}
                />
                {errors.birthday && <p className="mt-1 text-sm text-red-500">{errors.birthday}</p>}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                variant="secondary"
                size="md"
              >
                {dict.propertyForm?.cancel || 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                variant="primary"
                size="md"
              >
                {dict.propertyForm?.submit || 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

