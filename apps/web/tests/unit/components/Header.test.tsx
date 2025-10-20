import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/presentation/components/organisms/Header';

// Mock ThemeToggle
jest.mock('@/presentation/components/molecules/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock LanguageSwitcher
jest.mock('@/presentation/components/molecules/LanguageSwitcher', () => ({
  LanguageSwitcher: ({ currentLang }: { currentLang: string }) => (
    <div data-testid="language-switcher">Language: {currentLang}</div>
  ),
}));

describe('Header', () => {
  it('should render the header with brand name', () => {
    render(<Header currentLang="en" />);
    expect(screen.getByText('MILLION')).toBeInTheDocument();
  });

  it('should render ThemeToggle component', () => {
    render(<Header currentLang="en" />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should render LanguageSwitcher with current language', () => {
    render(<Header currentLang="en" />);
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('Language: en')).toBeInTheDocument();
  });

  it('should render with Spanish language', () => {
    render(<Header currentLang="es" />);
    expect(screen.getByText('Language: es')).toBeInTheDocument();
  });

  it('should have sticky header styling', () => {
    const { container } = render(<Header currentLang="en" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
  });
});

