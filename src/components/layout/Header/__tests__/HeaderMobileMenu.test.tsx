import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeaderMobileMenu from '../HeaderMobileMenu';

jest.mock('@/components/ui/ProgressiveLoader', () => ({
  ProgressiveLoader: ({ component, props }: any) => {
    const mod = component();
    if (mod && typeof mod.then === 'function') {
      const resolved = require('@/components/mobile/MobileDocsAccordion');
      const Comp = resolved.default || resolved;
      return <Comp {...(props || {})} />;
    }
    const Comp = (mod as any).default || mod;
    return <Comp {...(props || {})} />;
  },
}));

jest.mock('@/components/mobile/MobileDocsAccordion', () => {
  return function MockMobileDocsAccordion({
    locale,
    onLinkClick,
  }: {
    locale: string;
    onLinkClick?: () => void;
  }) {
    return (
      <div data-testid="mobile-docs-accordion">
        Mobile Docs Accordion for {locale}
        <button onClick={onLinkClick}>Close from accordion</button>
      </div>
    );
  };
});

const baseProps = {
  clientLocale: 'en' as const,
  mounted: true,
  isMobileMenuOpen: false,
  onToggle: jest.fn(),
  onClose: jest.fn(),
};

describe('HeaderMobileMenu', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders hamburger button when mounted and menu is closed', () => {
    render(<HeaderMobileMenu {...baseProps} />);
    const openButton = screen.getByRole('button', { name: /open menu/i });
    expect(openButton).toBeInTheDocument();
  });

  it('renders close button when menu is open', () => {
    render(<HeaderMobileMenu {...baseProps} isMobileMenuOpen />);
    const [toggleButton] = screen.getAllByRole('button', { name: /close menu/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('disables toggle when not mounted', () => {
    render(<HeaderMobileMenu {...baseProps} mounted={false} />);
    const button = screen.getByRole('button', { name: /open menu/i });
    expect(button).toBeDisabled();
  });

  it('calls onToggle when hamburger button is clicked', async () => {
    const mockOnToggle = jest.fn();
    const user = userEvent.setup();
    render(<HeaderMobileMenu {...baseProps} onToggle={mockOnToggle} />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when close button is clicked', async () => {
    const mockOnToggle = jest.fn();
    const user = userEvent.setup();
    render(<HeaderMobileMenu {...baseProps} isMobileMenuOpen onToggle={mockOnToggle} />);
    const [toggleButton] = screen.getAllByRole('button', { name: /close menu/i });
    await user.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('shows mobile menu overlay when open', async () => {
    render(<HeaderMobileMenu {...baseProps} isMobileMenuOpen />);
    const accordion = await screen.findByTestId('mobile-docs-accordion');
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveTextContent('Mobile Docs Accordion for en');
  });

  it('invokes onClose callback when accordion button clicked', async () => {
    const mockOnClose = jest.fn();
    const user = userEvent.setup();
    render(<HeaderMobileMenu {...baseProps} isMobileMenuOpen onClose={mockOnClose} />);
    await user.click(await screen.findByText('Close from accordion'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders accordion for different locale', async () => {
    render(<HeaderMobileMenu {...baseProps} clientLocale="es" isMobileMenuOpen />);
    const accordion = await screen.findByTestId('mobile-docs-accordion');
    expect(accordion).toHaveTextContent('Mobile Docs Accordion for es');
  });

  it('updates aria-label when state changes', () => {
    const { rerender } = render(<HeaderMobileMenu {...baseProps} />);
    const openButton = screen.getByRole('button', { name: /open menu/i });
    expect(openButton).toBeInTheDocument();
    rerender(<HeaderMobileMenu {...baseProps} isMobileMenuOpen />);
    const [toggleButton] = screen.getAllByRole('button', { name: /close menu/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const mockOnToggle = jest.fn();
    const user = userEvent.setup();
    render(<HeaderMobileMenu {...baseProps} onToggle={mockOnToggle} />);
    const button = screen.getByRole('button', { name: /open menu/i });
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Space}');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('applies menu button styling and renders overlay when open', async () => {
    const { rerender } = render(<HeaderMobileMenu {...baseProps} />);
    expect(screen.getByRole('button')).toHaveClass('p-2');
    rerender(<HeaderMobileMenu {...baseProps} isMobileMenuOpen />);
    const overlay = await screen.findByRole('dialog', { hidden: true });
    expect(overlay.className).toContain('fixed');
  });
});
