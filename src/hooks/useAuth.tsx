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
import { app } from '@/lib/firebase';        // ← Corrected import path
import { getAuth } from 'firebase/auth';     // ← Use getAuth with the initialized app

// 1) Define the shape of your auth context
interface User {
  uid: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  twoStep?: boolean;
  textUpdates?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, uid?: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User> & { password?: string }) => void;
}

// 2) Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3) A hook that manages auth state and persistence
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
          if (
            parsedData &&
            typeof parsedData === 'object' &&
            'isLoggedIn' in parsedData &&
            'user' in parsedData
          ) {
            setIsLoggedIn(parsedData.isLoggedIn);
            setUser(parsedData.user);
          } else {
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
    async (email: string, uid?: string, name?: string) => {
      const newUid = uid || `mock-user-${Date.now()}`;
      let finalName = name || user?.name || '';

      if (!finalName && uid) {
        try {
          const auth = getAuth(app);  // ← Now works correctly
          if (auth.currentUser?.uid === uid) {
            finalName = auth.currentUser.displayName || '';
          }
        } catch (err) {
          console.warn('[useAuth] Failed to retrieve username from auth service', err);
        }
      }

      const newUser: User = {
        uid: newUid,
        email,
        name: finalName,
        phone: user?.phone || '',
        address: user?.address || '',
        twoStep: user?.twoStep || false,
        textUpdates: user?.textUpdates || false,
      };

      localStorage.setItem(
        'mockAuth',
        JSON.stringify({ isLoggedIn: true, user: newUser })
      );
      setIsLoggedIn(true);
      setUser(newUser);
    },
    [user]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('mockAuth');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (updates: Partial<User> & { password?: string }) => {
      setUser((prevUser) => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...updates };
        localStorage.setItem(
          'mockAuth',
          JSON.stringify({ isLoggedIn: true, user: updatedUser })
        );
        return updatedUser;
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({ isLoggedIn, user, isLoading, login, logout, updateUser }),
    [isLoggedIn, user, isLoading, login, logout, updateUser]
  );

  return contextValue;
}

// 4) The provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const authHookValue = useAuthHook();

  if (authHookValue.isLoading && typeof window !== 'undefined') {
    return null;
  }

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
