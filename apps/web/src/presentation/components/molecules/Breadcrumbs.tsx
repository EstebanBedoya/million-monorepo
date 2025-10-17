'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Icon } from '../atoms/Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={className}
    >
      <ol className="flex items-center space-x-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  icon={ChevronRight} 
                  size="sm" 
                  className="text-secondary mx-2" 
                  aria-hidden={true}
                />
              )}
              
              {isLast || !item.href ? (
                <span 
                  className="text-sm font-medium text-foreground"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

