import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotFound } from '@/presentation/components/organisms/NotFound';

// Mock useDictionary and useLocale
jest.mock('@/i18n/client', () => ({
  useDictionary: () => ({
    notFound: {
      code: '404',
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist',
      backToProperties: 'Back to Properties',
    },
  }),
  useLocale: () => 'en',
}));

describe('NotFound', () => {
  it('should render default title and message from dictionary', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for does not exist')).toBeInTheDocument();
  });

  it('should render custom title when provided', () => {
    render(<NotFound title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render custom message when provided', () => {
    render(<NotFound message="Custom error message" />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render back to properties button', () => {
    render(<NotFound />);
    expect(screen.getByText('Back to Properties')).toBeInTheDocument();
  });

  it('should have link to properties page with correct locale', () => {
    const { container } = render(<NotFound />);
    const link = container.querySelector('a[href="/en/properties"]');
    expect(link).toBeInTheDocument();
  });

  it('should render both custom title and message', () => {
    render(<NotFound title="Oops!" message="Something went wrong" />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

