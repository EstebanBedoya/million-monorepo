'use client';

import { ThemeToggle } from '@/presentation/components/molecules/ThemeToggle';
import { LanguageSwitcher } from '@/presentation/components/molecules/LanguageSwitcher';
import { type Locale } from '@/i18n';

interface HeaderProps {
  currentLang: Locale;
}

export function Header({ currentLang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-foreground">MILLION</h1>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher currentLang={currentLang} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
