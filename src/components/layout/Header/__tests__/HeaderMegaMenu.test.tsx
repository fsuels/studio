import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeaderMegaMenu from '../HeaderMegaMenu'

// Mock the MegaMenuContent component
jest.mock('@/components/layout/mega-menu/MegaMenuContent', () => {
  return function MockMegaMenuContent({ locale }: { locale: string }) {
    return <div data-testid="mega-menu-content">Mega Menu Content for {locale}</div>
  }
})

describe('HeaderMegaMenu', () => {
  const defaultProps = {
    clientLocale: 'en' as const,
    mounted: true,
    isMegaMenuOpen: false,
    onOpenChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the trigger button when mounted', () => {
    render(<HeaderMegaMenu {...defaultProps} />)
    
    const triggerButton = screen.getByRole('button')
    expect(triggerButton).toBeInTheDocument()
    expect(triggerButton).toHaveTextContent(/Create Document/i)
  })

  it('does not render when not mounted', () => {
    render(<HeaderMegaMenu {...defaultProps} mounted={false} />)
    
    const triggerButton = screen.queryByRole('button')
    expect(triggerButton).not.toBeInTheDocument()
  })

  it('shows chevron down when menu is closed', () => {
    render(<HeaderMegaMenu {...defaultProps} />)
    
    const chevronDown = screen.getByTestId('chevron-down')
    expect(chevronDown).toBeInTheDocument()
  })

  it('shows chevron up when menu is open', () => {
    render(<HeaderMegaMenu {...defaultProps} isMegaMenuOpen={true} />)
    
    const chevronUp = screen.getByTestId('chevron-up')
    expect(chevronUp).toBeInTheDocument()
  })

  it('calls onOpenChange when trigger button is clicked', async () => {
    const mockOnOpenChange = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMegaMenu {...defaultProps} onOpenChange={mockOnOpenChange} />)
    
    const triggerButton = screen.getByRole('button')
    await user.click(triggerButton)
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })

  it('shows mega menu content when open', () => {
    render(<HeaderMegaMenu {...defaultProps} isMegaMenuOpen={true} />)
    
    const megaMenuContent = screen.getByTestId('mega-menu-content')
    expect(megaMenuContent).toBeInTheDocument()
    expect(megaMenuContent).toHaveTextContent('Mega Menu Content for en')
  })

  it('does not show mega menu content when closed', () => {
    render(<HeaderMegaMenu {...defaultProps} isMegaMenuOpen={false} />)
    
    const megaMenuContent = screen.queryByTestId('mega-menu-content')
    expect(megaMenuContent).not.toBeInTheDocument()
  })

  it('has correct aria-expanded attribute', () => {
    const { rerender } = render(<HeaderMegaMenu {...defaultProps} isMegaMenuOpen={false} />)
    
    let triggerButton = screen.getByRole('button')
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false')
    
    rerender(<HeaderMegaMenu {...defaultProps} isMegaMenuOpen={true} />)
    
    triggerButton = screen.getByRole('button')
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('handles different locales', () => {
    render(<HeaderMegaMenu {...defaultProps} clientLocale="es" />)
    
    const triggerButton = screen.getByRole('button')
    expect(triggerButton).toBeInTheDocument()
    
    // When opened, should pass correct locale to MegaMenuContent
    render(<HeaderMegaMenu {...defaultProps} clientLocale="es" isMegaMenuOpen={true} />)
    
    const megaMenuContent = screen.getByTestId('mega-menu-content')
    expect(megaMenuContent).toHaveTextContent('Mega Menu Content for es')
  })

  it('applies gradient styling to the button', () => {
    render(<HeaderMegaMenu {...defaultProps} />)
    
    const triggerButton = screen.getByRole('button')
    expect(triggerButton).toHaveClass('bg-gradient-to-r')
  })

  it('handles keyboard navigation', async () => {
    const mockOnOpenChange = jest.fn()
    const user = userEvent.setup()
    
    render(<HeaderMegaMenu {...defaultProps} onOpenChange={mockOnOpenChange} />)
    
    const triggerButton = screen.getByRole('button')
    triggerButton.focus()
    
    await user.keyboard('{Enter}')
    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
    
    await user.keyboard('{Space}')
    expect(mockOnOpenChange).toHaveBeenCalledTimes(2)
  })

  it('closes menu when clicking outside', async () => {
    const mockOnOpenChange = jest.fn()
    const user = userEvent.setup()
    
    render(
      <div>
        <HeaderMegaMenu {...defaultProps} isMegaMenuOpen={true} onOpenChange={mockOnOpenChange} />
        <button>Outside element</button>
      </div>
    )
    
    const outsideElement = screen.getByText('Outside element')
    await user.click(outsideElement)
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})