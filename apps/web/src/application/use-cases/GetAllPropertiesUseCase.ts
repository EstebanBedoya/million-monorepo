import { Property } from '../../domain/entities/Property';
import { PropertyRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/PropertyRepository';

// Use Case for getting all properties with pagination
export class GetAllPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<Property>> {
    // Simple business logic - no complex operations
    const properties = await this.propertyRepository.findAll();
    
    // Simple pagination logic
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = properties.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: properties.length,
        totalPages: Math.ceil(properties.length / limit),
        hasNext: endIndex < properties.length,
        hasPrev: page > 1
      }
    };
  }
}
