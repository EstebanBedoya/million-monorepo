import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageNumberButton } from '@/presentation/components/molecules/PageNumberButton';

// Mock useDictionary hook
jest.mock('@/i18n/client', () => ({
  useDictionary: () => ({
    pagination: {
      page: 'Page',
    },
  }),
}));

describe('PageNumberButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with page number', () => {
    render(<PageNumberButton page={5} isActive={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Page 5' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('5');
  });

  it('should call onClick when clicked', () => {
    render(<PageNumberButton page={3} isActive={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Page 3' });
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have aria-current="page" when active', () => {
    render(<PageNumberButton page={2} isActive={true} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Page 2' });
    expect(button).toHaveAttribute('aria-current', 'page');
  });

  it('should not have aria-current when not active', () => {
    render(<PageNumberButton page={2} isActive={false} onClick={mockOnClick} />);
    const button = screen.getByRole('button', { name: 'Page 2' });
    expect(button).not.toHaveAttribute('aria-current');
  });

  it('should apply custom className', () => {
    render(<PageNumberButton page={1} isActive={false} onClick={mockOnClick} className="custom-class" />);
    const button = screen.getByRole('button', { name: 'Page 1' });
    expect(button).toHaveClass('custom-class');
  });
});

