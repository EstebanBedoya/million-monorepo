'use client';

import { Loader2 } from 'lucide-react';
import { Icon } from './Icon';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export function Spinner({ 
  size = 'md', 
  className = '',
  label = 'Loading...'
}: SpinnerProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <Icon 
        icon={Loader2} 
        size={size}
        className={`animate-spin text-primary ${sizeClasses[size]}`}
        aria-hidden={true}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
