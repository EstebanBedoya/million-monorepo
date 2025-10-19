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
        variant="ghost"
        size="sm"
        className={`p-2 rounded-md hover:bg-secondary transition-colors ${className}`}
        aria-label="Toggle theme"
        title="Toggle theme"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const ThemeIcon = theme === 'light' ? Moon : Sun;

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={`p-2 rounded-md hover:bg-secondary transition-colors ${className}`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Icon icon={ThemeIcon} size="sm" aria-hidden={true} />
    </Button>
  );
}
