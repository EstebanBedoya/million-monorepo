import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '@/presentation/components/molecules/ThemeToggle';
import * as useThemeHook from '@/presentation/hooks/useTheme';

// Mock the useTheme hook
jest.mock('@/presentation/hooks/useTheme');

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a disabled button when not mounted', () => {
    (useThemeHook.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: false,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render Moon icon when theme is light', () => {
    (useThemeHook.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render Sun icon when theme is dark', () => {
    (useThemeHook.useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should call toggleTheme when button is clicked', () => {
    (useThemeHook.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    (useThemeHook.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle className="custom-class" />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveClass('custom-class');
  });
});

