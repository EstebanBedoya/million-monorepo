'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface PageButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

export const PageButton = ({ direction, disabled, onClick, className }: PageButtonProps) => {
  const isPrev = direction === 'prev';
  const IconComponent = isPrev ? ChevronLeft : ChevronRight;
  const label = isPrev ? 'Previous page' : 'Next page';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={disabled ? 'ghost' : 'secondary'}
      className={className}
      aria-label={label}
    >
      <Icon icon={IconComponent} size="md" aria-hidden={true} />
    </Button>
  );
};
