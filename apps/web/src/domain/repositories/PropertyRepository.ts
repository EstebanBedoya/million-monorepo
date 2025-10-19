import { Property } from '../entities/Property';
/**
 * PropertyRepository defines the domain contract for data access and manipulation of Property entities.
 * 
 * This interface isolates the core business from infrastructure implementations, enabling flexible
 * backend strategies (e.g., API, database, mock data).
 * 
 * Key responsibilities:
 * - Property retrieval by ID, status, or price range
 * - Property listing with or without pagination
 * - Property creation, update, and deletion
 * 
 * All methods return Promises to support async operations and allow for seamless infrastructure swapping.
 */

export interface PropertyRepository {
  findById(id: string): Promise<Property | null>;
  findAll(): Promise<Property[]>;
  findByStatus(status: string): Promise<Property[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]>;
  findWithPagination(options: PaginationOptions): Promise<PaginatedResult<Property>>;
  save(property: Property): Promise<Property>;
  update(property: Property): Promise<Property>;
  delete(id: string): Promise<void>;
}

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
