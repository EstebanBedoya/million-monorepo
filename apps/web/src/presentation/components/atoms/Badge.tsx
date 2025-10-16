'use client';

import { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'accent' | 'destructive';
  size?: 'sm' | 'md';
}

export const Badge = ({ 
  className, 
  variant = 'default', 
  size = 'md', 
  children, 
  ...props 
}: BadgeProps) => {
  const baseClasses = 'inline-flex items-center rounded-md font-medium';
  
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent text-white',
    destructive: 'bg-destructive text-destructive-foreground'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
