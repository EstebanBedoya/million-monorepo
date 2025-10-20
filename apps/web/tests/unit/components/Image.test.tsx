import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Image } from '@/presentation/components/atoms/Image';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        {...props}
      />
    );
  },
}));

describe('Image', () => {
  it('should render NextImage when no error occurs', () => {
    render(<Image src="/test-image.jpg" alt="Test image" width={300} height={200} />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should apply custom className', () => {
    render(<Image src="/test-image.jpg" alt="Test image" width={300} height={200} className="custom-class" />);
    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('should display fallback UI when image fails to load', () => {
    render(<Image src="/broken-image.jpg" alt="Test image" width={300} height={200} />);
    const image = screen.getByAltText('Test image');
    
    // Trigger error event
    fireEvent.error(image);
    
    // Check for fallback content
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
    expect(screen.getByText('Property photo coming soon')).toBeInTheDocument();
  });

  it('should call onError callback when provided', () => {
    const onErrorMock = jest.fn();
    render(<Image src="/broken-image.jpg" alt="Test image" width={300} height={200} onError={onErrorMock} />);
    const image = screen.getByAltText('Test image');
    
    // Trigger error event
    fireEvent.error(image);
    
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it('should apply className to fallback container', () => {
    const { container } = render(<Image src="/broken-image.jpg" alt="Test image" width={300} height={200} className="custom-fallback" />);
    const image = screen.getByAltText('Test image');
    
    // Trigger error event
    fireEvent.error(image);
    
    const fallbackContainer = container.querySelector('.custom-fallback');
    expect(fallbackContainer).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(<Image src="/test-image.jpg" alt="Test image" width={300} height={200} />);
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });
});

