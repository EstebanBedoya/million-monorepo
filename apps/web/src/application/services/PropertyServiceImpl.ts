import { PropertyService } from '../interfaces/PropertyService';
import { Property } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { GetPropertyUseCase } from '../use-cases/GetPropertyUseCase';
import { GetAllPropertiesUseCase } from '../use-cases/GetAllPropertiesUseCase';
import { CreatePropertyUseCase } from '../use-cases/CreatePropertyUseCase';
import { PropertyRepository } from '../../domain/repositories/PropertyRepository';

// Service implementation - orchestrates use cases
export class PropertyServiceImpl implements PropertyService {
  private getPropertyUseCase: GetPropertyUseCase;
  private getAllPropertiesUseCase: GetAllPropertiesUseCase;
  private createPropertyUseCase: CreatePropertyUseCase;

  constructor(private readonly propertyRepository: PropertyRepository) {
    this.getPropertyUseCase = new GetPropertyUseCase(propertyRepository);
    this.getAllPropertiesUseCase = new GetAllPropertiesUseCase(propertyRepository);
    this.createPropertyUseCase = new CreatePropertyUseCase(propertyRepository);
  }

  async getProperty(id: string): Promise<Property | null> {
    return await this.getPropertyUseCase.execute(id);
  }

  async getAllProperties(page?: number, limit?: number): Promise<PaginatedResult<Property>> {
    return await this.getAllPropertiesUseCase.execute({ page, limit });
  }

  async createProperty(propertyData: any): Promise<Property> {
    return await this.createPropertyUseCase.execute(propertyData);
  }

  async getAvailableProperties(): Promise<Property[]> {
    // Simple business logic
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isAvailable());
  }

  async getExpensiveProperties(): Promise<Property[]> {
    // Simple business logic
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isExpensive());
  }
}
