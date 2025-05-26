// src/hooks/useAuth.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';

// 1) Define the shape of your auth context
interface User {
  uid: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  // password should not be stored in the user object in context for security.
  // It's used during login/signup flow but not persisted here.
  twoStep?: boolean;
  textUpdates?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, uid?: string) => void; // email is now required for login
  logout: () => void;
  updateUser: (updates: Partial<User> & { password?: string }) => void;
}

// 2) Create the context (default undefined to catch mis-use)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3) A hook that manages your mock auth state and persistence
function useAuthHook(): AuthContextType {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, read from localStorage
  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockAuth');
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          // Check if parsedData is an object and has the expected properties
          if (
            parsedData &&
            typeof parsedData === 'object' &&
            'isLoggedIn' in parsedData &&
            'user' in parsedData
          ) {
            setIsLoggedIn(parsedData.isLoggedIn);
            setUser(parsedData.user);
          } else {
            // Data is malformed, clear it
            localStorage.removeItem('mockAuth');
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch {
          localStorage.removeItem('mockAuth');
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // login & logout update state + localStorage
  const login = useCallback(
    (email: string, uid?: string) => {
      // In a real app, uid would come from backend after successful auth
      const newUid = uid || `mock-user-${Date.now()}`;
      const newUser: User = {
        uid: newUid,
        email: email,
        // Initialize other fields as empty or default
        name: user?.name || '', // Preserve existing name if user object was already partially there
        phone: user?.phone || '',
        address: user?.address || '',
        twoStep: user?.twoStep || false,
        textUpdates: user?.textUpdates || false,
      };
      localStorage.setItem(
        'mockAuth',
        JSON.stringify({ isLoggedIn: true, user: newUser }),
      );
      setIsLoggedIn(true);
      setUser(newUser);
    },
    [user],
  ); // Added user to dependency array to correctly capture existing fields if any

  const logout = useCallback(() => {
    localStorage.removeItem('mockAuth');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (updates: Partial<User> & { password?: string }) => {
      setUser((prevUser) => {
        if (!prevUser) return null; // Should not happen if logged in
        const updatedUser = { ...prevUser, ...updates };
        localStorage.setItem(
          'mockAuth',
          JSON.stringify({ isLoggedIn: true, user: updatedUser }),
        );
        return updatedUser;
      });
    },
    [],
  );

  // Memoize contextValue to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [isLoggedIn, user, isLoading, login, logout, updateUser],
  );

  return contextValue;
}

// 4) The provider component — also a client component
export function AuthProvider({ children }: { children: ReactNode }) {
  const authHookValue = useAuthHook();

  // Prevent any UI flashes while loading from localStorage
  // This check ensures that children are rendered only after initial auth state is determined.
  if (authHookValue.isLoading && typeof window !== 'undefined') {
    // Optionally render a global loading spinner here if desired for initial app load
    return null;
  }

  // Standard multi-line JSX for the provider, ensuring no hidden characters or subtle syntax errors.
  // It often points to a deeper build/dependency issue if the syntax here is confirmed to be standard.
  return (
    <AuthContext.Provider value={authHookValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 5) Hook for consuming the context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    // Check for undefined, not !ctx
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
