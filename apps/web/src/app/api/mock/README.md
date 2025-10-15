# Mock Data API Routes

Este sistema proporciona datos simulados estables para el desarrollo del frontend usando API routes de Next.js, permitiendo construir UI y filtros sin depender del backend.

## Características

- ✅ **API Routes de Next.js**: Endpoints nativos de Next.js para servir datos mock
- ✅ **Datos Mock Estables**: 30 propiedades realistas con información completa
- ✅ **Validación Zod**: Esquemas de validación para garantizar la integridad de los datos
- ✅ **Paginación**: Soporte completo para paginación de resultados
- ✅ **Filtros**: Búsqueda por texto, rango de precios y más
- ✅ **Tests**: Tests de contrato con snapshots Zod
- ✅ **TypeScript**: Tipado completo para mejor DX

## Estructura

```
src/
├── app/api/mock/
│   ├── properties/
│   │   ├── route.ts              # GET /api/mock/properties
│   │   └── [id]/route.ts         # GET /api/mock/properties/:id
│   └── health/route.ts           # GET /api/mock/health
├── domain/schemas/
│   └── property.schema.ts        # Esquemas Zod de validación
├── infrastructure/adapters/
│   └── PropertyAdapter.ts        # Adapter con validación Zod
└── public/mock/
    └── properties.json           # Datos mock (30 propiedades)
```

## Endpoints Disponibles

### GET /api/mock/properties

Lista de propiedades con paginación y filtros.

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `search` (string): Búsqueda por nombre o dirección
- `minPrice` (number): Precio mínimo
- `maxPrice` (number): Precio máximo

**Response:**
```json
{
  "properties": [
    {
      "id": "prop-001",
      "idOwner": "owner-001",
      "name": "Modern Apartment in Downtown",
      "address": "123 Main Street, Downtown, NY 10001",
      "price": 850000,
      "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/mock/properties/:id

Propiedad específica por ID.

**Response:**
```json
{
  "id": "prop-001",
  "idOwner": "owner-001",
  "name": "Modern Apartment in Downtown",
  "address": "123 Main Street, Downtown, NY 10001",
  "price": 850000,
  "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
}
```

### GET /api/mock/health

Health check del sistema.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "mock-properties-api"
}
```

## Uso

### 1. Usar el Adapter

```typescript
import { PropertyAdapter } from '../infrastructure/adapters/PropertyAdapter';

const adapter = new PropertyAdapter();

// Obtener todas las propiedades
const result = await adapter.getProperties({
  page: 1,
  limit: 10,
  search: 'Modern',
  minPrice: 200000,
  maxPrice: 1000000,
});

// Obtener propiedad específica
const property = await adapter.getPropertyById('prop-001');
```

### 2. Llamadas HTTP Directas

```typescript
// Obtener propiedades con filtros
const response = await fetch('/api/mock/properties?search=Modern&minPrice=200000&maxPrice=800000');
const data = await response.json();

// Obtener propiedad específica
const propertyResponse = await fetch('/api/mock/properties/prop-001');
const property = await propertyResponse.json();
```

## Esquemas de Validación

### MockProperty (Simplificado)

```typescript
{
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}
```

## Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Tests Incluidos

- ✅ Validación de esquemas Zod
- ✅ Tests de API routes
- ✅ Tests de adapter con mocks
- ✅ Validación de estructura de datos

## Criterios de Aceptación Cumplidos

- ✅ **GET /api/mock/properties**: Retorna JSON con { id, idOwner, name, address, price, image }
- ✅ **GET /api/mock/properties/:id**: Retorna objeto completo por ID válido
- ✅ **Esquema Zod**: Validación completa en `property.schema.ts`
- ✅ **Datos Mock**: 30 registros realistas en `public/mock/properties.json`
- ✅ **API Routes**: Lista/detalle con paginación básica
- ✅ **Contratos Compartidos**: Tipos en `shared/contracts`
- ✅ **Validación Adapter**: Zod validation en el adapter
- ✅ **Tests de Contrato**: Snapshots Zod incluidos

## Ejemplo de Uso Completo

```typescript
import { MockDataExample } from '../examples/MockDataExample';

const example = new MockDataExample();

// Obtener propiedades con filtros
const result = await example.getFilteredProperties({
  search: 'Apartment',
  minPrice: 200000,
  maxPrice: 800000,
  page: 1,
  limit: 10,
});

console.log(`Found ${result.properties.length} properties`);
console.log('Pagination:', result.pagination);
```

## Desarrollo

### Agregar Nuevas Propiedades

1. Editar `public/mock/properties.json`
2. Ejecutar tests para validar estructura
3. Los datos se validan automáticamente con Zod

### Modificar Esquemas

1. Actualizar `domain/schemas/property.schema.ts`
2. Actualizar tests correspondientes
3. Verificar que los datos mock sigan siendo válidos

### Agregar Nuevos Endpoints

1. Crear nueva ruta en `src/app/api/mock/`
2. Agregar método en `PropertyAdapter.ts`
3. Crear tests para el nuevo endpoint

## Ventajas sobre MSW

- ✅ **Más Simple**: No requiere configuración adicional
- ✅ **Nativo**: Usa las API routes de Next.js
- ✅ **Mejor Performance**: No intercepta peticiones HTTP
- ✅ **Fácil Debugging**: Endpoints visibles en el navegador
- ✅ **Desarrollo**: Funciona directamente con `npm run dev`
