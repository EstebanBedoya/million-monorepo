import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialog } from '@/presentation/components/atoms/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  it('should render when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when backdrop is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const backdrop = screen.getByText('Confirm Action').closest('.fixed.inset-0')?.previousSibling as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    }
  });

  it('should display custom labels', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Yes, Delete"
        cancelLabel="No, Keep it"
      />
    );
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Keep it')).toBeInTheDocument();
  });

  it('should render danger variant by default', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton.className).toContain('bg-red-600');
  });

  it('should render warning variant', () => {
    render(<ConfirmDialog {...defaultProps} variant="warning" />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton.className).toContain('bg-yellow-600');
  });

  it('should render info variant', () => {
    render(<ConfirmDialog {...defaultProps} variant="info" />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton.className).toContain('bg-blue-600');
  });

  it('should disable buttons when isLoading is true', () => {
    render(<ConfirmDialog {...defaultProps} isLoading />);
    const confirmButton = screen.getByText('Loading...');
    const cancelButton = screen.getByText('Cancel');
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<ConfirmDialog {...defaultProps} isLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should set body overflow to hidden when opened', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
    
    rerender(<ConfirmDialog {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when closed', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should cleanup body overflow on unmount', () => {
    const { unmount } = render(<ConfirmDialog {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });
});

