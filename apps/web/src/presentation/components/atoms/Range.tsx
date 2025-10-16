'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          'w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
          error && 'accent-destructive focus:ring-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Range.displayName = 'Range';
