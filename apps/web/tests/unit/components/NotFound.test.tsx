import { render, screen } from '@testing-library/react';
import { NotFound } from '../../../src/presentation/components/organisms/NotFound';

describe('NotFound', () => {
  it('should render default 404 message', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Property Not Found')).toBeInTheDocument();
    expect(screen.getByText(/couldn't find the property/i)).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <NotFound 
        title="Custom Title" 
        message="Custom message text"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('should render Back to Home button', () => {
    render(<NotFound />);

    const homeButton = screen.getByRole('link', { name: /Back to Home/i });
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveAttribute('href', '/');
  });

  it('should render Search Properties button by default', () => {
    render(<NotFound />);

    const searchButton = screen.getByRole('link', { name: /Search Properties/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('should not render Search button when showSearchButton is false', () => {
    render(<NotFound showSearchButton={false} />);

    const searchButton = screen.queryByRole('link', { name: /Search Properties/i });
    expect(searchButton).not.toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<NotFound />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have proper accessibility attributes', () => {
    render(<NotFound />);

    expect(screen.getByRole('link', { name: /Back to Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Search Properties/i })).toBeInTheDocument();
  });
});

