# Comandos Útiles - Million Properties API

## 🚀 Inicio Rápido

```bash
# Iniciar MongoDB
cd infra && docker-compose up -d mongodb

# Seed de datos
cd infra/db/scripts && npm install && npm run seed

# Ejecutar API
cd apps/api/Api && dotnet run
```

## 🐳 Docker

### MongoDB

```bash
# Iniciar MongoDB
docker-compose up -d mongodb

# Ver logs
docker logs -f million-mongodb

# Detener MongoDB
docker-compose stop mongodb

# Eliminar contenedor y datos
docker-compose down -v

# Reiniciar MongoDB
docker-compose restart mongodb
```

### API

```bash
# Build de imagen
cd apps/api
docker build -t million-api .

# Ejecutar contenedor
docker run -p 5000:5000 -p 5001:5001 \
  -e ConnectionStrings__MongoDB="mongodb://admin:password123@host.docker.internal:27017/million_properties?authSource=admin" \
  million-api

# Con docker-compose (todo el stack)
cd infra
docker-compose up -d
```

## 🔧 .NET CLI

### Restore & Build

```bash
# Restore de dependencias
cd apps/api
dotnet restore

# Build del proyecto
dotnet build

# Build en Release
dotnet build -c Release

# Clean
dotnet clean
```

### Run

```bash
# Ejecutar API
cd apps/api/Api
dotnet run

# Ejecutar en modo watch (hot reload)
dotnet watch run

# Ejecutar con perfil específico
dotnet run --launch-profile "Development"
```

### Publish

```bash
# Publicar para producción
cd apps/api/Api
dotnet publish -c Release -o ./publish

# Ejecutar publicación
cd publish
dotnet Api.dll
```

## 🧪 Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests
cd apps/api/Tests/Unit
dotnet test

# Con detalles
dotnet test --verbosity detailed

# Con coverage
dotnet test --collect:"XPlat Code Coverage"

# Tests específicos
dotnet test --filter "FullyQualifiedName~PropertyTests"
```

### Tests de Integración

```bash
cd apps/api/Tests/Integration
dotnet test
```

## 📦 Paquetes NuGet

### Agregar paquetes

```bash
# En Api
cd apps/api/Api
dotnet add package NombrePaquete

# En Application
cd apps/api/Application
dotnet add package NombrePaquete

# Versión específica
dotnet add package NombrePaquete --version 1.2.3
```

### Actualizar paquetes

```bash
# Listar paquetes desactualizados
dotnet list package --outdated

# Actualizar un paquete
dotnet add package NombrePaquete

# Actualizar todos (cuidado!)
# Editar .csproj manualmente y luego:
dotnet restore
```

### Remover paquetes

```bash
dotnet remove package NombrePaquete
```

## 🗄️ MongoDB

### mongosh (CLI)

```bash
# Conectar
docker exec -it million-mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Comandos dentro de mongosh:
use million_properties
db.properties.find().limit(5).pretty()
db.properties.countDocuments()
db.owners.find({ name: /John/ })
db.properties.find({ price: { $gte: 500000, $lte: 1000000 } })
```

### Backup & Restore

```bash
# Backup
docker exec million-mongodb mongodump \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  --db million_properties \
  --out /tmp/backup

# Copiar backup del contenedor
docker cp million-mongodb:/tmp/backup ./backup

# Restore
docker exec million-mongodb mongorestore \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  --db million_properties \
  /tmp/backup/million_properties
```

### Queries útiles

```bash
# Contar propiedades por owner
db.properties.aggregate([
  { $group: { _id: "$idOwner", count: { $sum: 1 } } }
])

# Precio promedio
db.properties.aggregate([
  { $group: { _id: null, avgPrice: { $avg: "$price" } } }
])

# Propiedades más caras
db.properties.find().sort({ price: -1 }).limit(10)

# Buscar por texto
db.properties.find({ $text: { $search: "luxury villa" } })
```

## 🔍 Debugging

### Logs

```bash
# Ver logs de la API
tail -f apps/api/Api/logs/api-$(date +%Y-%m-%d).txt

# Logs de MongoDB
docker logs -f million-mongodb

# Logs de docker-compose
cd infra
docker-compose logs -f
```

### Inspeccionar

```bash
# Inspeccionar contenedor MongoDB
docker inspect million-mongodb

# Ver variables de entorno
docker exec million-mongodb env

# Verificar red
docker network inspect million-network
```

## 🌐 API Testing

### cURL

```bash
# GET Properties
curl http://localhost:5000/api/properties?page=1&limit=5

# GET Property by ID
curl http://localhost:5000/api/properties/prop-001

# POST Create Property
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Property",
    "address": "123 Test St, Test City",
    "price": 500000,
    "codeInternal": "TEST-001",
    "year": 2024,
    "idOwner": "owner-001"
  }'

# PUT Update Property
curl -X PUT http://localhost:5000/api/properties/prop-001 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 550000
  }'

# DELETE Property
curl -X DELETE http://localhost:5000/api/properties/prop-001

# GET with filters
curl "http://localhost:5000/api/properties?search=villa&minPrice=500000&maxPrice=2000000"
```

### HTTPie (más legible)

```bash
# Instalar: pip install httpie

# GET
http GET http://localhost:5000/api/properties page==1 limit==5

# POST
http POST http://localhost:5000/api/properties \
  name="Test Property" \
  address="123 Test St" \
  price:=500000 \
  codeInternal="TEST-001" \
  year:=2024 \
  idOwner="owner-001"

# PUT
http PUT http://localhost:5000/api/properties/prop-001 \
  price:=550000
```

## 📊 Performance

### Benchmarking

```bash
# Instalar Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# Mac: viene preinstalado

# Test de carga
ab -n 1000 -c 10 http://localhost:5000/api/properties

# Con keep-alive
ab -n 1000 -c 10 -k http://localhost:5000/api/properties
```

### Monitoring

```bash
# Ver uso de recursos del contenedor
docker stats million-mongodb

# Ver procesos
docker top million-mongodb

# Espacio en disco
docker system df
```

## 🧹 Limpieza

### .NET

```bash
# Limpiar builds
cd apps/api
dotnet clean

# Eliminar carpetas bin y obj
find . -name "bin" -o -name "obj" | xargs rm -rf
```

### Docker

```bash
# Detener todos los contenedores
docker-compose down

# Eliminar volúmenes
docker-compose down -v

# Limpiar imágenes no usadas
docker image prune -a

# Limpiar todo
docker system prune -a --volumes
```

## 🔐 Seguridad

### Cambiar contraseñas

```bash
# En docker-compose.yml cambiar:
MONGO_INITDB_ROOT_PASSWORD: nueva_password

# Recrear contenedor
docker-compose down -v
docker-compose up -d mongodb

# Actualizar en appsettings.json:
"MongoDB": "mongodb://admin:nueva_password@localhost:27017/..."
```

### Generar secrets

```bash
# Generar string aleatorio para JWT
openssl rand -base64 32

# Generar GUID
uuidgen
```

## 📝 Git

### Commits útiles

```bash
# Ver cambios
git status
git diff

# Commit de implementación
git add .
git commit -m "feat: implement .NET 9 API with MongoDB and Clean Architecture"

# Push
git push origin feature/dotnet-api
```

## 🎯 Comandos de Producción

### Health Check

```bash
# Verificar que la API responda
curl http://localhost:5000/api/properties?limit=1

# Verificar MongoDB
docker exec million-mongodb mongosh \
  --eval "db.adminCommand('ping')" \
  -u admin -p password123 --authenticationDatabase admin
```

### Restart

```bash
# Restart de la API
# Si está en systemd:
sudo systemctl restart million-api

# Si está en docker:
docker-compose restart api

# Si está corriendo directamente:
pkill -f "dotnet.*Api.dll"
cd apps/api/Api && dotnet run &
```

## 📚 Documentación

### Swagger

```bash
# Abrir Swagger UI
open http://localhost:5000/swagger

# Descargar OpenAPI spec
curl http://localhost:5000/swagger/v1/swagger.json > api-spec.json
```

### Generar cliente

```bash
# Instalar NSwag
dotnet tool install -g NSwag.ConsoleCore

# Generar cliente TypeScript
nswag openapi2tsclient \
  /input:http://localhost:5000/swagger/v1/swagger.json \
  /output:api-client.ts
```

## 🔄 CI/CD

### Build script

```bash
#!/bin/bash
# build.sh

cd apps/api
dotnet restore
dotnet build -c Release
dotnet test
dotnet publish -c Release -o ./publish
```

### Deploy script

```bash
#!/bin/bash
# deploy.sh

# Stop API
sudo systemctl stop million-api

# Copy files
sudo cp -r ./publish/* /var/www/million-api/

# Start API
sudo systemctl start million-api

# Verify
curl http://localhost:5000/api/properties?limit=1
```

## 💡 Tips

```bash
# Ver versión de .NET
dotnet --version

# Ver SDKs instalados
dotnet --list-sdks

# Ver runtimes instalados
dotnet --list-runtimes

# Crear nueva solución
dotnet new sln -n MiSolucion

# Agregar proyecto a solución
dotnet sln add ./MiProyecto/MiProyecto.csproj

# Ver estructura de proyecto
tree -L 3 apps/api

# Buscar en logs
grep -i "error" apps/api/Api/logs/api-*.txt

# Monitorear logs en tiempo real
tail -f apps/api/Api/logs/api-$(date +%Y-%m-%d).txt | grep -i "error"
```

