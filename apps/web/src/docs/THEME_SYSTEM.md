# Sistema de Temas - Light, Dark & McDonald's 🍟

Este proyecto implementa un sistema de temas triple (light, dark y McDonald's) usando Tailwind CSS con variables CSS personalizadas.

## 🎨 Paleta de Colores

### Light Theme (Lujoso y Claro)
- **Background**: `#FAF9F7` (hueso suave)
- **Text Primary**: `#1C1C1C` (casi negro cálido)
- **Accent Gold**: `#D4AF37` (dorado sutil)
- **Borders**: `#E5E5E5`
- **Cards**: `#FFFFFF` con sombras suaves

### Dark Theme (Moderno y Artístico)
- **Background**: `#121212`
- **Text Primary**: `#F5F5F5`
- **Accent Gold**: `#CBAF7A` (más cálido que en light)
- **Cards**: `#1F1F1F`
- **Borders**: `#2A2A2A`

### McDonald's Theme (Para los memes 🍟)
- **Background**: `#FFD700` (amarillo dorado)
- **Text Primary**: `#C41E3A` (rojo McDonald's)
- **Accent**: `#C41E3A` (rojo McDonald's)
- **Secondary**: `#FFD700` (amarillo dorado)
- **Cards**: `#FFFFFF` (blanco)
- **Borders**: `#C41E3A` (rojo McDonald's)

## 🚀 Uso

### 1. Hook useTheme

```tsx
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const { theme, toggleTheme, setTheme, isDark, isLight, isMcDonalds } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch Theme (Light → Dark → McDonald's → Light)
      </button>
      <button onClick={() => setTheme('mcdonalds')}>
        🍟 Go McDonald's!
      </button>
    </div>
  );
};
```

### 2. Clases de Tailwind

```tsx
// Usar colores semánticos
<div className="bg-background text-foreground">
  <div className="bg-card border border-border">
    <button className="bg-accent text-white">
      Button
    </button>
  </div>
</div>

// Usar colores específicos del tema
<div className="bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
  Content
</div>
```

### 3. Variables CSS Directas

```css
.my-custom-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

## 🎯 Clases Disponibles

### Colores Semánticos
- `bg-background` / `text-foreground`
- `bg-card` / `border-border`
- `bg-accent` / `text-accent`

### Colores Específicos del Tema
- **Light**: `bg-light-bg`, `text-light-text`, `bg-light-accent`, etc.
- **Dark**: `bg-dark-bg`, `text-dark-text`, `bg-dark-accent`, etc.
- **McDonald's**: `bg-mcd-bg`, `text-mcd-text`, `bg-mcd-accent`, `bg-mcd-secondary`, etc.

### Sombras
- `shadow-soft` (para light theme)
- `shadow-soft-dark` (para dark theme)

## 🔧 Configuración

El sistema está configurado en:
- `tailwind.config.ts` - Configuración de colores y darkMode
- `globals.css` - Variables CSS y estilos base
- `useTheme.ts` - Hook para manejo de estado del tema

## 🍟 Tema McDonald's (Para los memes)

El tema McDonald's es perfecto para:
- 🎉 Demostraciones divertidas
- 🍔 Apps relacionadas con comida
- 😄 Proyectos que necesitan un toque humorístico
- 🏆 Mostrar la versatilidad del sistema de temas

### Características especiales:
- Colores icónicos rojo y amarillo
- Sección especial que aparece solo en este tema
- Botones con emojis de comida
- "I'm lovin' it!" vibes 🎵

## 📱 Características

- ✅ Cambio automático basado en preferencias del sistema
- ✅ Persistencia en localStorage
- ✅ Transiciones suaves entre temas
- ✅ Compatible con SSR (Next.js)
- ✅ TypeScript support
- ✅ Accesibilidad mejorada
- ✅ 3 temas disponibles (Light, Dark, McDonald's)
- ✅ Toggle cíclico entre todos los temas
