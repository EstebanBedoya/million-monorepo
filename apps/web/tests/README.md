# Test Suite Documentation

Esta suite de tests está diseñada para cubrir todos los aspectos del proyecto web, desde tests unitarios hasta tests end-to-end.

## Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   ├── hooks/              # Tests para hooks personalizados
│   ├── components/         # Tests para componentes React
│   ├── services/          # Tests para servicios
│   └── use-cases/          # Tests para casos de uso
├── integration/            # Tests de integración
│   └── redux/             # Tests para Redux store
├── e2e/                   # Tests end-to-end
└── README.md              # Esta documentación
```

## Tipos de Tests

### 1. Tests Unitarios

#### Hooks (`tests/unit/hooks/`)
- **useTheme.test.tsx**: Tests para el hook de gestión de temas
- **useProperties.test.tsx**: Tests para el hook de gestión de propiedades

#### Componentes (`tests/unit/components/`)
- **PropertyCard.test.tsx**: Tests para el componente de tarjeta de propiedad
- **PropertyList.test.tsx**: Tests para el componente de lista de propiedades
- **ThemeDemo.test.tsx**: Tests para el componente de demostración de temas

#### Servicios (`tests/unit/services/`)
- **PropertyServiceImpl.test.ts**: Tests para el servicio de propiedades

#### Casos de Uso (`tests/unit/use-cases/`)
- **GetPropertyUseCase.test.ts**: Tests para el caso de uso de obtener propiedad
- **GetAllPropertiesUseCase.test.ts**: Tests para el caso de uso de obtener todas las propiedades
- **CreatePropertyUseCase.test.ts**: Tests para el caso de uso de crear propiedad

### 2. Tests de Integración

#### Redux (`tests/integration/redux/`)
- **propertySlice.test.ts**: Tests para el slice de Redux de propiedades
- **propertySelectors.test.ts**: Tests para los selectores de Redux

### 3. Tests End-to-End

#### E2E (`tests/e2e/`)
- **homepage.spec.ts**: Tests para la página principal
- **theme-demo.spec.ts**: Tests para la página de demostración de temas
- **properties.spec.ts**: Tests para la página de propiedades

## Configuración

### Jest (Tests Unitarios e Integración)

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Playwright (Tests E2E)

```bash
# Instalar navegadores de Playwright
npx playwright install

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests E2E en modo UI
npx playwright test --ui

# Ejecutar tests E2E en modo debug
npx playwright test --debug
```

## Cobertura de Tests

La suite de tests está configurada para mantener una cobertura mínima del 80% en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)

## Herramientas Utilizadas

### Testing Framework
- **Jest**: Framework principal para tests unitarios e integración
- **React Testing Library**: Para tests de componentes React
- **Playwright**: Para tests end-to-end

### Mocks y Utilities
- **Jest Mocks**: Para simular dependencias
- **MSW (Mock Service Worker)**: Para interceptar requests HTTP
- **Custom Test Utilities**: Helpers personalizados para tests

## Mejores Prácticas

### 1. Tests Unitarios
- Cada test debe ser independiente
- Usar mocks para dependencias externas
- Testear casos edge y errores
- Mantener tests simples y legibles

### 2. Tests de Integración
- Testear la interacción entre componentes
- Verificar el flujo de datos completo
- Testear estados de Redux

### 3. Tests E2E
- Testear flujos de usuario completos
- Verificar la funcionalidad en diferentes navegadores
- Testear responsividad

## Comandos Útiles

```bash
# Ejecutar tests específicos
npm run test -- --testNamePattern="useTheme"

# Ejecutar tests de un archivo específico
npm run test -- PropertyCard.test.tsx

# Ejecutar tests con verbose output
npm run test -- --verbose

# Ejecutar tests E2E en un navegador específico
npx playwright test --project=chromium

# Generar reporte de cobertura
npm run test:coverage
```

## Debugging

### Tests Unitarios
```bash
# Ejecutar tests en modo debug
npm run test -- --detectOpenHandles --forceExit
```

### Tests E2E
```bash
# Ejecutar tests E2E en modo debug
npx playwright test --debug

# Ejecutar tests E2E con headed mode
npx playwright test --headed
```

## CI/CD

Los tests están configurados para ejecutarse en pipelines de CI/CD:

```yaml
# Ejemplo de configuración para GitHub Actions
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run E2E Tests
  run: npm run test:e2e
```

## Mantenimiento

### Agregar Nuevos Tests
1. Crear el archivo de test en la carpeta correspondiente
2. Seguir las convenciones de nomenclatura
3. Asegurar cobertura adecuada
4. Documentar casos edge

### Actualizar Tests Existentes
1. Verificar que los tests sigan siendo relevantes
2. Actualizar mocks si es necesario
3. Mantener la cobertura de código
4. Refactorizar tests complejos

## Troubleshooting

### Problemas Comunes

1. **Tests fallan en CI pero pasan localmente**
   - Verificar variables de entorno
   - Revisar configuración de timeouts
   - Verificar dependencias

2. **Tests E2E son flaky**
   - Aumentar timeouts
   - Usar waitForLoadState
   - Verificar selectores

3. **Cobertura insuficiente**
   - Revisar archivos no cubiertos
   - Agregar tests para casos edge
   - Verificar configuración de Jest

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
