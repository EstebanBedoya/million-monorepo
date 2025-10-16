'use client';

import { ReactNode } from 'react';

interface FiltersTemplateProps {
  children: ReactNode;
  className?: string;
}

export function FiltersTemplate({ children, className }: FiltersTemplateProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-sm mb-8 ${className}`}>
      {children}
    </div>
  );
}
