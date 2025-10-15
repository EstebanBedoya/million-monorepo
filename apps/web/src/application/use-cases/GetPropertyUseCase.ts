import { Property } from '../../domain/entities/Property';
import { PropertyRepository } from '../../domain/repositories/PropertyRepository';

// Use Case - Application business logic
export class GetPropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<Property | null> {
    // Simple validation
    if (!id || id.trim() === '') {
      throw new Error('Property ID is required');
    }

    return await this.propertyRepository.findById(id);
  }
}
