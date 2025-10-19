'use client';

import { Home, Building, Maximize } from 'lucide-react';
import { Icon } from '../atoms/Icon';

export interface PropertyDetailsProps {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  className?: string;
}

export const PropertyDetails = ({ 
  bedrooms, 
  bathrooms, 
  area, 
  areaUnit = 'm²',
  className 
}: PropertyDetailsProps) => {
  const hasDetails = bedrooms || bathrooms || area;

  if (!hasDetails) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 pt-4 border-t border-border ${className}`}>
      {bedrooms && (
        <div className="flex items-center gap-1.5" title={`${bedrooms} Bedrooms`}>
          <Icon icon={Home} size="sm" className="text-secondary" />
          <span className="text-sm text-foreground font-medium">
            {bedrooms} <span className="text-secondary font-normal">bd</span>
          </span>
        </div>
      )}
      
      {bathrooms && (
        <div className="flex items-center gap-1.5" title={`${bathrooms} Bathrooms`}>
          <Icon icon={Building} size="sm" className="text-secondary" />
          <span className="text-sm text-foreground font-medium">
            {bathrooms} <span className="text-secondary font-normal">ba</span>
          </span>
        </div>
      )}
      
      {area && (
        <div className="flex items-center gap-1.5" title={`${area} ${areaUnit}`}>
          <Icon icon={Maximize} size="sm" className="text-secondary" />
          <span className="text-sm text-foreground font-medium">
            {area} <span className="text-secondary font-normal">{areaUnit}</span>
          </span>
        </div>
      )}
    </div>
  );
};
