# Quick Start Guide - Million Properties API

## 🚀 Inicio Rápido (5 minutos)

### 1. Prerequisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker](https://www.docker.com/get-started) y Docker Compose
- [Node.js](https://nodejs.org/) (para el script de seed)

### 2. Iniciar MongoDB

```bash
cd infra
docker-compose up -d mongodb
```

Verificar que MongoDB esté corriendo:
```bash
docker ps | grep mongodb
```

### 3. Seed de Datos

```bash
cd infra/db/scripts
npm install
npm run seed
```

Deberías ver:
```
✅ Database seeded successfully!

Summary:
- Owners: 10
- Properties: 40
- Property Images: 10
- Property Traces: 10
```

### 4. Restaurar Dependencias

```bash
cd apps/api
dotnet restore
```

### 5. Ejecutar la API

```bash
cd apps/api/Api
dotnet run
```

La API estará disponible en:
- **Swagger UI**: http://localhost:5000/swagger
- **API Base**: http://localhost:5000/api

### 6. Probar la API

#### Opción A: Usar Swagger UI

1. Abrir http://localhost:5000/swagger
2. Expandir cualquier endpoint
3. Click en "Try it out"
4. Click en "Execute"

#### Opción B: Usar cURL

**Listar propiedades:**
```bash
curl http://localhost:5000/api/properties?page=1&limit=5
```

**Obtener una propiedad con detalles:**
```bash
curl http://localhost:5000/api/properties/prop-001
```

**Buscar propiedades por precio:**
```bash
curl "http://localhost:5000/api/properties?minPrice=500000&maxPrice=1000000"
```

**Crear una propiedad:**
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nueva Propiedad",
    "address": "123 Nueva Calle, Ciudad",
    "price": 850000,
    "codeInternal": "PROP-2024-NEW",
    "year": 2024,
    "idOwner": "owner-001"
  }'
```

## 🧪 Ejecutar Tests

```bash
# Tests unitarios
cd apps/api/Tests/Unit
dotnet test

# Tests de integración
cd apps/api/Tests/Integration
dotnet test
```

## 🐳 Usar Docker para Todo

Si prefieres ejecutar todo con Docker:

```bash
cd infra
docker-compose up -d
```

Esto iniciará:
- MongoDB (puerto 27017)
- Mongo Express (puerto 8081) - UI para MongoDB
- API .NET (puerto 5000)

## 🔍 Explorar la Base de Datos

### Opción 1: Mongo Express (UI Web)

1. Abrir http://localhost:8081
2. Usuario: `admin`
3. Password: `admin`

### Opción 2: MongoDB Compass

Connection string:
```
mongodb://admin:password123@localhost:27017/?authSource=admin
```

### Opción 3: mongosh (CLI)

```bash
docker exec -it million-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
use million_properties
db.properties.find().limit(5)
```

## 📊 Endpoints Disponibles

### Owners (Propietarios)
- `GET /api/owners` - Listar todos
- `GET /api/owners/{id}` - Obtener uno
- `POST /api/owners` - Crear
- `PUT /api/owners/{id}` - Actualizar
- `DELETE /api/owners/{id}` - Eliminar

### Properties (Propiedades)
- `GET /api/properties` - Listar con filtros
- `GET /api/properties/{id}` - Obtener con detalles
- `POST /api/properties` - Crear
- `PUT /api/properties/{id}` - Actualizar
- `DELETE /api/properties/{id}` - Eliminar

### Property Images (Imágenes)
- `GET /api/properties/{id}/images` - Listar imágenes
- `POST /api/properties/{id}/images` - Agregar imagen
- `PUT /api/properties/{id}/images/{imageId}` - Actualizar
- `DELETE /api/properties/{id}/images/{imageId}` - Eliminar

### Property Traces (Historial)
- `GET /api/properties/{id}/traces` - Listar historial
- `POST /api/properties/{id}/traces` - Agregar registro
- `PUT /api/properties/{id}/traces/{traceId}` - Actualizar
- `DELETE /api/properties/{id}/traces/{traceId}` - Eliminar

## 🛠️ Troubleshooting

### Error: "Unable to connect to MongoDB"

1. Verificar que MongoDB esté corriendo:
   ```bash
   docker ps | grep mongodb
   ```

2. Si no está corriendo, iniciarlo:
   ```bash
   cd infra
   docker-compose up -d mongodb
   ```

### Error: "Database is empty"

Ejecutar el script de seed:
```bash
cd infra/db/scripts
npm run seed
```

### Error: "Port 5000 already in use"

Cambiar el puerto en `appsettings.json` o matar el proceso:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Logs de la API

Los logs se guardan en:
```
apps/api/Api/logs/api-YYYY-MM-DD.txt
```

## 📝 Siguientes Pasos

1. Explorar la documentación completa en [README.md](./README.md)
2. Revisar los tests en `Tests/Unit/`
3. Personalizar la configuración en `appsettings.json`
4. Agregar autenticación/autorización según necesidad
5. Configurar CI/CD para deployment

## 🤝 Soporte

- Documentación: [README.md](./README.md)
- Swagger UI: http://localhost:5000/swagger
- Issues: Crear un issue en el repositorio

