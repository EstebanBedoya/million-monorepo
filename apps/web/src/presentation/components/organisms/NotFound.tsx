'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface NotFoundProps {
  title?: string;
  message?: string;
  showSearchButton?: boolean;
}

export const NotFound = ({ 
  title = 'Property Not Found',
  message = "We couldn't find the property you're looking for. It may have been removed or is no longer available.",
}: NotFoundProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center">
            <Icon 
              icon={Search} 
              size="xl" 
              className="text-secondary"
              aria-hidden={true}
            />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {title}
        </h2>
        
        <p className="text-secondary mb-8">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/properties">
            <Button className="w-full sm:w-auto">
              <Icon icon={Home} size="sm" className="mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

