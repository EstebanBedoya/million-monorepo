'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/presentation/components/atoms/Button';
import { Icon } from '@/presentation/components/atoms/Icon';
import { useTheme } from '@/presentation/hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="secondary"
        size="lg"
        className={`fixed top-4 right-4 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 ${className}`}
        aria-label="Toggle theme"
        title="Toggle theme"
        disabled
      >
        <div className="w-6 h-6" />
      </Button>
    );
  }

  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="lg"
      className={`fixed top-4 right-4 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 ${className}`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Icon icon={ThemeIcon} size="lg" aria-hidden={true} />
    </Button>
  );
}
