'use client';

import { Spinner } from '../atoms/Spinner';
import { useDictionary } from '../../../i18n/client';

export interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export function LoadingState({ 
  message,
  showSpinner = true,
  className = ''
}: LoadingStateProps) {
  const dict = useDictionary();
  const displayMessage = message || dict.common.loading;
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`} role="status">
      {showSpinner && (
        <div className="mb-4">
          <Spinner size="lg" label={displayMessage} />
        </div>
      )}
      
      <p className="text-secondary text-lg">
        {displayMessage}
      </p>
    </div>
  );
}
