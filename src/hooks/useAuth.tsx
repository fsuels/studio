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
import { app } from '@/lib/firebase'; // ← Corrected import path
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auditService } from '@/services/firebase-audit-service';

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
  login: (
    email: string,
    password?: string,
    uid?: string,
    name?: string,
  ) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User> & { password?: string }) => void;
}

// 2) Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3) A hook that manages auth state and persistence
function useAuthHook(): AuthContextType {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firebase auth state
  useEffect(() => {
    const auth = getAuth(app);
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const newUser: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || '',
          phone: user?.phone || '',
          address: user?.address || '',
          twoStep: user?.twoStep || false,
          textUpdates: user?.textUpdates || false,
        };
        setIsLoggedIn(true);
        setUser(newUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'mockAuth',
            JSON.stringify({ isLoggedIn: true, user: newUser }),
          );
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mockAuth');
        }
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // login & logout update state + localStorage
  const login = useCallback(
    async (email: string, password?: string, uid?: string, name?: string) => {
      try {
        const auth = getAuth(app);
        let fbUser = auth.currentUser;
        if (password) {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
          uid = cred.user.uid;
          name = cred.user.displayName || name;
        }

        const newUser: User = {
          uid: uid || fbUser?.uid || `mock-user-${Date.now()}`,
          email: fbUser?.email || email,
          name: name || fbUser?.displayName || '',
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
      } catch (err) {
        console.error('[useAuth] login error', err);
        throw err;
      }
    },
    [user],
  );

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const auth = getAuth(app);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      await login(email, undefined, cred.user.uid, name);
    },
    [login],
  );

  const logout = useCallback(async () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    try {
      // Log logout event before signing out
      if (currentUser) {
        await auditService.logAuthEvent('logout', {
          email: currentUser.email,
          ipAddress:
            typeof window !== 'undefined'
              ? window.location.hostname
              : 'unknown',
          userAgent:
            typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          success: true,
        });
      }

      await signOut(auth);
    } catch (err) {
      console.error('[useAuth] signOut error', err);
    }

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
          JSON.stringify({ isLoggedIn: true, user: updatedUser }),
        );
        return updatedUser;
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ isLoggedIn, user, isLoading, login, signUp, logout, updateUser }),
    [isLoggedIn, user, isLoading, login, signUp, logout, updateUser],
  );

  return contextValue;
}

// 4) The provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const authHookValue = useAuthHook();

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
