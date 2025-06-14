import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeaderMobileMenu from '../HeaderMobileMenu'

// Mock the MobileDocsAccordion component
jest.mock('@/components/layout/MobileDocsAccordion', () => {
  return function MockMobileDocsAccordion({ locale, onClose }: { locale: string; onClose: () => void }) {
    return (
      <div data-testid="mobile-docs-accordion">
        Mobile Docs Accordion for {locale}
        <button onClick={onClose}>Close from accordion</button>
      </div>
    )
  }
})

describe('HeaderMobileMenu', () => {
  const defaultProps = {
    clientLocale: 'en' as const,
    mounted: true,
    isMobileMenuOpen: false,
    onToggle: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders hamburger button when mounted and menu is closed', () => {
    render(<HeaderMobileMenu {...defaultProps} />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
    
    const hamburgerIcon = screen.getByTestId('hamburger-icon')
    expect(hamburgerIcon).toBeInTheDocument()
  })

  it('renders close button when menu is open', () => {
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu')
    
    const closeIcon = screen.getByTestId('close-icon')
    expect(closeIcon).toBeInTheDocument()
  })

  it('does not render when not mounted', () => {
    render(<HeaderMobileMenu {...defaultProps} mounted={false} />)
    
    const menuButton = screen.queryByRole('button')
    expect(menuButton).not.toBeInTheDocument()
  })

  it('calls onToggle when hamburger button is clicked', async () => {
    const mockOnToggle = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMobileMenu {...defaultProps} onToggle={mockOnToggle} />)
    
    const menuButton = screen.getByRole('button')
    await user.click(menuButton)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when close button is clicked', async () => {
    const mockOnToggle = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} onToggle={mockOnToggle} />)
    
    const menuButton = screen.getByRole('button')
    await user.click(menuButton)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('shows mobile menu overlay when open', () => {
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} />)
    
    const mobileDocsAccordion = screen.getByTestId('mobile-docs-accordion')
    expect(mobileDocsAccordion).toBeInTheDocument()
    expect(mobileDocsAccordion).toHaveTextContent('Mobile Docs Accordion for en')
  })

  it('does not show mobile menu overlay when closed', () => {
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={false} />)
    
    const mobileDocsAccordion = screen.queryByTestId('mobile-docs-accordion')
    expect(mobileDocsAccordion).not.toBeInTheDocument()
  })

  it('calls onClose when accordion triggers close', async () => {
    const mockOnClose = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} onClose={mockOnClose} />)
    
    const closeFromAccordion = screen.getByText('Close from accordion')
    await user.click(closeFromAccordion)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('handles different locales', () => {
    render(<HeaderMobileMenu {...defaultProps} clientLocale="es" isMobileMenuOpen={true} />)
    
    const mobileDocsAccordion = screen.getByTestId('mobile-docs-accordion')
    expect(mobileDocsAccordion).toHaveTextContent('Mobile Docs Accordion for es')
  })

  it('has proper accessibility attributes', () => {
    const { rerender } = render(<HeaderMobileMenu {...defaultProps} />)
    
    let menuButton = screen.getByRole('button')
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    
    rerender(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} />)
    
    menuButton = screen.getByRole('button')
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu')
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('handles keyboard navigation', async () => {
    const mockOnToggle = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMobileMenu {...defaultProps} onToggle={mockOnToggle} />)
    
    const menuButton = screen.getByRole('button')
    menuButton.focus()
    
    await user.keyboard('{Enter}')
    expect(mockOnToggle).toHaveBeenCalledWith()
    
    await user.keyboard('{Space}')
    expect(mockOnToggle).toHaveBeenCalledTimes(2)
  })

  it('applies correct styling classes', () => {
    const { rerender } = render(<HeaderMobileMenu {...defaultProps} />)
    
    let menuButton = screen.getByRole('button')
    expect(menuButton).toHaveClass('p-2')
    
    rerender(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} />)
    
    const overlay = screen.getByRole('dialog', { hidden: true }) // Mobile menu overlay
    expect(overlay).toHaveClass('fixed', 'inset-0')
  })

  it('prevents body scroll when menu is open', () => {
    render(<HeaderMobileMenu {...defaultProps} isMobileMenuOpen={true} />)
    
    // In a real implementation, you'd check that body has overflow: hidden
    // or that scroll prevention is applied
    expect(document.body).toHaveStyle('overflow: hidden')
  })
})