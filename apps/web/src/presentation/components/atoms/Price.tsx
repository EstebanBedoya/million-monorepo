'use client';

import { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  amount: number;
  currency?: string;
  showCents?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Price = ({ 
  amount, 
  currency = 'USD', 
  showCents = false, 
  size = 'md',
  className,
  ...props 
}: PriceProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    }).format(price);
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <span
      className={cn(
        'font-semibold text-accent font-cairo',
        sizes[size],
        className
      )}
      {...props}
    >
      {formatPrice(amount)}
    </span>
  );
};
