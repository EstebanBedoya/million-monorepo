import React from 'react';
import { render, screen } from '@testing-library/react';
import { AsyncBoundary } from '../../../src/presentation/components/molecules/AsyncBoundary';

describe('AsyncBoundary', () => {
  const mockChildren = <div data-testid="content">Content</div>;

  it('renders children when no loading, error, or empty state', () => {
    render(
      <AsyncBoundary>
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    render(
      <AsyncBoundary loading={true}>
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    const error = new Error('Test error');
    
    render(
      <AsyncBoundary error={error}>
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('renders empty state when isEmpty is true', () => {
    render(
      <AsyncBoundary isEmpty={true}>
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No Properties Found')).toBeInTheDocument();
  });

  it('prioritizes loading over error and empty states', () => {
    render(
      <AsyncBoundary 
        loading={true} 
        error={new Error('Test error')} 
        isEmpty={true}
      >
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('prioritizes error over empty state', () => {
    render(
      <AsyncBoundary 
        error={new Error('Test error')} 
        isEmpty={true}
      >
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('No Properties Found')).not.toBeInTheDocument();
  });

  it('renders custom empty title and message', () => {
    render(
      <AsyncBoundary 
        isEmpty={true}
        emptyTitle="Custom Title"
        emptyMessage="Custom message"
      >
        {mockChildren}
      </AsyncBoundary>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });
});
