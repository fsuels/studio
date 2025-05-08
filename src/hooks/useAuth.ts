// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// Mock auth state. In a real app, this would come from context or a library.
let mockGlobalIsLoggedIn = false; // Renamed to avoid conflict with component state
let mockGlobalUser: { uid: string; email?: string | null } | null = null; // Renamed

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // Simulate checking auth status on mount from localStorage
    setIsLoading(true);
    const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('mockAuth') : null;
    if (storedAuth) {
        try {
            const authData = JSON.parse(storedAuth);
            mockGlobalIsLoggedIn = authData.isLoggedIn;
            mockGlobalUser = authData.user;
        } catch (e) {
            console.error("Failed to parse mockAuth from localStorage", e);
            localStorage.removeItem('mockAuth'); // Clear corrupted data
            mockGlobalIsLoggedIn = false;
            mockGlobalUser = null;
        }
    } else {
        // If nothing in localStorage, default to logged out
        mockGlobalIsLoggedIn = false;
        mockGlobalUser = null;
    }

    setIsLoggedIn(mockGlobalIsLoggedIn);
    setUser(mockGlobalUser);
    setIsLoading(false); // Done loading
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
