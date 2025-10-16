import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '../../../src/presentation/components/molecules/ErrorState';

describe('ErrorState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error state with error message', () => {
    const error = new Error('Test error message');
    
    render(
      <ErrorState error={error} />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an error while loading the properties. Please try again.')).toBeInTheDocument();
  });

  it('renders string error', () => {
    render(
      <ErrorState error="String error message" />
    );

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('renders network error with appropriate title and message', () => {
    const networkError = new Error('fetch failed');
    
    render(
      <ErrorState error={networkError} />
    );

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument();
  });

  it('renders timeout error with appropriate title and message', () => {
    const timeoutError = new Error('timeout occurred');
    
    render(
      <ErrorState error={timeoutError} />
    );

    expect(screen.getByText('Request Timeout')).toBeInTheDocument();
    expect(screen.getByText('The request took too long to complete. Please try again.')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const error = new Error('Test error');
    
    render(
      <ErrorState error={error} onRetry={mockOnRetry} />
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    const error = new Error('Test error');
    
    render(
      <ErrorState error={error} />
    );

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('shows technical details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error message');
    
    render(
      <ErrorState error={error} />
    );

    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('does not show technical details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Test error message');
    
    render(
      <ErrorState error={error} />
    );

    expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});
