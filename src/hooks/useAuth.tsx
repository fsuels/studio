// src/hooks/useAuth.ts
'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// Define the shape of the auth context
interface AuthContextType {
  isLoggedIn: boolean;
  user: { uid: string; email?: string | null } | null;
  isLoading: boolean;
  login: (email?: string, uid?: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default undefined value initially
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth state.
let mockGlobalIsLoggedIn = false;
let mockGlobalUser: { uid: string; email?: string | null } | null = null;

// Renamed the hook slightly to avoid confusion with the context hook below
export function useAuthHook() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('mockAuth') : null;
    if (storedAuth) {
        try {
            const authData = JSON.parse(storedAuth);
            mockGlobalIsLoggedIn = authData.isLoggedIn;
            mockGlobalUser = authData.user;
        } catch (e) {
            console.error("Failed to parse mockAuth from localStorage", e);
            localStorage.removeItem('mockAuth');
            mockGlobalIsLoggedIn = false;
            mockGlobalUser = null;
        }
    } else {
        mockGlobalIsLoggedIn = false;
        mockGlobalUser = null;
    }
    setIsLoggedIn(mockGlobalIsLoggedIn);
    setUser(mockGlobalUser);
    setIsLoading(false);
  }, []);

  const login = useCallback((email = 'test@example.com', uid = 'mock-user-123') => {
    mockGlobalIsLoggedIn = true;
    mockGlobalUser = { uid, email };
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockAuth', JSON.stringify({ isLoggedIn: true, user: mockGlobalUser }));
    }
    setIsLoggedIn(true);
    setUser(mockGlobalUser);
    console.log('[useAuth Mock] User logged in:', mockGlobalUser);
  }, []);

  const logout = useCallback(() => {
    mockGlobalIsLoggedIn = false;
    mockGlobalUser = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuth');
    }
    setIsLoggedIn(false);
    setUser(null);
    console.log('[useAuth Mock] User logged out');
  }, []);

  return { isLoggedIn, user, isLoading, login, logout };
}

// Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook(); // Use the hook internally

  // Prevent rendering children until initial loading is complete to avoid flashes of incorrect UI
  if (auth.isLoading) {
    return null; // Or a loading spinner, or some placeholder
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
