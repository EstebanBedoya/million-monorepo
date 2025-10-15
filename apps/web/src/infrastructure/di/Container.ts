import { PropertyRepository } from '../../domain/repositories/PropertyRepository';
import { PropertyRepositoryImpl } from '../repositories/PropertyRepositoryImpl';
import { PropertyService } from '../../application/interfaces/PropertyService';
import { PropertyServiceImpl } from '../../application/services/PropertyServiceImpl';

// Dependency Injection Container - Simple implementation
export class Container {
  private static instance: Container;
  private services: Map<string, unknown> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeServices(): void {
    // Register repositories
    this.services.set('PropertyRepository', new PropertyRepositoryImpl());
    
    // Register services
    const propertyRepository = this.services.get('PropertyRepository') as PropertyRepository;
    this.services.set('PropertyService', new PropertyServiceImpl(propertyRepository));
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }
}
