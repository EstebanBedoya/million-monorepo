import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Range } from '@/presentation/components/atoms/Range';

describe('Range', () => {
  it('should render a range input', () => {
    render(<Range data-testid="range-input" />);
    const rangeInput = screen.getByTestId('range-input');
    expect(rangeInput).toBeInTheDocument();
    expect(rangeInput).toHaveAttribute('type', 'range');
  });

  it('should apply custom className', () => {
    render(<Range data-testid="range-input" className="custom-class" />);
    const rangeInput = screen.getByTestId('range-input');
    expect(rangeInput).toHaveClass('custom-class');
  });

  it('should apply error styles when error prop is true', () => {
    render(<Range data-testid="range-input" error />);
    const rangeInput = screen.getByTestId('range-input');
    expect(rangeInput.className).toContain('accent-destructive');
  });

  it('should accept min, max, and value props', () => {
    render(<Range data-testid="range-input" min={0} max={100} value={50} onChange={() => {}} />);
    const rangeInput = screen.getByTestId('range-input') as HTMLInputElement;
    expect(rangeInput).toHaveAttribute('min', '0');
    expect(rangeInput).toHaveAttribute('max', '100');
    expect(rangeInput).toHaveAttribute('value', '50');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Range ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should accept additional input props', () => {
    render(<Range data-testid="range-input" disabled step={10} />);
    const rangeInput = screen.getByTestId('range-input');
    expect(rangeInput).toBeDisabled();
    expect(rangeInput).toHaveAttribute('step', '10');
  });
});

