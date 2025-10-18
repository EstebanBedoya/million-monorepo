import { PropertyRepository } from '@/domain/repositories/PropertyRepository';
import { PropertyRepositoryImpl } from '@/infrastructure/repositories/PropertyRepositoryImpl';
import { PropertyServiceImpl } from '@/application/services/PropertyServiceImpl';
import { HttpClient, HttpClientConfig } from '@/infrastructure/http/HttpClient';
import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';

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
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
      retries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
      retryDelay: 1000, // 1 second
    };

    // Register HTTP client (singleton)
    this.services.set('HttpClient', new HttpClient(httpConfig));
    
    // Register API client
    const httpClient = this.services.get('HttpClient') as HttpClient;
    this.services.set('PropertyApiClient', new PropertyApiClient(httpClient));
    
    // Register repository with dependencies
    const propertyApiClient = this.services.get('PropertyApiClient') as PropertyApiClient;
    this.services.set('PropertyRepository', new PropertyRepositoryImpl(propertyApiClient));
    
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
