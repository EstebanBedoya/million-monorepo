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

// Mock property interface for simplified frontend development
export interface MockPropertyDto {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  city: string;
  price: number;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: 'm²' | 'sqft';
  propertyType?: 'House' | 'Apartment' | 'Villa' | 'Condo' | 'Townhouse' | 'Studio';
}

export interface MockPropertyListDto {
  properties: MockPropertyDto[];
  pagination: PaginationDto;
}
