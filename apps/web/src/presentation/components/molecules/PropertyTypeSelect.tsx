'use client';

import { Select } from '../atoms/Select';
import { Label } from '../atoms/Label';

export interface PropertyTypeSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' }
];

export const PropertyTypeSelect = ({ 
  id, 
  label, 
  value, 
  onChange, 
  className 
}: PropertyTypeSelectProps) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by property type"
      >
        {propertyTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </Select>
    </div>
  );
};
