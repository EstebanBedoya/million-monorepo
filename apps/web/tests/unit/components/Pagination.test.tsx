import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../../../src/presentation/components/molecules/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination 
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render page numbers correctly', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(
      <Pagination 
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByRole('button', { name: 'Page 3', current: 'page' });
    expect(currentPageButton).toBeInTheDocument();
  });

  it('should disable previous button when hasPrev is false', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByRole('button', { name: 'Previous page' });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button when hasNext is false', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByRole('button', { name: 'Next page' });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when page number is clicked', async () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const page3Button = screen.getByRole('button', { name: 'Page 3' });
    await userEvent.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when previous button is clicked', async () => {
    render(
      <Pagination 
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const prevButton = screen.getByRole('button', { name: 'Previous page' });
    await userEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when next button is clicked', async () => {
    render(
      <Pagination 
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByRole('button', { name: 'Next page' });
    await userEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should show ellipsis for large page counts', () => {
    render(
      <Pagination 
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should have proper navigation attributes', () => {
    render(
      <Pagination 
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(
      <Pagination 
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

