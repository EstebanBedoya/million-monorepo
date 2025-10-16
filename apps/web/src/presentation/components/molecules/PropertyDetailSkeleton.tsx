'use client';

import { Skeleton } from '../atoms/Skeleton';

export const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button and breadcrumbs skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-20 mb-4" animation="wave" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" animation="wave" />
            <Skeleton className="h-4 w-2" animation="wave" />
            <Skeleton className="h-4 w-16" animation="wave" />
            <Skeleton className="h-4 w-2" animation="wave" />
            <Skeleton className="h-4 w-24" animation="wave" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image skeleton */}
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-secondary/10">
              <Skeleton className="w-full h-full" animation="wave" />
              {/* Property type badge skeleton */}
              <div className="absolute top-4 left-4">
                <Skeleton className="h-6 w-16 rounded-full" animation="wave" />
              </div>
            </div>

            {/* Property title and price skeleton */}
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" animation="wave" />
              <div className="mb-6">
                <Skeleton className="h-8 w-32 mb-3" animation="wave" />
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 mt-1" animation="wave" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" animation="wave" />
                    <Skeleton className="h-4 w-1/2" animation="wave" />
                  </div>
                </div>
              </div>

              {/* Property details skeleton */}
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" animation="wave" />
                    <Skeleton className="h-4 w-16" animation="wave" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" animation="wave" />
                    <Skeleton className="h-4 w-16" animation="wave" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" animation="wave" />
                    <Skeleton className="h-4 w-16" animation="wave" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" animation="wave" />
                    <Skeleton className="h-4 w-16" animation="wave" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description section skeleton */}
            <div className="card-elevated p-6">
              <Skeleton className="h-6 w-32 mb-4" animation="wave" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" animation="wave" />
                <Skeleton className="h-4 w-full" animation="wave" />
                <Skeleton className="h-4 w-3/4" animation="wave" />
                <Skeleton className="h-4 w-5/6" animation="wave" />
              </div>
            </div>

            {/* Property details section skeleton */}
            <div className="card-elevated p-6">
              <Skeleton className="h-6 w-32 mb-4" animation="wave" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border-b border-border pb-3">
                    <Skeleton className="h-3 w-20 mb-1" animation="wave" />
                    <Skeleton className="h-4 w-24" animation="wave" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 sticky top-8">
              <div className="mb-6">
                <Skeleton className="h-8 w-32" animation="wave" />
              </div>

              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                    <Skeleton className="h-4 w-20" animation="wave" />
                    <Skeleton className="h-4 w-16" animation="wave" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Skeleton className="h-12 w-full" animation="wave" />
                <Skeleton className="h-12 w-full" animation="wave" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

