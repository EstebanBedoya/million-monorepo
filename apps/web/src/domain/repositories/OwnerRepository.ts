import { Owner } from '@/domain/entities/Owner';

export interface PaginatedOwners {
  owners: Owner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OwnerRepository {
  findAll(page?: number, limit?: number, search?: string): Promise<PaginatedOwners>;
  findById(id: string): Promise<Owner | null>;
  create(data: {
    name: string;
    address: string;
    photo?: string;
    birthday: string;
  }): Promise<Owner>;
  update(id: string, data: {
    name?: string;
    address?: string;
    photo?: string;
    birthday?: string;
  }): Promise<Owner>;
  delete(id: string): Promise<void>;
}

