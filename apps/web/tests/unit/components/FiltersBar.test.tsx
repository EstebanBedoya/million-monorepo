import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    const searchInput = screen.getByLabelText(/Search by name or address/i);

    // Type in search
    await userEvent.type(searchInput, 'Villa');

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
    }, { timeout: 1000 });

    jest.useRealTimers();
  }, 10000);

  it('should update filters when property type changes', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    const propertyTypeSelect = screen.getByLabelText(/Filter by property type/i);

    await userEvent.selectOptions(propertyTypeSelect, 'house');

    // Wait for the effect to trigger onFilterChange
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: 'house',
        })
      );
    }, { timeout: 2000 });
  });

  it('should update min and max price inputs', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    const minPriceInput = screen.getByLabelText(/Min Price/i);
    const maxPriceInput = screen.getByLabelText(/Max Price/i);

    fireEvent.change(minPriceInput, { target: { value: '100000' } });
    fireEvent.change(maxPriceInput, { target: { value: '1000000' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          minPrice: 100000,
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

    render(<FiltersBar onFilterChange={mockOnFilterChange} defaultFilters={defaultFilters} skipInitialCall={false} />);

    // Wait for initial render and filters to be applied
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear All Filters/i })).toBeInTheDocument();
    }, { timeout: 1000 });

    const clearButton = screen.getByRole('button', { name: /Clear All Filters/i });
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        search: '',
        minPrice: 0,
        maxPrice: 1000000000,
        propertyType: '',
      });
    }, { timeout: 1000 });
  });

  it('should show clear filters button only when filters are active', async () => {
    const { rerender } = render(<FiltersBar onFilterChange={mockOnFilterChange} skipInitialCall={false} />);

    // No filters active, button should not be visible
    expect(screen.queryByRole('button', { name: /Clear All Filters/i })).not.toBeInTheDocument();

    // Add filters
    rerender(
      <FiltersBar
        onFilterChange={mockOnFilterChange}
        defaultFilters={{ search: 'Test', minPrice: 100000, maxPrice: 500000000 }}
        skipInitialCall={false}
      />
    );

    // Button should now be visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear All Filters/i })).toBeInTheDocument();
    }, { timeout: 1000 });
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

