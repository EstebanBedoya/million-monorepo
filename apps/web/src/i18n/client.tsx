'use client';

import { createContext, useContext } from 'react';
import type { Dictionary } from './types';
import type { Locale } from './config';

interface I18nContextValue {
  lang: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  lang,
  dict,
}: {
  children: React.ReactNode;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <I18nContext.Provider value={{ lang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export function useDictionary() {
  const { dict } = useI18n();
  return dict;
}

export function useLocale() {
  const { lang } = useI18n();
  return lang;
}

