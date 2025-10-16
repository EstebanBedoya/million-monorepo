# Estados de Carga, Error y Vacío

Este documento describe la implementación de estados de carga, error y vacío en la aplicación.

## Componentes Principales

### AsyncBoundary

Componente principal que maneja todos los estados de forma unificada.

```tsx
import { AsyncBoundary } from '../components/molecules/AsyncBoundary';

<AsyncBoundary
  loading={loading}
  error={error}
  isEmpty={!loading && !error && items.length === 0}
  onRetry={handleRetry}
  onClearFilters={handleClearFilters}
  emptyTitle="No Items Found"
  emptyMessage="Try adjusting your filters."
>
  <YourContent />
</AsyncBoundary>
```

### ErrorState

Componente específico para mostrar errores con opción de retry.

```tsx
import { ErrorState } from '../components/molecules/ErrorState';

<ErrorState
  error={error}
  onRetry={handleRetry}
/>
```

### LoadingState

Componente para estados de carga con spinner.

```tsx
import { LoadingState } from '../components/molecules/LoadingState';

<LoadingState
  message="Loading properties..."
  showSpinner={true}
/>
```

## Servicio de Propiedades

### PropertyServiceClient

Servicio genérico para manejar peticiones de propiedades con simulación de errores.

```tsx
import { PropertyServiceClient } from '../application/services/PropertyServiceClient';

const service = new PropertyServiceClient({
  baseUrl: '/api/properties',
  simulateErrors: true,
  errorRate: 0.1,
  errorTypes: ['server', 'timeout', 'network']
});

// Obtener propiedades
const result = await service.getProperties(filters, pagination);

// Configurar simulación de errores
service.setErrorSimulation(true, 0.2);
service.setErrorTypes(['timeout']);
```

### Hook usePropertyService

Hook personalizado que encapsula la lógica del servicio.

```tsx
import { usePropertyService } from '../hooks/usePropertyService';

const {
  properties,
  pagination,
  loading,
  error,
  fetchProperties,
  retry,
  clearError,
  setErrorSimulation
} = usePropertyService({
  baseUrl: '/api/properties',
  simulateErrors: process.env.NODE_ENV === 'development',
  errorRate: 0.1
});
```

## Panel de Simulación de Errores

### ErrorSimulationPanel

Panel de desarrollo para controlar la simulación de errores.

```tsx
import { ErrorSimulationPanel } from '../components/molecules/ErrorSimulationPanel';

<ErrorSimulationPanel
  onSetErrorSimulation={setErrorSimulation}
  onSetErrorTypes={setErrorTypes}
/>
```

**Nota**: Solo aparece en modo desarrollo.

## Tipos de Errores Soportados

1. **Server Error (500)**: Error del servidor
2. **Timeout**: Timeout de la petición
3. **Network**: Error de conexión

## Estados de la Aplicación

### 1. Carga (Loading)
- Muestra skeletons o spinners
- Indica que la petición está en progreso
- Bloquea interacciones del usuario

### 2. Error
- Muestra mensaje de error claro
- Incluye botón de retry
- Diferencia entre tipos de error
- Muestra detalles técnicos en desarrollo

### 3. Vacío (Empty)
- Muestra cuando no hay resultados
- Incluye CTA para limpiar filtros
- Mensaje explicativo

### 4. Éxito (Success)
- Muestra el contenido normal
- Datos cargados correctamente

## Pruebas

Las pruebas cubren todos los estados:

```bash
# Ejecutar pruebas de componentes
npm test AsyncBoundary.test.tsx
npm test ErrorState.test.tsx

# Ejecutar pruebas de servicios
npm test PropertyServiceClient.test.ts
npm test usePropertyService.test.tsx
```

## Criterios de Aceptación ✅

- [x] **Carga**: Skeletons y/o spinner semántico
- [x] **Error**: Mensaje con retry
- [x] **Vacío**: Mensaje + CTA para limpiar filtros
- [x] **AsyncBoundary**: Patrón unificado para todos los estados
- [x] **Simulación de errores**: Sin MSW, servicio genérico
- [x] **Pruebas**: Cobertura para casos ok/empty/error

## DoD (Definition of Done) ✅

- [x] Cobertura de tests para casos: ok/empty/error
- [x] Componentes reutilizables
- [x] Servicio genérico fácil de cambiar
- [x] Documentación completa
- [x] Panel de desarrollo para testing
