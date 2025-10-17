import { PropertyRepository } from '../../domain/repositories/PropertyRepository';
import { PropertyRepositoryImpl } from '../repositories/PropertyRepositoryImpl';
import { PropertyService } from '../../application/interfaces/PropertyService';
import { PropertyServiceImpl } from '../../application/services/PropertyServiceImpl';
import { HttpClient, HttpClientConfig } from '../http/HttpClient';
import { PropertyApiClient } from '../api/PropertyApiClient';

// Dependency Injection Container - Enhanced implementation
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
