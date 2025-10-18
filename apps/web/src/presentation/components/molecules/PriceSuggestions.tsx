'use client';

import { Button } from '../atoms/Button';
import { cn } from '../../../utils/cn';

export interface PriceSuggestionsProps {
  onSelect: (min: number, max: number) => void;
  className?: string;
}

const PRICE_RANGES = [
  { label: 'Under $200M', min: 0, max: 200000000 },
  { label: '$200M - $300M', min: 200000000, max: 300000000 },
  { label: '$300M - $400M', min: 300000000, max: 400000000 },
  { label: '$400M - $500M', min: 400000000, max: 500000000 },
  { label: '$500M - $600M', min: 500000000, max: 600000000 },
  { label: '$600M - $800M', min: 600000000, max: 800000000 },
  { label: '$800M+', min: 800000000, max: 1000000000 },
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
