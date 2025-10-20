import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '../../../src/presentation/components/molecules/ErrorState';

describe('ErrorState', () => {
  it('should render with error message', () => {
    render(<ErrorState error="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    render(<ErrorState error={new Error('Custom error message')} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorState error="Error occurred" onRetry={onRetry} />);
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState error="Error occurred" />);
    expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorState error="Error occurred" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<ErrorState error="Error occurred" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should handle network errors', () => {
    render(<ErrorState error="network error occurred" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

