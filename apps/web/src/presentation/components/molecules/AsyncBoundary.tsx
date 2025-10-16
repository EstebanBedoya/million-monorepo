'use client';

import { ReactNode } from 'react';
import { PropertyListSkeleton } from './PropertyCardSkeleton';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

export interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  skeletonCount?: number;
  className?: string;
}

export function AsyncBoundary({
  children,
  loading = false,
  error = null,
  isEmpty = false,
  emptyTitle,
  emptyMessage,
  onRetry,
  onClearFilters,
  skeletonCount = 12,
  className
}: AsyncBoundaryProps) {
  // Show loading state
  if (loading) {
    return <PropertyListSkeleton count={skeletonCount} className={className} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <EmptyState 
        title={emptyTitle}
        message={emptyMessage}
        onReset={onClearFilters}
        className={className}
      />
    );
  }

  // Show content
  return <>{children}</>;
}
