'use client';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export function EmptyState({ 
  title = "No Properties Found",
  message = "We couldn't find any properties matching your criteria. Try adjusting your filters.",
  onReset 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="status">
      {/* Icon */}
      <div className="mb-6 p-6 rounded-full bg-secondary/10">
        <svg
          className="w-16 h-16 text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-secondary max-w-md mb-6">
        {message}
      </p>

      {/* Reset button */}
      {onReset && (
        <button
          onClick={onReset}
          className="btn-primary"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

