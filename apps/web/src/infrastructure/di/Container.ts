import { PropertyRepository } from '@/domain/repositories/PropertyRepository';
import { PropertyRepositoryImpl } from '@/infrastructure/repositories/PropertyRepositoryImpl';
import { PropertyServiceImpl } from '@/application/services/PropertyServiceImpl';
import { HttpClient, HttpClientConfig } from '@/infrastructure/http/HttpClient';
import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';
import { OwnerRepository } from '@/domain/repositories/OwnerRepository';
import { OwnerRepositoryImpl } from '@/infrastructure/repositories/OwnerRepositoryImpl';
import { OwnerApiClient } from '@/infrastructure/api/OwnerApiClient';
import { PropertyImageApiClient } from '@/infrastructure/api/PropertyImageApiClient';
import { GetOwnersUseCase } from '@/application/use-cases/GetOwnersUseCase';
import { CreateOwnerUseCase } from '@/application/use-cases/CreateOwnerUseCase';
import { CreatePropertyImageUseCase } from '@/application/use-cases/CreatePropertyImageUseCase';

/**
 * Dependency Injection Container singleton for managing application-wide services.
 * 
 * This container is responsible for:
 * - Registering and instantiating core infrastructure/services as singletons (e.g., HttpClient, API clients, repositories)
 * - Resolving dependencies during initial registration, ensuring correct instantiation order
 * - Exposing a type-safe get<T> API for consumers (presentation, application layer) to retrieve services by name
 * - Centralizing environment configuration for injected services (e.g., API base URL)
 * 
 * Usage:
 *   const container = Container.getInstance();
 *   const propertyService = container.get<PropertyService>('PropertyService');
 * 
 * Why a DI container?
 *   - Promotes modular, testable code by decoupling implementation from consumption
 *   - Enables flexible swapping of infrastructure or domain service implementations
 *   - Avoids manual wiring of dependencies throughout the application
 */

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
    // Get configuration from environment variables
    const httpConfig: HttpClientConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
      retries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
      retryDelay: 1000, // 1 second
    };

    // Register HTTP client (singleton)
    this.services.set('HttpClient', new HttpClient(httpConfig));
    
    // Register API clients
    const httpClient = this.services.get('HttpClient') as HttpClient;
    this.services.set('PropertyApiClient', new PropertyApiClient(httpClient));
    this.services.set('OwnerApiClient', new OwnerApiClient(httpClient));
    this.services.set('PropertyImageApiClient', new PropertyImageApiClient(httpClient));
    
    // Register repositories with dependencies
    const propertyApiClient = this.services.get('PropertyApiClient') as PropertyApiClient;
    this.services.set('PropertyRepository', new PropertyRepositoryImpl(propertyApiClient));
    
    const ownerApiClient = this.services.get('OwnerApiClient') as OwnerApiClient;
    this.services.set('OwnerRepository', new OwnerRepositoryImpl(ownerApiClient));
    
    // Register services
    const propertyRepository = this.services.get('PropertyRepository') as PropertyRepository;
    this.services.set('PropertyService', new PropertyServiceImpl(propertyRepository));
    
    // Register use cases
    const ownerRepository = this.services.get('OwnerRepository') as OwnerRepository;
    this.services.set('GetOwnersUseCase', new GetOwnersUseCase(ownerRepository));
    this.services.set('CreateOwnerUseCase', new CreateOwnerUseCase(ownerRepository));
    
    const propertyImageApiClient = this.services.get('PropertyImageApiClient') as PropertyImageApiClient;
    this.services.set('CreatePropertyImageUseCase', new CreatePropertyImageUseCase(propertyImageApiClient));
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }
}
