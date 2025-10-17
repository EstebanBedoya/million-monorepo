'use client';

import { Home } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  className?: string;
}

export function EmptyState({ 
  title = "No Properties Found",
  message = "We couldn't find any properties matching your criteria. Try adjusting your filters.",
  onReset,
  className
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`} role="status">
      {/* Icon */}
      <div className="mb-6 p-6 rounded-full bg-secondary/10">
        <Icon 
          icon={Home} 
          size="xl" 
          className="text-secondary"
          aria-hidden={true}
        />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-secondary max-w-md mb-6">
        {message}
      </p>

      {/* Reset button */}
      {onReset && (
        <Button
          onClick={onReset}
          aria-label="Clear all filters"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
