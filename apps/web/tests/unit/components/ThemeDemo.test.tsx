import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeDemo } from '../../../src/presentation/components/ThemeDemo';
import { useTheme } from '../../../src/presentation/hooks/useTheme';

// Mock the useTheme hook
jest.mock('../../../src/presentation/hooks/useTheme');

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeDemo', () => {
  const mockThemeData = {
    theme: 'light' as const,
    themeInfo: {
      name: 'light',
      displayName: '☀️ Light',
      classes: ['theme-light'],
      isDefault: true,
    },
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
    isDark: false,
    isLight: true,
    isMcDonalds: false,
    getAllThemes: jest.fn().mockReturnValue([
      {
        name: 'light',
        displayName: '☀️ Light',
        classes: ['theme-light'],
        isDefault: true,
      },
      {
        name: 'dark',
        displayName: '🌙 Dark',
        classes: ['dark', 'theme-dark'],
        isDefault: false,
      },
      {
        name: 'mcdonalds',
        displayName: '🍟 McDonald\'s',
        classes: ['mcdonalds', 'theme-mcdonalds'],
        isDefault: false,
      },
      {
        name: 'cyberpunk',
        displayName: '🤖 Cyberpunk',
        classes: ['cyberpunk', 'theme-cyberpunk'],
        isDefault: false,
      },
    ]),
    getNextTheme: jest.fn().mockReturnValue('dark'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue(mockThemeData);
  });

  it('should render theme demo with correct title', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Theme Demo')).toBeInTheDocument();
  });

  it('should render all theme buttons', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('☀️ Light')).toBeInTheDocument();
    expect(screen.getByText('🌙 Dark')).toBeInTheDocument();
    expect(screen.getByText('🍟 McDonald\'s')).toBeInTheDocument();
    expect(screen.getByText('🤖 Cyberpunk')).toBeInTheDocument();
  });

  it('should render next theme button', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('🔄 Next')).toBeInTheDocument();
  });

  it('should call setTheme when theme button is clicked', () => {
    render(<ThemeDemo />);

    const darkButton = screen.getByText('🌙 Dark');
    fireEvent.click(darkButton);

    expect(mockThemeData.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should call toggleTheme when next button is clicked', () => {
    render(<ThemeDemo />);

    const nextButton = screen.getByText('🔄 Next');
    fireEvent.click(nextButton);

    expect(mockThemeData.toggleTheme).toHaveBeenCalled();
  });

  it('should render card examples', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Card Example')).toBeInTheDocument();
    expect(screen.getByText('Color Palette')).toBeInTheDocument();
    expect(screen.getByText('Current Theme')).toBeInTheDocument();
  });

  it('should render current theme information', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Theme: ☀️ Light')).toBeInTheDocument();
    expect(screen.getByText('Next Theme: 🌙 Dark')).toBeInTheDocument();
    expect(screen.getByText('Classes: theme-light')).toBeInTheDocument();
    expect(screen.getByText('Is Default: Yes')).toBeInTheDocument();
  });

  it('should render color palette', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Accent')).toBeInTheDocument();
    expect(screen.getByText('Border')).toBeInTheDocument();
  });

  it('should render form example', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Form Example')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should show McDonald\'s special section when McDonald\'s theme is active', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeData,
      theme: 'mcdonalds',
      isMcDonalds: true,
    });

    render(<ThemeDemo />);

    expect(screen.getByText('🍟 Welcome to McDonald\'s Theme! 🍔')).toBeInTheDocument();
    expect(screen.getByText('"I\'m lovin\' it!" - This theme is pure gold! 🏆')).toBeInTheDocument();
    expect(screen.getByText('🍟 Order Now!')).toBeInTheDocument();
  });

  it('should show Cyberpunk special section when Cyberpunk theme is active', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeData,
      theme: 'cyberpunk',
      isMcDonalds: false,
    });

    render(<ThemeDemo />);

    expect(screen.getByText('🤖 Welcome to the Cyberpunk Theme! ⚡')).toBeInTheDocument();
    expect(screen.getByText('"Wake up, samurai. We have a website to build." 🗡️')).toBeInTheDocument();
    expect(screen.getByText('🤖 Hack the System!')).toBeInTheDocument();
  });

  it('should not show special sections for light theme', () => {
    render(<ThemeDemo />);

    expect(screen.queryByText('🍟 Welcome to McDonald\'s Theme! 🍔')).not.toBeInTheDocument();
    expect(screen.queryByText('🤖 Welcome to the Cyberpunk Theme! ⚡')).not.toBeInTheDocument();
  });

  it('should not show special sections for dark theme', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeData,
      theme: 'dark',
      isMcDonalds: false,
    });

    render(<ThemeDemo />);

    expect(screen.queryByText('🍟 Welcome to McDonald\'s Theme! 🍔')).not.toBeInTheDocument();
    expect(screen.queryByText('🤖 Welcome to the Cyberpunk Theme! ⚡')).not.toBeInTheDocument();
  });

  it('should render action button in card example', () => {
    render(<ThemeDemo />);

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('should render form with correct input fields', () => {
    render(<ThemeDemo />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should have correct CSS classes for main container', () => {
    const { container } = render(<ThemeDemo />);
    
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('bg-background', 'text-foreground', 'transition-colors', 'duration-300');
  });

  it('should have correct CSS classes for header', () => {
    const { container } = render(<ThemeDemo />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('border-b', 'border-border', 'bg-card', 'shadow-soft');
  });

  it('should have correct CSS classes for cards', () => {
    const { container } = render(<ThemeDemo />);
    
    const cards = container.querySelectorAll('.bg-card');
    cards.forEach(card => {
      expect(card).toHaveClass('border', 'border-border', 'rounded-lg', 'p-6', 'shadow-soft');
    });
  });

  it('should render emojis in McDonald\'s section', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeData,
      theme: 'mcdonalds',
      isMcDonalds: true,
    });

    render(<ThemeDemo />);

    expect(screen.getByText('🍟')).toBeInTheDocument();
    expect(screen.getByText('🍔')).toBeInTheDocument();
    expect(screen.getByText('🥤')).toBeInTheDocument();
    expect(screen.getByText('🍦')).toBeInTheDocument();
  });

  it('should render emojis in Cyberpunk section', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeData,
      theme: 'cyberpunk',
      isMcDonalds: false,
    });

    render(<ThemeDemo />);

    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('🔮')).toBeInTheDocument();
    expect(screen.getByText('🌃')).toBeInTheDocument();
  });
});
