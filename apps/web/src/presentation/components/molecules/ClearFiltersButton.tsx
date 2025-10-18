'use client';

import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useDictionary } from '../../../i18n/client';

export interface ClearFiltersButtonProps {
  onClick: () => void;
  className?: string;
}

export const ClearFiltersButton = ({ onClick, className }: ClearFiltersButtonProps) => {
  const dict = useDictionary();
  
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={`w-full lg:w-auto ${className}`}
      aria-label={dict.filters.clearFilters}
    >
      <Icon icon={X} size="sm" />
      {dict.filters.clearFilters}
    </Button>
  );
};
