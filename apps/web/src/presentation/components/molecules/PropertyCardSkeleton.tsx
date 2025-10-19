'use client';

import { Skeleton } from '../atoms/Skeleton';

export interface PropertyCardSkeletonProps {
  className?: string;
}

export function PropertyCardSkeleton({ className }: PropertyCardSkeletonProps) {
  return (
    <div className={`card-elevated overflow-hidden animate-pulse ${className}`} role="status" aria-label="Loading property">
      {/* Image skeleton */}
      <Skeleton className="h-64" />

      {/* Content skeleton */}
      <div className="p-6">
        {/* Price skeleton */}
        <div className="mb-3">
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Location skeleton */}
        <div className="flex items-start gap-2 mb-4">
          <Skeleton className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Details skeleton */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface PropertyListSkeletonProps {
  count?: number;
  className?: string;
}

export function PropertyListSkeleton({ count = 12, className }: PropertyListSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
