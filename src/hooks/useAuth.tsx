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
// Avoid bundling Firestore by not importing our firebase wrapper here.
// Import Firebase modules lazily inside functions/effects instead.
import type { User as FirebaseUser } from 'firebase/auth';
import type { FirebaseError, FirebaseOptions, FirebaseApp } from 'firebase/app';

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
  resetPassword: (email: string) => Promise<void>;
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
    let unsubscribe: (() => void) | undefined;
    setIsLoading(true);
    (async () => {
      const [{ getAuth, onAuthStateChanged }, { initializeApp, getApps, getApp }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/app'),
      ]);
      const config: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      const appInst: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
      const auth = getAuth(appInst);
      unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const newUser: User = {
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || '',
            phone: '',
            address: '',
            twoStep: false,
            textUpdates: false,
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
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // login & logout update state + localStorage
  const login = useCallback(
    async (email: string, password?: string, uid?: string, name?: string) => {
      try {
        const [{ getAuth, signInWithEmailAndPassword }, { initializeApp, getApps, getApp }] = await Promise.all([
          import('firebase/auth'),
          import('firebase/app'),
        ]);
        const config: FirebaseOptions = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        const appInst: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
        const auth = getAuth(appInst);
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
      const [authMod] = await Promise.all([import('firebase/auth')]);
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      const config: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      const appInst: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
      const auth = authMod.getAuth(appInst);
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await authMod.updateProfile(cred.user, { displayName: name });
      }
      await login(email, undefined, cred.user.uid, name);
    },
    [login],
  );

  const logout = useCallback(async () => {
    const [{ getAuth, signOut }, { initializeApp, getApps, getApp }] = await Promise.all([
      import('firebase/auth'),
      import('firebase/app'),
    ]);
    const config: FirebaseOptions = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    const appInst: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
    const auth = getAuth(appInst);
    const currentUser = auth.currentUser;

    try {
      // Log logout event before signing out
      if (currentUser) {
        try {
          const { auditService } = await import('@/services/firebase-audit-service');
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
        } catch {
          /* ignore audit errors */
        }
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

  const isFirebaseError = (e: unknown): e is FirebaseError => {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      typeof (e as { code: unknown }).code === 'string'
    );
  };

  const resetPassword = useCallback(async (email: string) => {
    try {
      const [{ getAuth, sendPasswordResetEmail }, { initializeApp, getApps, getApp }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/app'),
      ]);
      const config: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      const appInst: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
      const auth = getAuth(appInst);
      
      // Add additional error context and retry logic
      console.log('[useAuth] Attempting password reset for:', email);
      console.log('[useAuth] Auth instance:', auth);
      console.log('[useAuth] Firebase app:', appInst);
      
      await sendPasswordResetEmail(auth, email);
      
      console.log('[useAuth] Password reset email sent successfully');
      
      // Log password reset attempt
      try {
        const { auditService } = await import('@/services/firebase-audit-service');
        await auditService.logAuthEvent('password_reset', {
          email,
          ipAddress:
            typeof window !== 'undefined'
              ? window.location.hostname
              : 'unknown',
          userAgent:
            typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          success: true,
        });
      } catch {
        /* ignore audit errors */
      }
    } catch (err: unknown) {
      console.error('[useAuth] resetPassword error details:', {
        code: isFirebaseError(err) ? err.code : undefined,
        message: err instanceof Error ? err.message : undefined,
        stack: err instanceof Error ? err.stack : undefined,
        email,
        authDomain: app?.options?.authDomain,
        projectId: app?.options?.projectId,
      });
      
      // Provide more specific error messages
      let userFriendlyMessage =
        err instanceof Error ? err.message : 'Password reset failed';
      
      if (isFirebaseError(err) && err.code === 'auth/network-request-failed') {
        userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
      } else if (isFirebaseError(err) && err.code === 'auth/user-not-found') {
        userFriendlyMessage = 'No account found with this email address.';
      } else if (isFirebaseError(err) && err.code === 'auth/invalid-email') {
        userFriendlyMessage = 'Please enter a valid email address.';
      } else if (isFirebaseError(err) && err.code === 'auth/too-many-requests') {
        userFriendlyMessage = 'Too many attempts. Please wait a moment and try again.';
      }
      
      // Log failed password reset attempt
      try {
        const { auditService } = await import('@/services/firebase-audit-service');
        await auditService.logAuthEvent('password_reset', {
          email,
          ipAddress:
            typeof window !== 'undefined'
              ? window.location.hostname
              : 'unknown',
          userAgent:
            typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          success: false,
          error: isFirebaseError(err) ? err.code : 'Unknown error',
          errorMessage:
            err instanceof Error ? err.message : 'Password reset failed',
        });
      } catch (auditError) {
        console.error('[useAuth] Failed to log audit event:', auditError);
      }
      
      // Create a new error with user-friendly message but preserve original error code
      const enhancedError = new Error(userFriendlyMessage);
      Object.assign(enhancedError, {
        code: isFirebaseError(err) ? err.code : undefined,
        originalError: err,
      });
      
      throw enhancedError;
    }
  }, []);

  const contextValue = useMemo(
    () => ({ isLoggedIn, user, isLoading, login, signUp, logout, updateUser, resetPassword }),
    [isLoggedIn, user, isLoading, login, signUp, logout, updateUser, resetPassword],
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
