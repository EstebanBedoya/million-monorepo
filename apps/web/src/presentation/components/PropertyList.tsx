'use client';

import { PropertyListTemplate } from './templates/PropertyListTemplate';
import { MockPropertyType } from '../../domain/schemas/property.schema';

interface PropertyListProps {
  properties: MockPropertyType[];
  onPropertyClick?: (property: MockPropertyType) => void;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export function PropertyList(props: PropertyListProps) {
  return <PropertyListTemplate {...props} />;
}
