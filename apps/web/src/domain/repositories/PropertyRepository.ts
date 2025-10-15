import { Property } from '../entities/Property';

// Repository interface - defines the contract for data access
export interface PropertyRepository {
  findById(id: string): Promise<Property | null>;
  findAll(): Promise<Property[]>;
  findByStatus(status: string): Promise<Property[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]>;
  save(property: Property): Promise<Property>;
  update(property: Property): Promise<Property>;
  delete(id: string): Promise<void>;
}

// Pagination interface for list operations
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
