# Frontend Integration Guide

## 🔗 Conectar el Frontend con la Nueva API

### Cambios Necesarios en el Frontend

El frontend actualmente usa endpoints mock en `/api/mock/*`. Para conectar con la nueva API .NET, necesitas:

### 1. Actualizar Variables de Entorno

En `apps/web/.env.local`:

```env
# Desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Producción
# NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

### 2. Actualizar HttpClient

El `HttpClient` en `apps/web/src/infrastructure/http/HttpClient.ts` ya está configurado para usar `NEXT_PUBLIC_API_URL`, solo asegúrate de que esté correctamente configurado.

### 3. Mapeo de Datos

La API .NET devuelve datos en formato diferente al mock. Aquí está el mapeo:

#### Properties

**Mock (Frontend actual):**
```typescript
{
  id: string;
  idOwner: string;
  name: string;
  address: string;
  city: string;
  price: number;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType?: string;
}
```

**API .NET (nuevo):**
```typescript
{
  idProperty: string;
  name: string;
  address: string;  // Incluye ciudad
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}
```

**PropertyDetail (con relaciones):**
```typescript
{
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
  owner?: {
    idOwner: string;
    name: string;
    address: string;
    photo: string;
    birthday: string;
  };
  images?: Array<{
    idPropertyImage: string;
    idProperty: string;
    file: string;
    enabled: boolean;
  }>;
  traces?: Array<{
    idPropertyTrace: string;
    dateSale: string;
    name: string;
    value: number;
    tax: number;
    idProperty: string;
  }>;
}
```

### 4. Actualizar PropertyRepositoryImpl

En `apps/web/src/infrastructure/repositories/PropertyRepositoryImpl.ts`:

```typescript
// Cambiar la URL base
private readonly baseUrl = '/properties'; // Era '/mock/properties'

// Actualizar el mapeo en los métodos
async getById(id: string): Promise<Property | null> {
  const response = await this.httpClient.get<PropertyDetailDto>(
    `${this.baseUrl}/${id}`
  );
  
  // Mapear PropertyDetailDto a Property
  return this.mapToProperty(response);
}

private mapToProperty(dto: PropertyDetailDto): Property {
  return {
    id: dto.idProperty,
    idOwner: dto.idOwner,
    name: dto.name,
    address: dto.address,
    city: this.extractCity(dto.address), // Extraer ciudad del address
    price: dto.price,
    image: dto.images?.[0]?.file || '',
    codeInternal: dto.codeInternal,
    year: dto.year,
    // Campos opcionales del mock
    bedrooms: undefined,
    bathrooms: undefined,
    area: undefined,
    areaUnit: 'm²',
    propertyType: 'House'
  };
}

private extractCity(address: string): string {
  // Extraer la ciudad del formato "Address, City"
  const parts = address.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : '';
}
```

### 5. Actualizar Endpoints

#### Antes (Mock):
```typescript
GET /api/mock/properties
GET /api/mock/properties/{id}
POST /api/mock/properties
PUT /api/mock/properties/{id}
DELETE /api/mock/properties/{id}
```

#### Después (API .NET):
```typescript
GET /api/properties
GET /api/properties/{id}
POST /api/properties
PUT /api/properties/{id}
DELETE /api/properties/{id}
```

### 6. Actualizar PropertyApiClient

En `apps/web/src/infrastructure/api/PropertyApiClient.ts`:

```typescript
export class PropertyApiClient {
  private readonly baseUrl = '/properties'; // Sin /mock

  async getProperties(params: GetPropertiesParams): Promise<PropertyListDto> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.search && { search: params.search }),
      ...(params.minPrice && { minPrice: params.minPrice.toString() }),
      ...(params.maxPrice && { maxPrice: params.maxPrice.toString() }),
    });

    return this.httpClient.get<PropertyListDto>(
      `${this.baseUrl}?${queryParams}`
    );
  }

  async getPropertyById(id: string): Promise<PropertyDetailDto> {
    return this.httpClient.get<PropertyDetailDto>(`${this.baseUrl}/${id}`);
  }

  async createProperty(data: CreatePropertyDto): Promise<PropertyDto> {
    return this.httpClient.post<PropertyDto>(this.baseUrl, data);
  }

  async updateProperty(id: string, data: UpdatePropertyDto): Promise<PropertyDto> {
    return this.httpClient.put<PropertyDto>(`${this.baseUrl}/${id}`, data);
  }

  async deleteProperty(id: string): Promise<void> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  // Nuevos métodos para images y traces
  async getPropertyImages(propertyId: string): Promise<PropertyImageListDto> {
    return this.httpClient.get<PropertyImageListDto>(
      `${this.baseUrl}/${propertyId}/images`
    );
  }

  async getPropertyTraces(propertyId: string): Promise<PropertyTraceListDto> {
    return this.httpClient.get<PropertyTraceListDto>(
      `${this.baseUrl}/${propertyId}/traces`
    );
  }
}
```

### 7. Actualizar Contratos TypeScript

En `shared/contracts/property.dto.ts`, los DTOs ya están definidos correctamente. Solo asegúrate de usarlos:

```typescript
// Ya existen en el archivo:
export interface PropertyDto {
  idProperty: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: string;
}

export interface PropertyDetailDto extends PropertyDto {
  owner?: OwnerDto;
  images?: PropertyImageDto[];
  traces?: PropertyTraceDto[];
}
```

### 8. Configurar CORS en la API

La API ya tiene CORS configurado para desarrollo. Para producción, actualizar en `apps/api/Api/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://tudominio.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Usar la política
app.UseCors("AllowFrontend");
```

### 9. Testing de Integración

Crear un script de prueba en `apps/web/scripts/test-api-connection.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function testConnection() {
  try {
    console.log('Testing API connection...');
    console.log('API URL:', API_URL);

    const response = await fetch(`${API_URL}/properties?page=1&limit=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API connection successful!');
    console.log('Properties found:', data.pagination.total);
    console.log('Sample property:', data.properties[0]);
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
}

testConnection();
```

Ejecutar:
```bash
cd apps/web
npx tsx scripts/test-api-connection.ts
```

### 10. Modo de Desarrollo Híbrido

Para facilitar el desarrollo, puedes crear un flag para alternar entre mock y API real:

En `apps/web/.env.local`:
```env
NEXT_PUBLIC_USE_MOCK=false  # false para usar API real, true para mock
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

En el código:
```typescript
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const baseUrl = useMock ? '/api/mock' : process.env.NEXT_PUBLIC_API_URL;
```

## 🚀 Pasos para Migración

### Paso 1: Preparación
1. Asegurarse de que la API .NET esté corriendo
2. Verificar que MongoDB tenga datos (ejecutar seed)
3. Probar endpoints con Swagger

### Paso 2: Actualizar Frontend
1. Crear rama de feature: `git checkout -b feature/integrate-dotnet-api`
2. Actualizar variables de entorno
3. Actualizar PropertyApiClient
4. Actualizar mappers en repositorios

### Paso 3: Testing
1. Ejecutar script de test de conexión
2. Probar cada funcionalidad manualmente
3. Ejecutar tests unitarios del frontend
4. Verificar que no haya errores en consola

### Paso 4: Deployment
1. Merge a develop
2. Actualizar variables de entorno en staging
3. Deploy a staging
4. Testing en staging
5. Deploy a producción

## 🐛 Troubleshooting

### Error: CORS
```
Access to fetch at 'http://localhost:5000/api/properties' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solución**: Verificar configuración de CORS en `Program.cs`

### Error: 404 Not Found
```
GET http://localhost:5000/api/properties 404 (Not Found)
```

**Solución**: 
1. Verificar que la API esté corriendo
2. Verificar la URL en variables de entorno
3. Verificar que no haya `/mock` en la URL

### Error: Datos no se muestran
**Solución**: 
1. Verificar el mapeo de datos en el mapper
2. Revisar consola del navegador para errores
3. Verificar que los campos del DTO coincidan

### Error: MongoDB vacío
**Solución**: Ejecutar el script de seed:
```bash
cd infra/db/scripts
npm run seed
```

## 📊 Comparación de Respuestas

### Mock API Response:
```json
{
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 40,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### .NET API Response:
```json
{
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 40,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**✅ La estructura de paginación es idéntica, facilitando la migración!**

## 🎯 Checklist de Migración

- [ ] API .NET corriendo en localhost:5000
- [ ] MongoDB con datos seed
- [ ] Variables de entorno actualizadas
- [ ] PropertyApiClient actualizado
- [ ] Mappers actualizados
- [ ] Tests de conexión exitosos
- [ ] Funcionalidad de listado funcionando
- [ ] Funcionalidad de detalle funcionando
- [ ] Funcionalidad de creación funcionando
- [ ] Funcionalidad de actualización funcionando
- [ ] Funcionalidad de eliminación funcionando
- [ ] Sin errores en consola
- [ ] Tests unitarios pasando
- [ ] Documentación actualizada

## 🎉 Beneficios de la Nueva API

1. **Performance**: MongoDB es más rápido que archivos JSON
2. **Escalabilidad**: Arquitectura preparada para crecer
3. **Validación**: FluentValidation asegura datos consistentes
4. **Testing**: Tests unitarios y de integración
5. **Documentación**: Swagger automático
6. **Mantenibilidad**: Clean Architecture facilita cambios
7. **Profesional**: Stack empresarial (.NET + MongoDB)

