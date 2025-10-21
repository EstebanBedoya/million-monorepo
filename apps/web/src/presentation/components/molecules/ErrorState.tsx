'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useDictionary } from '@/i18n/client';

export interface ErrorStateProps {
  error: Error | string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  error, 
  onRetry,
  className 
}: ErrorStateProps) {
  const dict = useDictionary();
  const errorMessage = error instanceof Error ? error.message : error;
  const isNetworkError = errorMessage?.includes('fetch') || errorMessage?.includes('network');
  const isTimeoutError = errorMessage?.includes('timeout');

  const getErrorTitle = () => {
    if (isTimeoutError) return dict.errors.server;
    if (isNetworkError) return dict.errors.network;
    return dict.errors.generic;
  };

  const getErrorMessage = () => {
    if (isTimeoutError) {
      return dict.errors.server;
    }
    if (isNetworkError) {
      return dict.errors.network;
    }
    return dict.errors.generic;
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`} role="alert">
      {/* Error Icon */}
      <div className="mb-6 p-6 rounded-full bg-destructive/10">
        <Icon 
          icon={AlertTriangle} 
          size="xl" 
          className="text-destructive"
          aria-hidden={true}
        />
      </div>

      {/* Error Content */}
      <h3 className="text-2xl font-semibold text-foreground mb-3">
        {getErrorTitle()}
      </h3>
      
      <p className="text-secondary max-w-md mb-6">
        {getErrorMessage()}
      </p>

      {/* Error Details (for development) */}
      {process.env.NODE_ENV === 'development' && errorMessage && (
        <details className="mb-6 text-left max-w-md">
          <summary className="text-sm text-secondary cursor-pointer hover:text-foreground">
            {dict.errors.generic}
          </summary>
          <pre className="mt-2 p-3 bg-muted rounded text-xs text-muted-foreground overflow-auto">
            {errorMessage}
          </pre>
        </details>
      )}

      {/* Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="lg"
          className="gap-2"
          aria-label={dict.common.retry}
        >
          <Icon icon={RefreshCw} size="sm" />
          {dict.common.retry}
        </Button>
      )}
    </div>
  );
}
