import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../../../src/presentation/components/molecules/EmptyState';

describe('EmptyState', () => {
  it('should render with default props', () => {
    render(<EmptyState />);

    expect(screen.getByText('No Properties Found')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any properties matching your criteria/i)).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(
      <EmptyState 
        title="Custom Title" 
        message="Custom message here"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message here')).toBeInTheDocument();
  });

  it('should render reset button when onReset is provided', () => {
    const mockOnReset = jest.fn();
    render(<EmptyState onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /Clear all filters/i });
    expect(resetButton).toBeInTheDocument();
  });

  it('should not render reset button when onReset is not provided', () => {
    render(<EmptyState />);

    const resetButton = screen.queryByRole('button', { name: /Clear all filters/i });
    expect(resetButton).not.toBeInTheDocument();
  });

  it('should call onReset when button is clicked', async () => {
    const mockOnReset = jest.fn();
    render(<EmptyState onReset={mockOnReset} />);

    const resetButton = screen.getByRole('button', { name: /Clear all filters/i });
    await userEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<EmptyState />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

