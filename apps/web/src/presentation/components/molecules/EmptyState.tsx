'use client';

import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Search } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  className?: string;
}

export const EmptyState = ({
  title = 'No Properties Found',
  message = "We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.",
  onReset,
  className
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 rounded-full bg-secondary/10 p-4">
        <Icon icon={Search} size="lg" className="text-secondary" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="mb-6 max-w-md text-sm text-secondary">
        {message}
      </p>

      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          aria-label="Clear all filters"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};