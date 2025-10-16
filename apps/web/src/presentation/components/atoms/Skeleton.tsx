'use client';

import { cn } from '../../../utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({ 
  className, 
  variant = 'rectangular',
  animation = 'pulse' 
}: SkeletonProps) => {
  const baseClasses = 'bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 bg-[length:200%_100%]';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_2s_infinite]',
    none: ''
  };

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        animations[animation],
        className
      )}
      role="status"
      aria-label="Loading..."
    />
  );
};
