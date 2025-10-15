# Clean Architecture Implementation

This project demonstrates Clean Architecture principles applied to a Next.js 14 application. The architecture is organized in layers with clear separation of concerns.

## Architecture Layers

### 1. Domain Layer (`/src/domain/`)
Contains the core business logic and entities:
- **Entities**: `Property.ts` - Core business objects with business rules
- **Value Objects**: `Price.ts` - Immutable objects with validation
- **Repositories**: `PropertyRepository.ts` - Interfaces for data access

### 2. Application Layer (`/src/application/`)
Contains use cases and application services:
- **Use Cases**: Business operations like `GetPropertyUseCase`, `CreatePropertyUseCase`
- **Services**: `PropertyService` - Application service interface
- **Interfaces**: Contracts for external dependencies

### 3. Infrastructure Layer (`/src/infrastructure/`)
Handles external concerns:
- **Repositories**: `PropertyRepositoryImpl` - Concrete data access implementation
- **API Clients**: `PropertyApiClient` - External API communication
- **Mappers**: `PropertyMapper` - Data transformation
- **DI Container**: `Container` - Dependency injection

### 4. Presentation Layer (`/src/presentation/`)
User interface components:
- **Components**: `PropertyCard`, `PropertyList` - UI components
- **Pages**: `PropertiesPage` - Page components
- **Hooks**: `useProperties` - React hooks for state management

## Key Principles Applied

1. **Dependency Inversion**: High-level modules don't depend on low-level modules
2. **Single Responsibility**: Each class has one reason to change
3. **Interface Segregation**: Small, focused interfaces
4. **Open/Closed**: Open for extension, closed for modification

## Simple Business Logic Examples

The architecture includes simple business logic without complexity:

- **Property validation**: Basic price and title validation
- **Status checking**: `isAvailable()`, `isExpensive()` methods
- **Price formatting**: `getFormattedPrice()` method
- **Feature validation**: `hasMinimumFeatures()` method

## Usage Example

```typescript
// Get dependency container
const container = Container.getInstance();
const propertyService = container.get<PropertyService>('PropertyService');

// Use the service
const properties = await propertyService.getAllProperties();
const availableProperties = await propertyService.getAvailableProperties();
```

## File Structure

```
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── repositories/
├── application/
│   ├── use-cases/
│   ├── services/
│   └── interfaces/
├── infrastructure/
│   ├── repositories/
│   ├── api/
│   ├── mappers/
│   └── di/
├── presentation/
│   ├── components/
│   ├── pages/
│   └── hooks/
└── examples/
```

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations
4. **Scalability**: New features can be added without affecting existing code
5. **Independence**: Framework and database agnostic core logic

## Running the Application

The application uses the Clean Architecture pattern with simple business logic examples. The main page displays properties using the implemented architecture layers.
