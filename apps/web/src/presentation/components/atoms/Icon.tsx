'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'aria-hidden'?: boolean;
}

export const Icon = ({ icon: IconComponent, size = 'md', className, ...props }: IconProps) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <IconComponent
      className={cn(
        sizes[size],
        'text-current',
        className
      )}
      {...props}
    />
  );
};
