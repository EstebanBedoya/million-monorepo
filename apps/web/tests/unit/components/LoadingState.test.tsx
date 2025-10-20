import { render, screen } from '@testing-library/react';
import { LoadingState } from '../../../src/presentation/components/molecules/LoadingState';

describe('LoadingState', () => {
  it('should render with default loading message', () => {
    render(<LoadingState />);
    const loadingElements = screen.getAllByText('Loading');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should render custom loading message', () => {
    render(<LoadingState message="Please wait..." />);
    const messages = screen.getAllByText('Please wait...');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('should render spinner', () => {
    const { container } = render(<LoadingState />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingState />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

