import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FiltersBar, FilterValues } from '../../../src/presentation/components/organisms/FiltersBar';

describe('FiltersBar', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render all filter inputs', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    expect(screen.getByLabelText(/Search by name or address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by property type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
  });

  it('should debounce search input', async () => {
    jest.useFakeTimers();
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={true} />);

    const searchInput = screen.getByLabelText(/Search by name or address/i);

    // Type in search
    fireEvent.change(searchInput, { target: { value: 'Villa' } });

    // Should not call immediately
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Fast-forward time by 400ms (debounce delay)
    jest.advanceTimersByTime(400);

    // Now it should have been called
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Villa',
        })
      );
    });

    jest.useRealTimers();
  });

  it('should update filters when property type changes', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={true} />);

    const propertyTypeSelect = screen.getByLabelText(/Filter by property type/i);

    fireEvent.change(propertyTypeSelect, { target: { value: 'house' } });

    // Wait for the effect to trigger onFilterChange
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: 'house',
        })
      );
    });
  });

  it('should update min and max price inputs', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={true} />);

    const minPriceInput = screen.getByLabelText(/Min Price/i);
    const maxPriceInput = screen.getByLabelText(/Max Price/i);

    fireEvent.change(minPriceInput, { target: { value: '100000' } });
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          minPrice: 100000,
        })
      );
    });

    fireEvent.change(maxPriceInput, { target: { value: '1000000' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          maxPrice: 1000000,
        })
      );
    });
  });

  it('should clear all filters when clear button is clicked', async () => {
    const defaultFilters: Partial<FilterValues> = {
      search: 'Test',
      minPrice: 100000,
      maxPrice: 1000000,
      propertyType: 'house',
    };

    render(<FiltersBar onFilterChange={mockOnFilterChange} defaultFilters={defaultFilters} skipInitialCall={true} />);

    // Wait for initial render and filters to be applied
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear All Filters/i })).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /Clear All Filters/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        search: '',
        minPrice: 0,
        maxPrice: 1000000000,
        propertyType: '',
      });
    });
  });

  it('should show clear filters button only when filters are active', async () => {
    // Test without filters
    const { unmount } = render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={true} />);
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();
    unmount();

    // Test with active filters
    render(
      <FiltersBar
        onFilterChange={mockOnFilterChange}
        defaultFilters={{ search: 'Test' }}
        skipInitialCall={true}
      />
    );

    // Button should be visible with active filters
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();
    });
  });

  it('should display formatted price range', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000,000')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    const searchInput = screen.getByLabelText(/Search by name or address/i);
    expect(searchInput).toHaveAttribute('aria-label');

    const minPriceInput = screen.getByLabelText(/Min Price/i);
    expect(minPriceInput).toHaveAttribute('id', 'min-price');

    const maxPriceInput = screen.getByLabelText(/Max Price/i);
    expect(maxPriceInput).toHaveAttribute('id', 'max-price');
  });
});

