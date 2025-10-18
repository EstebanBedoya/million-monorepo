'use client';

import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Price } from '../atoms/Price';
import { PriceSuggestions } from './PriceSuggestions';
import { useState, useEffect } from 'react';

export interface PriceRangeProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const PriceRange = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  min = 0,
  max = 1000000000,
  className
}: PriceRangeProps) => {
  const formatNumberWithCommas = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    // Don't format empty strings
    if (!numericValue) return '';
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumberFromFormatted = (value: string) => {
    // Remove commas and parse as integer
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const [localMinPrice, setLocalMinPrice] = useState(formatNumberWithCommas(minPrice.toString()));
  const [localMaxPrice, setLocalMaxPrice] = useState(formatNumberWithCommas(maxPrice.toString()));

  useEffect(() => {
    setLocalMinPrice(formatNumberWithCommas(minPrice.toString()));
  }, [minPrice]);

  useEffect(() => {
    setLocalMaxPrice(formatNumberWithCommas(maxPrice.toString()));
  }, [maxPrice]);

  const handleMinPriceChange = (value: string) => {
    // Allow only numbers and commas
    const cleanValue = value.replace(/[^\d,]/g, '');
    const formattedValue = formatNumberWithCommas(cleanValue);
    setLocalMinPrice(formattedValue);
    
    const numValue = parseNumberFromFormatted(formattedValue);
    if (numValue >= min && numValue <= max && numValue <= maxPrice) {
      onMinPriceChange(numValue);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    // Allow only numbers and commas
    const cleanValue = value.replace(/[^\d,]/g, '');
    const formattedValue = formatNumberWithCommas(cleanValue);
    setLocalMaxPrice(formattedValue);
    
    const numValue = parseNumberFromFormatted(formattedValue);
    if (numValue >= min && numValue <= max && numValue >= minPrice) {
      onMaxPriceChange(numValue);
    }
  };

  const handleSuggestionSelect = (min: number, max: number) => {
    onMinPriceChange(min);
    onMaxPriceChange(max);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <Label>Price Range</Label>
        <div className="text-sm text-accent font-medium">
          <Price amount={minPrice} size="sm" /> - <Price amount={maxPrice} size="sm" />
        </div>
      </div>

      <div className="space-y-4">
        <PriceSuggestions onSelect={handleSuggestionSelect} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="min-price" className="text-xs text-secondary mb-1 block">
              Min Price
            </Label>
            <Input
              id="min-price"
              type="text"
              value={localMinPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder={formatCurrency(min)}
              className="text-sm font-cairo"
            />
          </div>

          <div>
            <Label htmlFor="max-price" className="text-xs text-secondary mb-1 block">
              Max Price
            </Label>
            <Input
              id="max-price"
              type="text"
              value={localMaxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder={formatCurrency(max)}
              className="text-sm font-cairo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
