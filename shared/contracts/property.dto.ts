export interface PropertyDto {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'apartment' | 'house' | 'commercial' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: 'm2' | 'sqft';
  features: string[];
  images: string[];
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListDto {
  properties: PropertyDto[];
  pagination: PaginationDto;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
