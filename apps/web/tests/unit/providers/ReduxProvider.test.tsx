import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { useAppSelector } from '@/store/hooks';

// Test component that uses Redux
function TestComponent() {
  const theme = useAppSelector((state) => state.ui.theme);
  return <div>Theme: {theme}</div>;
}

describe('ReduxProvider', () => {
  it('should provide Redux store to children', () => {
    render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );
    
    expect(screen.getByText(/Theme:/)).toBeInTheDocument();
  });

  it('should render children components', () => {
    render(
      <ReduxProvider>
        <div data-testid="child">Child Component</div>
      </ReduxProvider>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});

