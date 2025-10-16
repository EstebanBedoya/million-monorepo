'use client';

import { Spinner } from '../atoms/Spinner';

export interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export function LoadingState({ 
  message = 'Loading properties...',
  showSpinner = true,
  className = ''
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`} role="status">
      {showSpinner && (
        <div className="mb-4">
          <Spinner size="lg" label={message} />
        </div>
      )}
      
      <p className="text-secondary text-lg">
        {message}
      </p>
    </div>
  );
}
