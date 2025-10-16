'use client';

import { MapPin } from 'lucide-react';
import { Icon } from '../atoms/Icon';

export interface LocationInfoProps {
  address: string;
  city: string;
  className?: string;
}

export const LocationInfo = ({ address, city, className }: LocationInfoProps) => {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <Icon 
        icon={MapPin} 
        size="md" 
        className="text-secondary flex-shrink-0 mt-0.5" 
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-secondary line-clamp-2">
          {address}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5">
          {city}
        </p>
      </div>
    </div>
  );
};
