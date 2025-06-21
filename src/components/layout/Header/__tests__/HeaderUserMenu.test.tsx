import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeaderUserMenu from '../HeaderUserMenu';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('HeaderUserMenu', () => {
  beforeEach(() => {
    // Default mock - not authenticated
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton when not mounted', () => {
    render(<HeaderUserMenu clientLocale="en" mounted={false} />);

    // Should render skeleton/placeholder
    const skeleton = screen.getByTestId('header-user-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });

    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    // Should show loading indicator
    expect(screen.getByTestId('user-menu-loading')).toBeInTheDocument();
  });

  it('shows sign in/sign up buttons when not authenticated', () => {
    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', async () => {
    const mockSignIn = jest.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signOut: jest.fn(),
      signUp: jest.fn(),
    });

    const user = userEvent.setup();
    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    const signInButton = screen.getByText(/Sign In/i);
    await user.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('calls signUp when sign up button is clicked', async () => {
    const mockSignUp = jest.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: mockSignUp,
    });

    const user = userEvent.setup();
    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    const signUpButton = screen.getByText(/Sign Up/i);
    await user.click(signUpButton);

    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });

  it('shows user menu when authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });

    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    // Should show user avatar or name
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows user email when displayName is not available', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: null,
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });

    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('opens user popover menu when user avatar is clicked', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });

    const user = userEvent.setup();
    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    const userButton = screen.getByRole('button');
    await user.click(userButton);

    // Should show popover menu with logout option
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  it('calls signOut when logout is clicked', async () => {
    const mockSignOut = jest.fn();
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: mockSignOut,
      signUp: jest.fn(),
    });

    const user = userEvent.setup();
    render(<HeaderUserMenu clientLocale="en" mounted={true} />);

    // Open popover
    const userButton = screen.getByRole('button');
    await user.click(userButton);

    // Click logout
    const logoutButton = screen.getByText(/Sign Out/i);
    await user.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('handles different locales correctly', () => {
    render(<HeaderUserMenu clientLocale="es" mounted={true} />);

    // Should render with Spanish locale context
    // This would depend on your i18n implementation
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });
});
