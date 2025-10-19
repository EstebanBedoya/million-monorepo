'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { i18n, type Locale } from '@/i18n';
import { Icon } from '@/presentation/components/atoms/Icon';

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLang: Locale) => {
    if (!pathname) return;
    
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Icon icon={Globe} size="sm" className="text-muted-foreground" />
      <div className="flex gap-1">
        {i18n.locales.map((locale) => (
          <button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              currentLang === locale
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            aria-label={`Switch to ${locale === 'en' ? 'English' : 'Spanish'}`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

