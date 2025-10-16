'use client';

import { useState } from 'react';
import { PropertyDetailSkeleton } from './PropertyDetailSkeleton';
import { Skeleton } from '../atoms/Skeleton';
import { Button } from '../atoms/Button';

export const SkeletonDemo = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Skeleton Loading Demo</h2>
        
        <div className="mb-6 space-y-4">
          <Button 
            onClick={() => setShowSkeleton(!showSkeleton)}
            className="mb-4"
          >
            {showSkeleton ? 'Hide' : 'Show'} Property Detail Skeleton
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Pulse Animation</h3>
              <Skeleton className="h-4 w-full" animation="pulse" />
              <Skeleton className="h-4 w-3/4" animation="pulse" />
              <Skeleton className="h-4 w-1/2" animation="pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Wave Animation</h3>
              <Skeleton className="h-4 w-full" animation="wave" />
              <Skeleton className="h-4 w-3/4" animation="wave" />
              <Skeleton className="h-4 w-1/2" animation="wave" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">No Animation</h3>
              <Skeleton className="h-4 w-full" animation="none" />
              <Skeleton className="h-4 w-3/4" animation="none" />
              <Skeleton className="h-4 w-1/2" animation="none" />
            </div>
          </div>
        </div>

        {showSkeleton && (
          <div className="border border-border rounded-lg overflow-hidden">
            <PropertyDetailSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};
