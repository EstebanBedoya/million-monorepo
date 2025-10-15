import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersBar, FilterValues } from '../../../src/presentation/components/FiltersBar';

describe('FiltersBar', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render all filter inputs', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText(/Search properties by name or address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by property type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minimum price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Maximum price/i)).toBeInTheDocument();
  });

  it('should debounce search input', async () => {
    jest.useFakeTimers();
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByLabelText(/Search properties by name or address/i);
    
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
    });
    
    jest.useRealTimers();
  });

  it('should update filters when property type changes', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    const propertyTypeSelect = screen.getByLabelText(/Filter by property type/i);
    
    await userEvent.selectOptions(propertyTypeSelect, 'Villa');

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: 'Villa',
        })
      );
    });
  });

  it('should update min and max price sliders', async () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    const minPriceSlider = screen.getByLabelText(/Minimum price/i);
    const maxPriceSlider = screen.getByLabelText(/Maximum price/i);

    fireEvent.change(minPriceSlider, { target: { value: '100000' } });
    fireEvent.change(maxPriceSlider, { target: { value: '1000000' } });

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
      propertyType: 'Villa',
    };

    render(<FiltersBar onFilterChange={mockOnFilterChange} defaultFilters={defaultFilters} />);

    // Wait for initial render and filters to be applied
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /Clear all filters/i });
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        search: '',
        minPrice: 0,
        maxPrice: 5000000,
        propertyType: '',
      });
    });
  });

  it('should show clear filters button only when filters are active', async () => {
    const { rerender } = render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    // No filters active, button should not be visible
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();

    // Add filters
    rerender(
      <FiltersBar 
        onFilterChange={mockOnFilterChange} 
        defaultFilters={{ search: 'Test', minPrice: 0, maxPrice: 5000000 }} 
      />
    );

    // Button should now be visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();
    });
  });

  it('should display formatted price range', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText(/\$0.*\$5,000,000/)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<FiltersBar onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByLabelText(/Search properties by name or address/i);
    expect(searchInput).toHaveAttribute('aria-label');

    const minPriceSlider = screen.getByLabelText(/Minimum price/i);
    expect(minPriceSlider).toHaveAttribute('aria-valuemin');
    expect(minPriceSlider).toHaveAttribute('aria-valuemax');
    expect(minPriceSlider).toHaveAttribute('aria-valuenow');
  });
});

