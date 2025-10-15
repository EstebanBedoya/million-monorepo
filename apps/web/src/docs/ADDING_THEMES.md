# Cómo Agregar Nuevos Temas 🎨

El sistema de temas ha sido refactorizado para ser súper fácil de extender. Aquí te explico cómo agregar un nuevo tema en solo 3 pasos:

## 🚀 Pasos para Agregar un Nuevo Tema

### 1. Agregar el tema al objeto THEMES

En `useTheme.ts`, simplemente agrega tu nuevo tema al objeto `THEMES`:

```typescript
const THEMES = {
  // ... temas existentes
  miNuevoTema: {
    name: 'miNuevoTema',
    displayName: '🌟 Mi Nuevo Tema',
    classes: ['mi-nuevo-tema', 'theme-mi-nuevo-tema'],
    isDefault: false
  }
} as const;
```

### 2. Agregar las variables CSS

En `globals.css`, agrega las variables CSS para tu tema:

```css
/* Mi Nuevo Tema */
.mi-nuevo-tema {
  /* Variables específicas del tema */
  --mi-bg: #COLOR_BACKGROUND;
  --mi-text: #COLOR_TEXT;
  --mi-accent: #COLOR_ACCENT;
  --mi-card: #COLOR_CARD;
  --mi-border: #COLOR_BORDER;
  
  /* Mapeo semántico */
  --background: var(--mi-bg);
  --foreground: var(--mi-text);
  --accent: var(--mi-accent);
  --border: var(--mi-border);
  --card: var(--mi-card);
}

.theme-mi-nuevo-tema {
  --background: var(--mi-bg);
  --foreground: var(--mi-text);
  --accent: var(--mi-accent);
  --border: var(--mi-border);
  --card: var(--mi-card);
}
```

### 3. Agregar colores a Tailwind (opcional)

En `tailwind.config.ts`, agrega los colores específicos:

```typescript
colors: {
  // ... colores existentes
  'mi-bg': 'var(--mi-bg)',
  'mi-text': 'var(--mi-text)',
  'mi-accent': 'var(--mi-accent)',
  'mi-card': 'var(--mi-card)',
  'mi-border': 'var(--mi-border)',
}
```

### 4. Actualizar el orden de temas

En `useTheme.ts`, agrega tu tema al array `THEME_ORDER`:

```typescript
const THEME_ORDER: Theme[] = ['light', 'dark', 'mcdonalds', 'cyberpunk', 'miNuevoTema'];
```

## ✨ ¡Eso es todo!

El sistema automáticamente:
- ✅ Detectará tu nuevo tema
- ✅ Lo incluirá en el ciclo de toggle
- ✅ Generará los botones dinámicamente
- ✅ Aplicará las clases CSS correctas
- ✅ Persistirá la selección en localStorage

## 🎯 Ejemplo Completo: Tema "Ocean"

```typescript
// 1. En useTheme.ts
ocean: {
  name: 'ocean',
  displayName: '🌊 Ocean',
  classes: ['ocean', 'theme-ocean'],
  isDefault: false
}

// 2. En globals.css
.ocean {
  --ocean-bg: #006994;
  --ocean-text: #FFFFFF;
  --ocean-accent: #00BFFF;
  --ocean-card: #004D6B;
  --ocean-border: #00BFFF;
  
  --background: var(--ocean-bg);
  --foreground: var(--ocean-text);
  --accent: var(--ocean-accent);
  --border: var(--ocean-border);
  --card: var(--ocean-card);
}

// 3. En THEME_ORDER
const THEME_ORDER: Theme[] = ['light', 'dark', 'mcdonalds', 'cyberpunk', 'ocean'];
```

## 🔧 Características del Sistema Refactorizado

### ✅ **Sin Switch Cases**
- Usa objetos y early returns
- Código más limpio y mantenible
- Fácil de leer y entender

### ✅ **Sin Else Statements**
- Early returns para mejor legibilidad
- Flujo de código más claro
- Menos anidamiento

### ✅ **Configuración Declarativa**
- Todo en un solo objeto `THEMES`
- Fácil de modificar y extender
- TypeScript support automático

### ✅ **API Mejorada**
```typescript
const {
  theme,           // tema actual
  themeInfo,       // información del tema
  toggleTheme,     // siguiente tema
  setTheme,        // tema específico
  getAllThemes,    // todos los temas
  getNextTheme,    // próximo tema
  isLight,         // checkers
  isDark,
  isMcDonalds
} = useTheme();
```

## 🎨 Temas Disponibles

- ☀️ **Light**: Lujoso y claro
- 🌙 **Dark**: Moderno y artístico  
- 🍟 **McDonald's**: Para los memes
- 🤖 **Cyberpunk**: Futurista y neon

¡El sistema está diseñado para ser súper flexible y fácil de extender! 🚀
