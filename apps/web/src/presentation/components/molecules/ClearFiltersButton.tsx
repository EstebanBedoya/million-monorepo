'use client';

import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface ClearFiltersButtonProps {
  onClick: () => void;
  className?: string;
}

export const ClearFiltersButton = ({ onClick, className }: ClearFiltersButtonProps) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={`w-full lg:w-auto ${className}`}
      aria-label="Clear all filters"
    >
      <Icon icon={X} size="sm" />
      Clear All Filters
    </Button>
  );
};
