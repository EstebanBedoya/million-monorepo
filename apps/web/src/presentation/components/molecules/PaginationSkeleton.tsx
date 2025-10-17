'use client';

import { Skeleton } from '../atoms/Skeleton';

export interface PaginationSkeletonProps {
  className?: string;
}

export function PaginationSkeleton({ className }: PaginationSkeletonProps) {
  return (
    <nav 
      className={`flex items-center justify-center gap-2 mt-8 ${className}`} 
      role="status" 
      aria-label="Loading pagination"
    >
      {/* Previous button skeleton */}
      <Skeleton className="w-10 h-10 rounded-md" />
      
      {/* Page numbers skeleton */}
      <div className="flex items-center gap-1">
        <Skeleton className="w-8 h-10 rounded-md" />
        <Skeleton className="w-8 h-10 rounded-md" />
        <Skeleton className="w-8 h-10 rounded-md" />
        <Skeleton className="w-8 h-10 rounded-md" />
        <Skeleton className="w-8 h-10 rounded-md" />
      </div>
      
      {/* Next button skeleton */}
      <Skeleton className="w-10 h-10 rounded-md" />
      
      <span className="sr-only">Loading pagination...</span>
    </nav>
  );
}
