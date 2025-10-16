'use client';

import { Button } from '../atoms/Button';

export interface PageNumberButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const PageNumberButton = ({ page, isActive, onClick, className }: PageNumberButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? 'primary' : 'secondary'}
      className={className}
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </Button>
  );
};
