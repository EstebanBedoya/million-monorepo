# Million Properties API

API REST desarrollada con .NET 9, MongoDB y Clean Architecture para la gestión de propiedades inmobiliarias.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con las siguientes capas:

- **Domain**: Entidades de negocio e interfaces de repositorios
- **Application**: Lógica de aplicación, DTOs, Commands/Queries (CQRS con MediatR)
- **Infrastructure**: Implementaciones de repositorios, configuración de MongoDB
- **Api**: Controladores y configuración de la API

## 🚀 Tecnologías

- **.NET 9**
- **MongoDB** (v7.0)
- **MediatR** (patrón CQRS)
- **AutoMapper** (mapeo de objetos)
- **FluentValidation** (validación de datos)
- **Serilog** (logging)
- **NUnit** (testing)
- **Swagger/OpenAPI** (documentación)

## 📊 Modelo de Datos

### Entidades

- **Owner**: Propietarios de inmuebles
- **Property**: Propiedades inmobiliarias
- **PropertyImage**: Imágenes de propiedades
- **PropertyTrace**: Historial de transacciones

## 🔧 Configuración

### Variables de Entorno

Configurar en `appsettings.json` o variables de entorno:

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://admin:password123@localhost:27017/million_properties?authSource=admin"
  },
  "MongoSettings": {
    "DatabaseName": "million_properties",
    "OwnersCollectionName": "owners",
    "PropertiesCollectionName": "properties",
    "PropertyImagesCollectionName": "property_images",
    "PropertyTracesCollectionName": "property_traces"
  }
}
```

### Para Producción

Usar variables de entorno:

```bash
export MONGODB_CONNECTION_STRING="mongodb://..."
export MONGODB_DATABASE_NAME="million_properties"
```

## 🐳 Docker

### Iniciar MongoDB con Docker Compose

```bash
cd infra
docker-compose up -d mongodb
```

### Seed de Datos

```bash
cd infra/db/scripts
npm install
npm run seed
```

## 🏃 Ejecución

### Desarrollo

```bash
cd apps/api/Api
dotnet restore
dotnet run
```

La API estará disponible en:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:5001
- Swagger: http://localhost:5000/swagger

### Producción

```bash
dotnet publish -c Release
cd bin/Release/net9.0/publish
dotnet Api.dll
```

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
cd apps/api/Tests/Unit
dotnet test
```

### Ejecutar Tests de Integración

```bash
cd apps/api/Tests/Integration
dotnet test
```

## 📡 Endpoints

### Owners

- `GET /api/owners` - Listar propietarios (con paginación y búsqueda)
- `GET /api/owners/{id}` - Obtener propietario por ID
- `POST /api/owners` - Crear propietario
- `PUT /api/owners/{id}` - Actualizar propietario
- `DELETE /api/owners/{id}` - Eliminar propietario

### Properties

- `GET /api/properties` - Listar propiedades (con filtros: search, minPrice, maxPrice, page, limit)
- `GET /api/properties/{id}` - Obtener propiedad por ID (incluye owner, images, traces)
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/{id}` - Actualizar propiedad
- `DELETE /api/properties/{id}` - Eliminar propiedad

### Property Images

- `GET /api/properties/{propertyId}/images` - Listar imágenes de una propiedad
- `POST /api/properties/{propertyId}/images` - Agregar imagen
- `PUT /api/properties/{propertyId}/images/{imageId}` - Actualizar imagen
- `DELETE /api/properties/{propertyId}/images/{imageId}` - Eliminar imagen

### Property Traces

- `GET /api/properties/{propertyId}/traces` - Listar historial de transacciones
- `POST /api/properties/{propertyId}/traces` - Agregar transacción
- `PUT /api/properties/{propertyId}/traces/{traceId}` - Actualizar transacción
- `DELETE /api/properties/{propertyId}/traces/{traceId}` - Eliminar transacción

## 📝 Ejemplos de Uso

### Crear una Propiedad

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Modern Villa",
    "address": "123 Main St, Los Angeles",
    "price": 1500000,
    "codeInternal": "PROP-2024-001",
    "year": 2024,
    "idOwner": "owner-001"
  }'
```

### Buscar Propiedades por Precio

```bash
curl "http://localhost:5000/api/properties?minPrice=500000&maxPrice=2000000&page=1&limit=10"
```

### Obtener Propiedad con Detalles

```bash
curl http://localhost:5000/api/properties/prop-001
```

Respuesta incluye:
- Datos de la propiedad
- Información del propietario (owner)
- Imágenes habilitadas
- Historial de transacciones (traces)

## 🔐 Seguridad

- CORS configurado para desarrollo (ajustar en producción)
- Validación de datos con FluentValidation
- Manejo de errores centralizado con middleware
- Logging con Serilog

## 📚 Estructura del Proyecto

```
apps/api/
├── Api/                    # Capa de presentación
│   ├── Controllers/        # Endpoints REST
│   ├── DI/                 # Configuración de DI
│   ├── Middlewares/        # Middlewares personalizados
│   └── Program.cs          # Punto de entrada
├── Application/            # Lógica de aplicación
│   ├── Dtos/               # Data Transfer Objects
│   ├── Mappings/           # Perfiles de AutoMapper
│   ├── Owners/             # Commands y Queries de Owners
│   ├── Properties/         # Commands y Queries de Properties
│   ├── PropertyImages/     # Commands y Queries de Images
│   └── PropertyTraces/     # Commands y Queries de Traces
├── Domain/                 # Capa de dominio
│   ├── Entities/           # Entidades de negocio
│   └── Repositories/       # Interfaces de repositorios
├── Infrastructure/         # Implementaciones
│   ├── Configuration/      # Configuración de MongoDB
│   ├── Mappings/           # Mapeo de MongoDB
│   └── Persistence/        # Repositorios y DbContext
└── Tests/                  # Tests
    ├── Unit/               # Tests unitarios
    └── Integration/        # Tests de integración
```

## 🤝 Contribución

1. Crear una rama desde `develop`
2. Hacer commits con mensajes descriptivos
3. Ejecutar tests antes de hacer push
4. Crear Pull Request a `develop`

## 📄 Licencia

MIT

