import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../index';

// Mock all the subcomponents
jest.mock('../HeaderSearch', () => {
  return function MockHeaderSearch({ clientLocale, mounted, className }: any) {
    return (
      <div data-testid="header-search">
        Search Component {mounted ? 'mounted' : 'not mounted'}
      </div>
    );
  };
});

jest.mock('../HeaderUserMenu', () => {
  return function MockHeaderUserMenu({ clientLocale, mounted }: any) {
    return (
      <div data-testid="header-user-menu">
        User Menu {mounted ? 'mounted' : 'not mounted'}
      </div>
    );
  };
});

jest.mock('../HeaderMegaMenu', () => {
  return function MockHeaderMegaMenu({
    clientLocale,
    mounted,
    isMegaMenuOpen,
    onOpenChange,
  }: any) {
    return (
      <div data-testid="header-mega-menu">
        Mega Menu {isMegaMenuOpen ? 'open' : 'closed'}
        <button onClick={() => onOpenChange(!isMegaMenuOpen)}>
          Toggle Mega Menu
        </button>
      </div>
    );
  };
});

jest.mock('../HeaderMobileMenu', () => {
  return function MockHeaderMobileMenu({
    clientLocale,
    mounted,
    isMobileMenuOpen,
    onToggle,
    onClose,
  }: any) {
    return (
      <div data-testid="header-mobile-menu">
        Mobile Menu {isMobileMenuOpen ? 'open' : 'closed'}
        <button onClick={onToggle}>Toggle Mobile Menu</button>
        <button onClick={onClose}>Close Mobile Menu</button>
      </div>
    );
  };
});

// Mock other components
jest.mock('@/components/layout/Logo', () => {
  return function MockLogo() {
    return <div data-testid="logo">Logo</div>;
  };
});

jest.mock('@/components/shared/navigation/Nav', () => {
  return function MockNav({ locale }: { locale?: string }) {
    return <div data-testid="nav">Nav for {locale || 'en'}</div>;
  };
});

jest.mock('@/components/shared/navigation/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher</div>;
  };
});

jest.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggleButton: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

// Mock window scroll
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

describe('Header', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0 });
    jest.clearAllMocks();
  });

  it('renders all header components when mounted', () => {
    render(<Header />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('header-search')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('header-user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('header-mega-menu')).toBeInTheDocument();
    expect(screen.getByTestId('header-mobile-menu')).toBeInTheDocument();
  });

  it('shows mounted state after component mounts', () => {
    render(<Header />);

    // Components should show as mounted
    expect(screen.getByText('Search Component mounted')).toBeInTheDocument();
    expect(screen.getByText('User Menu mounted')).toBeInTheDocument();
  });

  it('manages mega menu open/close state', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Initially closed
    expect(screen.getByText('Mega Menu closed')).toBeInTheDocument();

    // Toggle mega menu
    const megaMenuToggle = screen.getByText('Toggle Mega Menu');
    await user.click(megaMenuToggle);

    expect(screen.getByText('Mega Menu open')).toBeInTheDocument();
  });

  it('manages mobile menu open/close state', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Initially closed
    expect(screen.getByText('Mobile Menu closed')).toBeInTheDocument();

    // Toggle mobile menu
    const mobileMenuToggle = screen.getByText('Toggle Mobile Menu');
    await user.click(mobileMenuToggle);

    expect(screen.getByText('Mobile Menu open')).toBeInTheDocument();
  });

  it('closes mobile menu when onClose is called', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Open mobile menu first
    const mobileMenuToggle = screen.getByText('Toggle Mobile Menu');
    await user.click(mobileMenuToggle);
    expect(screen.getByText('Mobile Menu open')).toBeInTheDocument();

    // Close mobile menu
    const mobileMenuClose = screen.getByText('Close Mobile Menu');
    await user.click(mobileMenuClose);

    expect(screen.getByText('Mobile Menu closed')).toBeInTheDocument();
  });

  it('adds scrolled class when scrolled', () => {
    const { container } = render(<Header />);

    // Initially not scrolled
    const header = container.querySelector('header');
    expect(header).not.toHaveClass('scrolled');

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100 });
    fireEvent.scroll(window);

    // Should add scrolled class
    expect(header).toHaveClass('scrolled');
  });

  it('is sticky positioned', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  it('has correct z-index for layering', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('z-50');
  });

  it('passes correct locale to Nav component', () => {
    render(<Header />);

    expect(screen.getByText('Nav for en')).toBeInTheDocument();
  });

  it('handles responsive design classes', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'border-b', 'transition-all');

    // Should have responsive flex classes
    const headerContent = header?.querySelector('.container');
    expect(headerContent).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
    );
  });

  it('maintains proper tab order for accessibility', () => {
    render(<Header />);

    // Logo should be focusable
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();

    // Navigation should be accessible
    const nav = screen.getByTestId('nav');
    expect(nav).toBeInTheDocument();
  });

  it('handles scroll event cleanup', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<Header />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('closes mega menu when mobile menu opens', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Open mega menu first
    const megaMenuToggle = screen.getByText('Toggle Mega Menu');
    await user.click(megaMenuToggle);
    expect(screen.getByText('Mega Menu open')).toBeInTheDocument();

    // Open mobile menu
    const mobileMenuToggle = screen.getByText('Toggle Mobile Menu');
    await user.click(mobileMenuToggle);

    // Mega menu should close when mobile menu opens
    expect(screen.getByText('Mega Menu closed')).toBeInTheDocument();
    expect(screen.getByText('Mobile Menu open')).toBeInTheDocument();
  });
});
