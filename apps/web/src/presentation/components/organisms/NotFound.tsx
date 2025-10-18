'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useDictionary, useLocale } from '../../../i18n/client';

export interface NotFoundProps {
  title?: string;
  message?: string;
  showSearchButton?: boolean;
}

export const NotFound = ({ 
  title,
  message,
}: NotFoundProps) => {
  const dict = useDictionary();
  const lang = useLocale();
  
  const displayTitle = title || dict.notFound.title;
  const displayMessage = message || dict.notFound.message;
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
          {dict.notFound.code}
        </h1>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {displayTitle}
        </h2>
        
        <p className="text-secondary mb-8">
          {displayMessage}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${lang}/properties`}>
            <Button className="w-full sm:w-auto">
              <Icon icon={Home} size="sm" className="mr-2" />
              {dict.notFound.backToProperties}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

