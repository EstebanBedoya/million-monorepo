'use client';

import { Search } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Icon } from '../atoms/Icon';

export interface SearchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder,
  className 
}: SearchInputProps) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={<Icon icon={Search} size="md" />}
        className="pl-10"
      />
    </div>
  );
};
