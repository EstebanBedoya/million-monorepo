export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OwnerDto {
  idOwner: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

export interface OwnerListDto {
  owners: OwnerDto[];
  pagination: PaginationDto;
}

export interface CreateOwnerDto {
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export interface UpdateOwnerDto {
  name?: string;
  address?: string;
  photo?: string;
  birthday?: string;
}

export interface PropertyDto {
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export interface PropertyDetailDto extends PropertyDto {
  owner?: OwnerDto;
  images?: PropertyImageDto[];
  traces?: PropertyTraceDto[];
}

export interface PropertyListDto {
  properties: PropertyDto[];
  pagination: PaginationDto;
}

export interface CreatePropertyDto {
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export interface UpdatePropertyDto {
  name?: string;
  address?: string;
  price?: number;
  codeInternal?: string;
  year?: number;
  idOwner?: string;
}

export interface PropertyImageDto {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface PropertyImageListDto {
  images: PropertyImageDto[];
  pagination: PaginationDto;
}

export interface CreatePropertyImageDto {
  file: string;
  enabled?: boolean;
}

export interface UpdatePropertyImageDto {
  file?: string;
  enabled?: boolean;
}

export interface PropertyTraceDto {
  idPropertyTrace: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  idProperty: string;
}

export interface PropertyTraceListDto {
  traces: PropertyTraceDto[];
  pagination: PaginationDto;
}

export interface CreatePropertyTraceDto {
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

export interface UpdatePropertyTraceDto {
  dateSale?: string;
  name?: string;
  value?: number;
  tax?: number;
}

// Legacy interfaces for backward compatibility
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
