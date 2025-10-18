'use client';

import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Search } from 'lucide-react';
import { useDictionary } from '../../../i18n/client';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  message,
  onReset,
  className
}: EmptyStateProps) => {
  const dict = useDictionary();
  
  const displayTitle = title || dict.properties.noProperties;
  const displayMessage = message || dict.common.noResults;
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
        {displayTitle}
      </h3>

      <p className="mb-6 max-w-md text-sm text-secondary">
        {displayMessage}
      </p>

      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          aria-label={dict.filters.clearFilters}
        >
          {dict.filters.clearFilters}
        </Button>
      )}
    </div>
  );
};