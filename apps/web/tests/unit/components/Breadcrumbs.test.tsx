import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '@/presentation/components/molecules/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render breadcrumb items', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Detail' },
    ];

    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('should render links for items with href', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Detail' },
    ];

    render(<Breadcrumbs items={items} />);
    const homeLink = screen.getByText('Home').closest('a');
    const propertiesLink = screen.getByText('Properties').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(propertiesLink).toHaveAttribute('href', '/properties');
  });

  it('should render span for last item', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Detail' },
    ];

    render(<Breadcrumbs items={items} />);
    const detailSpan = screen.getByText('Detail');
    expect(detailSpan.tagName).toBe('SPAN');
    expect(detailSpan).toHaveAttribute('aria-current', 'page');
  });

  it('should render span for item without href', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'No Link' },
    ];

    render(<Breadcrumbs items={items} />);
    const noLinkSpan = screen.getByText('No Link');
    expect(noLinkSpan.tagName).toBe('SPAN');
  });

  it('should apply custom className', () => {
    const items = [{ label: 'Home' }];
    const { container } = render(<Breadcrumbs items={items} className="custom-class" />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-class');
  });

  it('should render single item without separator', () => {
    const items = [{ label: 'Home' }];
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Detail' },
    ];

    const { container } = render(<Breadcrumbs items={items} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});

