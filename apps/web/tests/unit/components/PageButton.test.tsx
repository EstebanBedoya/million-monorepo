import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageButton } from '@/presentation/components/molecules/PageButton';

// Mock useDictionary hook
jest.mock('@/i18n/client', () => ({
  useDictionary: () => ({
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
    },
  }),
}));

describe('PageButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render previous button', () => {
    render(<PageButton direction="prev" disabled={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Previous' });
    expect(button).toBeInTheDocument();
  });

  it('should render next button', () => {
    render(<PageButton direction="next" disabled={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<PageButton direction="next" disabled={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<PageButton direction="next" disabled={true} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled and clicked', () => {
    render(<PageButton direction="next" disabled={true} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<PageButton direction="next" disabled={false} onClick={mockOnClick} className="custom-class" />);
    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).toHaveClass('custom-class');
  });
});

