import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../src/presentation/components/atoms/Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
  });

  it('should apply primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveClass('bg-accent');
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('border-border');
  });

  it('should apply outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('border-border');
  });

  it('should apply ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toHaveClass('text-foreground');
  });

  it('should apply different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});

