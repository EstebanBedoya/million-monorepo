# 🏠 Million Monorepo - Aplicación de Propiedades Inmobiliarias

Un monorepo completo para una aplicación de propiedades inmobiliarias de lujo con arquitectura limpia, siguiendo las mejores prácticas de desarrollo moderno.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración Inicial](#-configuración-inicial)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [API Documentation](#-api-documentation)
- [Contribución](#-contribución)

## ✨ Características

### 🎨 Frontend (Next.js)
- **Diseño Elegante**: Tema ESTATELY con paleta de colores de lujo
- **Responsive**: Diseño adaptativo para móviles, tablets y desktop
- **Filtros Avanzados**: Búsqueda por texto, rango de precios, tipo de propiedad
- **Paginación**: Navegación eficiente para grandes conjuntos de datos
- **Tema Oscuro/Claro**: Soporte completo para ambos temas
- **Accesibilidad**: Cumple estándares WCAG 2.1 AA
- **Performance**: Optimizado con Next.js 14 y Turbopack

### 🔧 Backend (.NET)
- **Clean Architecture**: Separación clara de responsabilidades
- **CQRS**: Patrón Command Query Responsibility Segregation
- **MediatR**: Mediador para manejo de comandos y consultas
- **FluentValidation**: Validación robusta de datos
- **AutoMapper**: Mapeo automático entre entidades y DTOs
- **Serilog**: Logging estructurado y configurable
- **Swagger**: Documentación automática de API

### 🗄️ Base de Datos
- **MongoDB**: Base de datos NoSQL para flexibilidad
- **Datos Mock**: 40 propiedades realistas para desarrollo
- **Seeding**: Scripts automáticos para poblar la base de datos

## 🏗️ Arquitectura

### Clean Architecture
```
┌─────────────────────────────────────────┐
│              Presentation               │
│         (Controllers, UI)              │
├─────────────────────────────────────────┤
│              Application               │
│        (Use Cases, Services)           │
├─────────────────────────────────────────┤
│                Domain                   │
│         (Entities, Value Objects)      │
├─────────────────────────────────────────┤
│             Infrastructure              │
│    (Repositories, External Services)   │
└─────────────────────────────────────────┘
```

### Monorepo Structure
```
million-monorepo/
├── apps/
│   ├── api/          # Backend .NET API
│   └── web/          # Frontend Next.js
├── shared/           # Contratos y configuraciones compartidas
├── infra/           # Docker, scripts de base de datos
└── docs/            # Documentación adicional
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 15.5.5** - Framework React con SSR/SSG
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 3.4** - Framework de estilos
- **Redux Toolkit 2.9** - Manejo de estado
- **Jest 29.7** - Testing framework
- **React Testing Library** - Testing de componentes

### Backend
- **.NET 8** - Framework de desarrollo
- **ASP.NET Core** - Web API framework
- **MongoDB** - Base de datos NoSQL
- **MediatR 12.2** - Patrón mediador
- **FluentValidation 11.8** - Validación
- **AutoMapper 12.0** - Mapeo de objetos
- **Serilog 8.0** - Logging

### DevOps & Tools
- **Docker & Docker Compose** - Containerización
- **pnpm 8.6** - Gestor de paquetes
- **Turbo** - Build system para monorepo
- **Husky** - Git hooks
- **ESLint** - Linting de código

## 📁 Estructura del Proyecto

```
million-monorepo/
├── apps/
│   ├── api/                          # Backend .NET
│   │   ├── Api/                      # Capa de presentación
│   │   │   ├── Controllers/          # Controladores REST
│   │   │   ├── Middlewares/          # Middlewares personalizados
│   │   │   └── DI/                   # Inyección de dependencias
│   │   ├── Application/              # Capa de aplicación
│   │   │   ├── Abstractions/         # Interfaces
│   │   │   ├── Behaviors/            # Comportamientos
│   │   │   └── Properties/           # Casos de uso
│   │   ├── Domain/                   # Capa de dominio
│   │   │   ├── Entities/             # Entidades de negocio
│   │   │   ├── ValueObjects/         # Objetos de valor
│   │   │   └── Errors/               # Errores de dominio
│   │   └── Infrastructure/           # Capa de infraestructura
│   │       └── Persistence/          # Repositorios y contexto
│   └── web/                          # Frontend Next.js
│       ├── src/
│       │   ├── app/                  # App Router (Next.js 13+)
│       │   │   ├── api/              # API Routes
│       │   │   └── globals.css       # Estilos globales
│       │   ├── domain/              # Lógica de dominio
│       │   │   ├── entities/         # Entidades
│       │   │   ├── schemas/          # Esquemas Zod
│       │   │   └── value-objects/    # Objetos de valor
│       │   ├── application/          # Casos de uso
│       │   │   ├── services/         # Servicios de aplicación
│       │   │   └── use-cases/        # Casos de uso específicos
│       │   ├── infrastructure/      # Adaptadores externos
│       │   │   ├── api/              # Clientes API
│       │   │   ├── repositories/     # Implementación repositorios
│       │   │   └── mappers/          # Mapeadores
│       │   ├── presentation/         # Capa de presentación
│       │   │   ├── components/       # Componentes React
│       │   │   ├── pages/            # Páginas
│       │   │   └── hooks/            # Hooks personalizados
│       │   └── store/                # Estado global (Redux)
│       └── tests/                    # Tests
├── shared/                           # Código compartido
│   ├── contracts/                    # DTOs y contratos
│   ├── eslint-config/               # Configuración ESLint
│   └── tsconfig/                    # Configuración TypeScript
├── infra/                           # Infraestructura
│   ├── docker/                      # Dockerfiles
│   ├── docker-compose.yml          # Orquestación de servicios
│   └── db/                         # Scripts de base de datos
└── docs/                           # Documentación
```

## 🚀 Configuración Inicial

### Prerrequisitos
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **.NET 8 SDK**
- **Docker** y **Docker Compose**
- **Git**

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd million-monorepo
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivos de ejemplo
cp apps/api/Api/appsettings.Development.json.example apps/api/Api/appsettings.Development.json
cp apps/web/.env.local.example apps/web/.env.local
```

4. **Levantar servicios con Docker**
```bash
cd infra
docker-compose up -d
```

5. **Ejecutar migraciones y seeding**
```bash
# Para poblar la base de datos con datos de prueba
cd infra/db/scripts
node seed.ts
```

## 💻 Desarrollo

### Comandos Principales

```bash
# Desarrollo completo (todos los servicios)
pnpm dev

# Desarrollo específico
pnpm dev --filter=web    # Solo frontend
pnpm dev --filter=api    # Solo backend

# Build completo
pnpm build

# Testing
pnpm test               # Todos los tests
pnpm test --filter=web  # Tests del frontend
pnpm test --filter=api  # Tests del backend

# Linting
pnpm lint

# Limpiar caché
pnpm clean
```

### Servicios de Desarrollo

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | http://localhost:3000 | Next.js con Turbopack |
| Backend API | http://localhost:5000 | .NET API |
| Swagger UI | http://localhost:5000/swagger | Documentación API |
| MongoDB | localhost:27017 | Base de datos |
| Mongo Express | http://localhost:8081 | Admin de MongoDB |

### Estructura de Desarrollo

#### Frontend (Next.js)
```bash
cd apps/web

# Desarrollo
pnpm dev

# Build
pnpm build

# Tests
pnpm test
pnpm test:coverage
```

#### Backend (.NET)
```bash
cd apps/api

# Desarrollo
dotnet run --project Api/Api.csproj

# Build
dotnet build

# Tests
dotnet test
```

## 🧪 Testing

### Frontend Testing
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **MSW** - Mock Service Worker para API mocking
- **Coverage** - Cobertura de código con Istanbul

```bash
# Ejecutar tests
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests en modo watch
pnpm test:watch
```

### Backend Testing
- **xUnit** - Framework de testing
- **FluentAssertions** - Assertions más legibles
- **Moq** - Mocking framework

```bash
# Ejecutar tests
dotnet test

# Tests con coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Cobertura de Tests
- **Frontend**: > 80% cobertura
- **Backend**: > 85% cobertura
- **Integración**: Tests E2E con Playwright

## 🚀 Despliegue

### Docker

```bash
# Build de todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Producción

#### Frontend (Vercel/Netlify)
```bash
# Build para producción
pnpm build --filter=web

# Deploy automático con Vercel
vercel --prod
```

#### Backend (Azure/AWS)
```bash
# Build para producción
dotnet publish -c Release

# Deploy con Docker
docker build -t million-api .
docker run -p 5000:5000 million-api
```

## 📚 API Documentation

### Endpoints Principales

#### Propiedades
```http
GET    /api/properties              # Listar propiedades
GET    /api/properties/{id}         # Obtener propiedad por ID
POST   /api/properties              # Crear nueva propiedad
PUT    /api/properties/{id}         # Actualizar propiedad
DELETE /api/properties/{id}         # Eliminar propiedad
```

#### Mock Data (Desarrollo)
```http
GET    /api/mock/properties         # Listar propiedades mock
GET    /api/mock/properties/{id}    # Obtener propiedad mock
```

### Parámetros de Query

```http
GET /api/properties?page=1&limit=10&search=casa&minPrice=100000&maxPrice=500000&type=House
```

### Respuesta de Ejemplo

```json
{
  "properties": [
    {
      "id": "prop-001",
      "name": "Modern Luxury Villa",
      "address": "1247 Sunset Boulevard",
      "city": "Los Angeles",
      "price": 2800000,
      "image": "https://images.unsplash.com/...",
      "bedrooms": 5,
      "bathrooms": 4,
      "area": 84,
      "areaUnit": "m²",
      "propertyType": "Villa"
    }
  ],
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

## 🎨 Sistema de Diseño

### Tema ESTATELY

#### Paleta de Colores

**Tema Claro**
```css
--light-bg: #FAF9F7        /* Fondo cálido */
--light-text: #2A2621      /* Texto oscuro rico */
--light-accent: #C9A961    /* Acento dorado de lujo */
--light-card: #FFFFFF      /* Tarjetas blancas */
--light-border: #E8E6E1    /* Bordes sutiles */
```

**Tema Oscuro**
```css
--dark-bg: #0F0F0F         /* Fondo negro profundo */
--dark-text: #E8E6E1       /* Texto claro cálido */
--dark-accent: #D4AF6A     /* Acento dorado cálido */
--dark-card: #1A1916       /* Tarjetas oscuras ricas */
--dark-border: #2D2A26     /* Bordes oscuros sutiles */
```

#### Tipografía
- **Títulos**: Playfair Display (serif, elegante)
- **Cuerpo**: Playfair Display
- **UI**: Inter (sans-serif, limpio)

#### Componentes
- **Tarjetas**: Sombras elevadas, efectos hover
- **Botones**: Acento dorado primario, bordeado secundario
- **Inputs**: Bordes sutiles con estados de foco
- **Transiciones**: Animaciones suaves 200-300ms

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Million Properties
```

#### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://admin:password123@localhost:27017/million_properties?authSource=admin"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Docker Compose Personalizado

```yaml
# infra/docker-compose.override.yml
version: '3.8'
services:
  web:
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    volumes:
      - ../apps/web:/app
      - /app/node_modules
      - /app/.next
```

## 📊 Monitoreo y Logging

### Logging Estructurado
- **Serilog** en backend con sinks a consola y archivo
- **Logs rotativos** diarios en `logs/api-{date}.txt`
- **Niveles de log** configurables por entorno

### Métricas de Performance
- **Lighthouse** scores objetivo:
  - Performance: ≥ 90
  - Accessibility: ≥ 95
  - Best Practices: ≥ 90
  - SEO: ≥ 90

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint** para JavaScript/TypeScript
- **Prettier** para formateo de código
- **Husky** para pre-commit hooks
- **Conventional Commits** para mensajes de commit

### Testing Requirements
- Tests unitarios para nueva funcionalidad
- Tests de integración para APIs
- Cobertura mínima del 80%
- Documentación actualizada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: Next.js, React, TypeScript
- **Desarrollo Backend**: .NET, Clean Architecture
- **DevOps**: Docker, CI/CD
- **Diseño**: Sistema de diseño ESTATELY

## 📞 Soporte

Para soporte técnico o preguntas:
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/your-repo/wiki)
- **Email**: support@million-properties.com

---

**Desarrollado con ❤️ usando Clean Architecture y las mejores prácticas de desarrollo moderno.**