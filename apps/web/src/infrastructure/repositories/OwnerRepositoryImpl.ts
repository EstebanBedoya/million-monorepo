import { OwnerRepository, PaginatedOwners } from '@/domain/repositories/OwnerRepository';
import { Owner } from '@/domain/entities/Owner';
import { OwnerApiClient } from '@/infrastructure/api/OwnerApiClient';

export class OwnerRepositoryImpl implements OwnerRepository {
  private apiClient: OwnerApiClient;

  constructor(apiClient: OwnerApiClient) {
    this.apiClient = apiClient;
  }

  async findAll(page: number = 1, limit: number = 100, search?: string): Promise<PaginatedOwners> {
    try {
      const response = await this.apiClient.fetchOwners(page, limit, search);
      return {
        owners: response.owners.map(dto => Owner.create(dto)),
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Error fetching owners:', error);
      return {
        owners: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  async findById(id: string): Promise<Owner | null> {
    try {
      const dto = await this.apiClient.fetchOwnerById(id);
      return Owner.create(dto);
    } catch (error) {
      console.error('Error fetching owner by id:', error);
      return null;
    }
  }

  async create(data: {
    name: string;
    address: string;
    photo?: string;
    birthday: string;
  }): Promise<Owner> {
    try {
      const dto = await this.apiClient.createOwner(data);
      return Owner.create(dto);
    } catch (error) {
      console.error('Error creating owner:', error);
      throw error;
    }
  }

  async update(id: string, data: {
    name?: string;
    address?: string;
    photo?: string;
    birthday?: string;
  }): Promise<Owner> {
    try {
      const dto = await this.apiClient.updateOwner(id, data);
      return Owner.create(dto);
    } catch (error) {
      console.error('Error updating owner:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.deleteOwner(id);
    } catch (error) {
      console.error('Error deleting owner:', error);
      throw error;
    }
  }
}

