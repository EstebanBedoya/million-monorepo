'use client';

import { Button } from '../atoms/Button';
import { useDictionary } from '../../../i18n/client';

export interface PageNumberButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const PageNumberButton = ({ page, isActive, onClick, className }: PageNumberButtonProps) => {
  const dict = useDictionary();
  
  return (
    <Button
      onClick={onClick}
      variant={isActive ? 'primary' : 'secondary'}
      className={className}
      aria-label={`${dict.pagination.page} ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </Button>
  );
};
