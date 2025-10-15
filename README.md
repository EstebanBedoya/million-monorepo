# Million Monorepo

Un monorepo para una aplicación de propiedades inmobiliarias con arquitectura limpia.

## Estructura

- `apps/api/` - Backend .NET con Clean Architecture
- `apps/web/` - Frontend Next.js con Clean Architecture adaptada
- `shared/` - Configuraciones y contratos compartidos
- `infra/` - Docker, scripts de base de datos y configuración

## Tecnologías

- **Backend**: .NET 8/9, MongoDB, Clean Architecture
- **Frontend**: Next.js 14, TypeScript, React Query
- **Monorepo**: pnpm workspaces
- **Infraestructura**: Docker, Docker Compose

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Ejecutar tests
pnpm test
```
