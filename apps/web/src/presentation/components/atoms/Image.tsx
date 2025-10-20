'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { Home } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export interface ImageProps extends NextImageProps {
  fallbackSrc?: string;
}

export const Image = ({ 
  className, 
  onError,
  src,
  alt,
  ...props 
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e);
  };

  if (hasError) {
    return (
      <div className={cn('h-full relative flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 border border-slate-200/50 overflow-hidden', className)}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-slate-300 rounded-full"></div>
          <div className="absolute top-8 right-6 w-4 h-4 border border-slate-300 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-6 h-6 border border-slate-300 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border border-slate-300 rounded-full"></div>
        </div>
        
        <div className="relative flex flex-col items-center gap-3 z-10">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-slate-500" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl blur-sm opacity-50 -z-10"></div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600 mb-1">No Image Available</p>
            <p className="text-xs text-slate-400">Property photo coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      onError={handleError}
      {...props}
    />
  );
};
