'use client';

import { Button } from '../atoms/Button';
import { cn } from '../../../utils/cn';

export interface PriceSuggestionsProps {
  onSelect: (min: number, max: number) => void;
  className?: string;
}

const PRICE_RANGES = [
  { label: 'Under $100K', min: 0, max: 100000 },
  { label: '$100K - $250K', min: 100000, max: 250000 },
  { label: '$250K - $500K', min: 250000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: '$2M+', min: 2000000, max: 5000000 },
];

export const PriceSuggestions = ({ onSelect, className }: PriceSuggestionsProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-xs text-secondary mb-2">Quick select:</div>
      <div className="flex flex-wrap gap-2">
        {PRICE_RANGES.map((range, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(range.min, range.max)}
            className="text-xs"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
