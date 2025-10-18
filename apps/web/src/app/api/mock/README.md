# Mock Data API Routes - CRUD Complete

Este sistema proporciona endpoints CRUD completos para todas las entidades del sistema de propiedades usando API routes de Next.js.

## 🎯 Características

- ✅ **CRUD Completo**: Create, Read, Update, Delete para todas las entidades
- ✅ **API Routes de Next.js**: Endpoints nativos de Next.js
- ✅ **Datos Mock Persistentes**: Datos en memoria que persisten durante la sesión
- ✅ **Validación**: Validación de campos requeridos
- ✅ **Relaciones**: Soporte para relaciones entre entidades
- ✅ **Paginación**: Soporte completo para paginación
- ✅ **Filtros**: Búsqueda y filtros avanzados
- ✅ **TypeScript**: Tipado completo con contratos compartidos

## 📊 Entidades del Sistema

Basado en el diagrama de base de datos:

1. **Owner** (Propietario) - Dueños de propiedades
2. **Property** (Propiedad) - Propiedades inmobiliarias
3. **PropertyImage** (Imágenes) - Imágenes de propiedades
4. **PropertyTrace** (Historial) - Historial de ventas y cambios de valor

## 🔗 Estructura de Endpoints

```
/api/mock/
├── health/                              # Health check
├── properties/                          # Propiedades
│   ├── GET, POST                       # Listar y crear propiedades
│   └── [id]/
│       ├── GET, PUT, DELETE            # Ver, actualizar y eliminar propiedad
│       ├── images/                     # Imágenes de la propiedad
│       │   ├── GET, POST              # Listar y agregar imágenes
│       │   └── [imageId]/
│       │       └── GET, PUT, DELETE   # Ver, actualizar y eliminar imagen
│       └── traces/                     # Historial de la propiedad
│           ├── GET, POST              # Listar y agregar trazas
│           └── [traceId]/
│               └── GET, PUT, DELETE   # Ver, actualizar y eliminar traza
└── owners/                             # Propietarios
    ├── GET, POST                       # Listar y crear propietarios
    └── [id]/
        └── GET, PUT, DELETE            # Ver, actualizar y eliminar propietario
```

---

## 📋 Properties Endpoints

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
      "name": "Modern Apartment",
      "address": "123 Main St",
      "city": "New York",
      "price": 850000,
      "image": "https://...",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 120,
      "areaUnit": "m²",
      "propertyType": "Apartment"
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

### POST /api/mock/properties
Crear una nueva propiedad.

**Request Body:**
```json
{
  "name": "Luxury Villa",
  "address": "456 Ocean Drive",
  "city": "Miami",
  "price": 2500000,
  "idOwner": "owner-001",
  "image": "https://...",
  "bedrooms": 5,
  "bathrooms": 4,
  "area": 350,
  "areaUnit": "m²",
  "propertyType": "Villa"
}
```

**Response:** (201 Created)
```json
{
  "id": "prop-1729180800000",
  "name": "Luxury Villa",
  "address": "456 Ocean Drive",
  ...
}
```

### GET /api/mock/properties/:id
Obtener una propiedad específica por ID.

**Response:**
```json
{
  "id": "prop-001",
  "idOwner": "owner-001",
  "name": "Modern Apartment",
  "address": "123 Main St",
  "city": "New York",
  "price": 850000,
  ...
}
```

### PUT /api/mock/properties/:id
Actualizar una propiedad existente.

**Request Body:** (campos opcionales)
```json
{
  "name": "Updated Apartment Name",
  "price": 900000,
  "bedrooms": 4
}
```

**Response:**
```json
{
  "id": "prop-001",
  "name": "Updated Apartment Name",
  "price": 900000,
  "bedrooms": 4,
  ...
}
```

### DELETE /api/mock/properties/:id
Eliminar una propiedad.

**Response:**
```json
{
  "message": "Property deleted successfully",
  "property": { ... }
}
```

---

## 👤 Owners Endpoints

### GET /api/mock/owners
Lista de propietarios con paginación.

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `search` (string): Búsqueda por nombre o dirección

**Response:**
```json
{
  "owners": [
    {
      "idOwner": "owner-001",
      "name": "John Smith",
      "address": "456 Oak Avenue",
      "photo": "https://...",
      "birthday": "1975-05-15"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### POST /api/mock/owners
Crear un nuevo propietario.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "address": "789 Pine Street",
  "photo": "https://...",
  "birthday": "1990-03-20"
}
```

**Response:** (201 Created)
```json
{
  "idOwner": "owner-1729180800000",
  "name": "Jane Doe",
  "address": "789 Pine Street",
  "photo": "https://...",
  "birthday": "1990-03-20"
}
```

### GET /api/mock/owners/:id
Obtener un propietario específico con sus propiedades.

**Response:**
```json
{
  "idOwner": "owner-001",
  "name": "John Smith",
  "address": "456 Oak Avenue",
  "photo": "https://...",
  "birthday": "1975-05-15",
  "properties": [
    {
      "id": "prop-001",
      "name": "Modern Apartment",
      ...
    }
  ]
}
```

### PUT /api/mock/owners/:id
Actualizar un propietario existente.

**Request Body:** (campos opcionales)
```json
{
  "name": "John Smith Jr.",
  "address": "New Address 123"
}
```

**Response:**
```json
{
  "idOwner": "owner-001",
  "name": "John Smith Jr.",
  "address": "New Address 123",
  ...
}
```

### DELETE /api/mock/owners/:id
Eliminar un propietario (solo si no tiene propiedades asociadas).

**Response:** (200 OK)
```json
{
  "message": "Owner deleted successfully",
  "owner": { ... }
}
```

**Response:** (409 Conflict)
```json
{
  "error": "Cannot delete owner with associated properties",
  "propertiesCount": 3
}
```

---

## 🖼️ Property Images Endpoints

### GET /api/mock/properties/:id/images
Lista de imágenes de una propiedad.

**Query Parameters:**
- `enabledOnly` (boolean): Solo imágenes habilitadas (default: false)

**Response:**
```json
{
  "images": [
    {
      "idPropertyImage": "img-001",
      "idProperty": "prop-001",
      "file": "https://...",
      "enabled": true
    }
  ],
  "total": 3
}
```

### POST /api/mock/properties/:id/images
Agregar una imagen a una propiedad.

**Request Body:**
```json
{
  "file": "https://images.unsplash.com/photo-...",
  "enabled": true
}
```

**Response:** (201 Created)
```json
{
  "idPropertyImage": "img-1729180800000",
  "idProperty": "prop-001",
  "file": "https://...",
  "enabled": true
}
```

### GET /api/mock/properties/:id/images/:imageId
Obtener una imagen específica.

**Response:**
```json
{
  "idPropertyImage": "img-001",
  "idProperty": "prop-001",
  "file": "https://...",
  "enabled": true
}
```

### PUT /api/mock/properties/:id/images/:imageId
Actualizar una imagen.

**Request Body:** (campos opcionales)
```json
{
  "enabled": false
}
```

**Response:**
```json
{
  "idPropertyImage": "img-001",
  "idProperty": "prop-001",
  "file": "https://...",
  "enabled": false
}
```

### DELETE /api/mock/properties/:id/images/:imageId
Eliminar una imagen.

**Response:**
```json
{
  "message": "Image deleted successfully",
  "image": { ... }
}
```

---

## 📈 Property Traces Endpoints

### GET /api/mock/properties/:id/traces
Lista de trazas (historial) de una propiedad.

**Query Parameters:**
- `sortBy` (string): Campo para ordenar ('dateSale' | 'value', default: 'dateSale')
- `order` (string): Orden ('asc' | 'desc', default: 'desc')

**Response:**
```json
{
  "traces": [
    {
      "idPropertyTrace": "trace-001",
      "idProperty": "prop-001",
      "dateSale": "2024-03-20",
      "name": "Property Update",
      "value": 850000,
      "tax": 42500
    }
  ],
  "total": 2
}
```

### POST /api/mock/properties/:id/traces
Agregar una traza al historial de una propiedad.

**Request Body:**
```json
{
  "dateSale": "2024-10-17",
  "name": "Market Reassessment",
  "value": 900000,
  "tax": 45000
}
```

**Response:** (201 Created)
```json
{
  "idPropertyTrace": "trace-1729180800000",
  "idProperty": "prop-001",
  "dateSale": "2024-10-17",
  "name": "Market Reassessment",
  "value": 900000,
  "tax": 45000
}
```

### GET /api/mock/properties/:id/traces/:traceId
Obtener una traza específica.

**Response:**
```json
{
  "idPropertyTrace": "trace-001",
  "idProperty": "prop-001",
  "dateSale": "2023-01-15",
  "name": "Initial Purchase",
  "value": 820000,
  "tax": 41000
}
```

### PUT /api/mock/properties/:id/traces/:traceId
Actualizar una traza.

**Request Body:** (campos opcionales)
```json
{
  "value": 830000,
  "tax": 41500
}
```

**Response:**
```json
{
  "idPropertyTrace": "trace-001",
  "idProperty": "prop-001",
  "dateSale": "2023-01-15",
  "name": "Initial Purchase",
  "value": 830000,
  "tax": 41500
}
```

### DELETE /api/mock/properties/:id/traces/:traceId
Eliminar una traza del historial.

**Response:**
```json
{
  "message": "Trace deleted successfully",
  "trace": { ... }
}
```

---

## 🏥 Health Check

### GET /api/mock/health
Health check del sistema.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-10-17T12:00:00.000Z",
  "service": "mock-properties-api"
}
```

---

## 🎯 Ejemplos de Uso

### Crear una propiedad con propietario
```typescript
// 1. Crear propietario
const ownerResponse = await fetch('/api/mock/owners', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carlos Rodriguez',
    address: '123 Main St',
    birthday: '1985-06-15',
  }),
});
const owner = await ownerResponse.json();

// 2. Crear propiedad
const propertyResponse = await fetch('/api/mock/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Beach House',
    address: '456 Ocean Ave',
    city: 'Miami',
    price: 1500000,
    idOwner: owner.idOwner,
  }),
});
const property = await propertyResponse.json();

// 3. Agregar imágenes
await fetch(`/api/mock/properties/${property.id}/images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: 'https://images.unsplash.com/photo-...',
    enabled: true,
  }),
});

// 4. Agregar historial
await fetch(`/api/mock/properties/${property.id}/traces`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dateSale: '2024-10-17',
    name: 'Initial Purchase',
    value: 1500000,
    tax: 75000,
  }),
});
```

### Actualizar precio de una propiedad
```typescript
const response = await fetch('/api/mock/properties/prop-001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    price: 950000,
  }),
});
const updatedProperty = await response.json();
```

### Buscar propiedades por rango de precio
```typescript
const response = await fetch(
  '/api/mock/properties?minPrice=500000&maxPrice=1000000&page=1&limit=10'
);
const { properties, pagination } = await response.json();
```

### Deshabilitar una imagen
```typescript
const response = await fetch('/api/mock/properties/prop-001/images/img-001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    enabled: false,
  }),
});
```

### Eliminar una propiedad
```typescript
const response = await fetch('/api/mock/properties/prop-001', {
  method: 'DELETE',
});
const result = await response.json();
```

---

## 📝 Contratos TypeScript

Los contratos compartidos están en `shared/contracts/property.dto.ts`:

```typescript
// Propietarios
export interface OwnerDto
export interface CreateOwnerDto
export interface UpdateOwnerDto

// Propiedades
export interface PropertyDto
export interface PropertyDetailDto
export interface CreatePropertyDto
export interface UpdatePropertyDto

// Imágenes
export interface PropertyImageDto
export interface CreatePropertyImageDto
export interface UpdatePropertyImageDto

// Historial
export interface PropertyTraceDto
export interface CreatePropertyTraceDto
export interface UpdatePropertyTraceDto

// Paginación
export interface PaginationDto
```

---

## 🧪 Testing

Para probar los endpoints puedes usar:

### Con curl
```bash
# Crear propiedad
curl -X POST http://localhost:3000/api/mock/properties \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Property","address":"123 Test St","price":500000,"idOwner":"owner-001"}'

# Actualizar propiedad
curl -X PUT http://localhost:3000/api/mock/properties/prop-001 \
  -H "Content-Type: application/json" \
  -d '{"price":550000}'

# Eliminar propiedad
curl -X DELETE http://localhost:3000/api/mock/properties/prop-001
```

### Con Postman
Importa la colección desde los ejemplos de arriba.

---

## ⚠️ Notas Importantes

1. **Persistencia**: Los datos solo persisten en memoria durante la sesión del servidor
2. **IDs**: Los IDs se generan con timestamp para simular IDs únicos
3. **Validación**: Se valida existencia de campos requeridos
4. **Relaciones**: Se verifica integridad referencial (ej: no eliminar owner con propiedades)
5. **CORS**: No hay restricciones CORS en desarrollo

---

## 🚀 Próximos Pasos

Para conectar con el backend real:
1. Reemplazar los archivos `route.ts` con llamadas al API backend
2. Mantener la misma estructura de URLs
3. Los contratos TypeScript pueden reutilizarse
4. La lógica de paginación y filtros ya está implementada

---

## 📚 Recursos

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Diagrama de Base de Datos](../../../../../../../docs/database-diagram.png)
