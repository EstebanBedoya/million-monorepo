'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useTheme } from '../../hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="lg"
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Icon icon={Moon} size="lg" aria-hidden="true" />
      ) : (
        <Icon icon={Sun} size="lg" aria-hidden="true" />
      )}
    </Button>
  );
}
