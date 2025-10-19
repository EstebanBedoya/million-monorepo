'use client';

// import { useState } from 'react'; // Removed unused import
import { X, Filter } from 'lucide-react';
import { Icon } from '../atoms/Icon';
import { FiltersBar, FilterValues } from './FiltersBar';

interface SidebarProps {
  onFilterChange: (filters: FilterValues) => void;
  defaultFilters?: Partial<FilterValues>;
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function Sidebar({ onFilterChange, defaultFilters, isOpen, onToggle, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-full lg:h-screen
          w-80 lg:w-80
          bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon icon={Filter} size="sm" className="text-accent" />
            <h2 className="font-semibold text-foreground">Filters</h2>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-secondary/10 rounded-md transition-colors"
            aria-label="Close filters"
          >
            <Icon icon={X} size="sm" className="text-foreground" />
          </button>
        </div>

        {/* Filters content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FiltersBar 
            onFilterChange={(filters) => {
              onFilterChange(filters);
              // Close sidebar on mobile after applying filters
              if (onClose && window.innerWidth < 1024) {
                setTimeout(onClose, 300);
              }
            }}
            defaultFilters={defaultFilters}
          />
        </div>
      </aside>
    </>
  );
}
