'use client';

import { Select } from '../atoms/Select';
import { Label } from '../atoms/Label';
import { useDictionary } from '../../../i18n/client';

export interface PropertyTypeSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const getPropertyTypes = (dict: { filters: { propertyTypeAll: string; propertyTypeHouse: string; propertyTypeApartment: string; propertyTypeCondo: string; propertyTypeVilla: string } }) => [
  { value: '', label: dict.filters.propertyTypeAll },
  { value: 'house', label: dict.filters.propertyTypeHouse },
  { value: 'apartment', label: dict.filters.propertyTypeApartment },
  { value: 'commercial', label: dict.filters.propertyTypeCondo },
  { value: 'land', label: dict.filters.propertyTypeVilla }
];

export const PropertyTypeSelect = ({ 
  id, 
  label, 
  value, 
  onChange, 
  className 
}: PropertyTypeSelectProps) => {
  const dict = useDictionary();
  const propertyTypes = getPropertyTypes(dict);
  
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
