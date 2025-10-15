# Redux Store Configuration

This directory contains the Redux store configuration following Clean Architecture principles.

## Structure

```
store/
├── index.ts                    # Main store configuration
├── hooks.ts                    # Typed Redux hooks
├── slices/
│   ├── propertySlice.ts        # Property state management
│   └── uiSlice.ts             # UI state management
├── selectors/
│   └── propertySelectors.ts    # Memoized selectors
├── middleware/
│   ├── propertyMiddleware.ts   # Property-specific middleware
│   ├── loggerMiddleware.ts     # Development logging
│   └── persistenceMiddleware.ts # localStorage persistence
└── README.md                   # This file
```

## Features

### State Management
- **Property Slice**: Manages property data, loading states, and filters
- **UI Slice**: Handles UI state like modals, notifications, and theme
- **Async Thunks**: Handle API calls with proper loading/error states

### Middleware
- **Property Middleware**: Shows notifications for property operations
- **Logger Middleware**: Logs actions in development mode
- **Persistence Middleware**: Saves state to localStorage

### Selectors
- **Basic Selectors**: Direct state access
- **Memoized Selectors**: Computed values with caching
- **Filtered Selectors**: Complex filtering logic

## Usage Examples

### Basic Usage
```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchProperties } from '../store/slices/propertySlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(state => state.properties.properties);
  const loading = useAppSelector(state => state.properties.loading);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  return <div>{/* Component JSX */}</div>;
};
```

### Using Selectors
```typescript
import { selectAvailableProperties, selectPropertiesStats } from '../store/selectors/propertySelectors';

const MyComponent = () => {
  const availableProperties = useAppSelector(selectAvailableProperties);
  const stats = useAppSelector(selectPropertiesStats);

  return <div>{/* Component JSX */}</div>;
};
```

### Async Operations
```typescript
import { fetchProperties, createProperty } from '../store/slices/propertySlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  const handleLoadProperties = () => {
    dispatch(fetchProperties({ page: 1, limit: 10 }));
  };

  const handleCreateProperty = (propertyData) => {
    dispatch(createProperty(propertyData));
  };

  return <div>{/* Component JSX */}</div>;
};
```

## Integration with Clean Architecture

The Redux store integrates seamlessly with Clean Architecture:

1. **Domain Layer**: Redux actions use domain entities and business logic
2. **Application Layer**: Async thunks call application services
3. **Infrastructure Layer**: Middleware handles external concerns
4. **Presentation Layer**: Components use typed hooks and selectors

## Benefits

- **Type Safety**: Full TypeScript support with typed hooks
- **Performance**: Memoized selectors prevent unnecessary re-renders
- **Developer Experience**: Logger middleware for debugging
- **Persistence**: Automatic state persistence to localStorage
- **Notifications**: Automatic notifications for user feedback
- **Clean Architecture**: Maintains separation of concerns
