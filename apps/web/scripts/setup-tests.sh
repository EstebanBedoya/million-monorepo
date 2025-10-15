#!/bin/bash

# Script para configurar el entorno de testing
echo "🚀 Configurando entorno de testing..."

# Instalar dependencias de testing
echo "📦 Instalando dependencias de testing..."
npm install --save-dev @playwright/test @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom

# Instalar navegadores de Playwright
echo "🌐 Instalando navegadores de Playwright..."
npx playwright install

# Crear directorios de tests si no existen
echo "📁 Creando estructura de directorios..."
mkdir -p tests/unit/hooks
mkdir -p tests/unit/components
mkdir -p tests/unit/services
mkdir -p tests/unit/use-cases
mkdir -p tests/integration/redux
mkdir -p tests/e2e

# Verificar configuración
echo "✅ Verificando configuración..."

# Verificar Jest
if [ -f "jest.config.js" ]; then
    echo "✅ Jest configurado correctamente"
else
    echo "❌ Jest no está configurado"
fi

# Verificar Playwright
if [ -f "playwright.config.ts" ]; then
    echo "✅ Playwright configurado correctamente"
else
    echo "❌ Playwright no está configurado"
fi

# Verificar setup de Jest
if [ -f "jest.setup.js" ]; then
    echo "✅ Jest setup configurado correctamente"
else
    echo "❌ Jest setup no está configurado"
fi

echo "🎉 Configuración de testing completada!"
echo ""
echo "Comandos disponibles:"
echo "  npm run test          - Ejecutar tests unitarios"
echo "  npm run test:watch    - Ejecutar tests en modo watch"
echo "  npm run test:coverage - Ejecutar tests con cobertura"
echo "  npm run test:e2e      - Ejecutar tests E2E"
echo ""
echo "Para más información, consulta tests/README.md"
