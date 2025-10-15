'use client';

export function PropertyCardSkeleton() {
  return (
    <div className="card-elevated overflow-hidden animate-pulse" role="status" aria-label="Loading property">
      {/* Image skeleton */}
      <div className="h-64 bg-secondary/10" />

      {/* Content skeleton */}
      <div className="p-6">
        {/* Price skeleton */}
        <div className="mb-3">
          <div className="h-8 bg-secondary/20 rounded w-32" />
        </div>

        {/* Title skeleton */}
        <div className="h-6 bg-secondary/20 rounded w-3/4 mb-2" />

        {/* Location skeleton */}
        <div className="flex items-start gap-2 mb-4">
          <div className="w-5 h-5 bg-secondary/20 rounded flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="h-4 bg-secondary/20 rounded w-full mb-2" />
            <div className="h-4 bg-secondary/20 rounded w-24" />
          </div>
        </div>

        {/* Details skeleton */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="h-4 bg-secondary/20 rounded w-16" />
          <div className="h-4 bg-secondary/20 rounded w-16" />
          <div className="h-4 bg-secondary/20 rounded w-20" />
        </div>
      </div>
      
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PropertyListSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

