// src/hooks/useAuth.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';

// 1) Define the shape of your auth context
interface AuthContextType {
  isLoggedIn: boolean;
  user: { uid: string; email?: string | null } | null;
  isLoading: boolean;
  login: (email?: string, uid?: string) => void;
  logout: () => void;
}

// 2) Create the context (default undefined to catch mis-use)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3) A hook that manages your mock auth state and persistence
function useAuthHook() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, read from localStorage
  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockAuth');
      if (stored) {
        try {
          const { isLoggedIn, user } = JSON.parse(stored);
          setIsLoggedIn(isLoggedIn);
          setUser(user);
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
  const login = useCallback((email = 'test@example.com', uid = 'mock-user-123') => {
    const newUser = { uid, email };
    localStorage.setItem('mockAuth', JSON.stringify({ isLoggedIn: true, user: newUser }));
    setIsLoggedIn(true);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mockAuth');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  return { isLoggedIn, user, isLoading, login, logout };
}

// 4) The provider component — also a client component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  // Prevent any UI flashes while loading
  if (auth.isLoading) return null;

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// 5) Hook for consuming the context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
