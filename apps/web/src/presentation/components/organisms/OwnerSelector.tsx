'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDictionary } from '@/i18n/client';
import { Owner, CreateOwnerDto } from '@/domain/entities/Owner';
import { OwnerFormModal } from './OwnerFormModal';
import { Button } from '@/presentation/components/atoms/Button';
import { Label } from '@/presentation/components/atoms/Label';
import { Autocomplete, AutocompleteOption } from '@/presentation/components/molecules/Autocomplete';
import { Container } from '@/infrastructure/di/Container';
import { GetOwnersUseCase } from '@/application/use-cases/GetOwnersUseCase';
import { CreateOwnerUseCase } from '@/application/use-cases/CreateOwnerUseCase';

interface OwnerSelectorProps {
  selectedOwnerId: string;
  onOwnerChange: (ownerId: string) => void;
  error?: string;
}

export function OwnerSelector({
  selectedOwnerId,
  onOwnerChange,
  error,
}: OwnerSelectorProps) {
  const dict = useDictionary();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const container = Container.getInstance();
  const getOwnersUseCase = container.get<GetOwnersUseCase>('GetOwnersUseCase');
  const createOwnerUseCase = container.get<CreateOwnerUseCase>('CreateOwnerUseCase');

  useEffect(() => {
    loadOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOwners = async (search?: string) => {
    setIsLoading(true);
    try {
      const result = await getOwnersUseCase.execute(1, 100, search);
      setOwners(result.owners);
    } catch (error) {
      console.error('Error loading owners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ownerOptions: AutocompleteOption[] = useMemo(() => {
    return owners.map((owner) => ({
      value: owner.idOwner,
      label: owner.name,
      description: owner.address,
    }));
  }, [owners]);

  const handleCreateOwner = async (data: CreateOwnerDto) => {
    try {
      const newOwner = await createOwnerUseCase.execute(data);
      setOwners([newOwner, ...owners]);
      onOwnerChange(newOwner.idOwner);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating owner:', error);
      throw error;
    }
  };

  return (
    <div>
      <Label required className="mb-2">
        {dict.propertyForm?.owner || 'Owner'}
      </Label>
      
      <div className="flex gap-2">
        <Autocomplete
          options={ownerOptions}
          value={selectedOwnerId}
          onChange={onOwnerChange}
          onSearch={loadOwners}
          placeholder={dict.propertyForm?.selectOwner || 'Search and select an owner...'}
          emptyMessage="No owners found"
          loading={isLoading}
          error={!!error}
          className="flex-1"
        />

        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="whitespace-nowrap"
          title={dict.propertyForm?.createNewOwner || 'Create New Owner'}
        >
          <Plus className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">
            {dict.propertyForm?.createNewOwner || 'New'}
          </span>
        </Button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <OwnerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOwner}
      />
    </div>
  );
}

