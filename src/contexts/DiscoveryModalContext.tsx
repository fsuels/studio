'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiscoveryModalContextType {
  showDiscoveryModal: boolean;
  setShowDiscoveryModal: (show: boolean) => void;
  discoveryInput: string;
  setDiscoveryInput: (input: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const DiscoveryModalContext = createContext<DiscoveryModalContextType | undefined>(undefined);

export function DiscoveryModalProvider({ children }: { children: ReactNode }) {
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discoveryInput, setDiscoveryInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  return (
    <DiscoveryModalContext.Provider value={{
      showDiscoveryModal,
      setShowDiscoveryModal,
      discoveryInput,
      setDiscoveryInput,
      isListening,
      setIsListening
    }}>
      {children}
    </DiscoveryModalContext.Provider>
  );
}

export function useDiscoveryModal() {
  const context = useContext(DiscoveryModalContext);
  if (context === undefined) {
    // During SSR or in edge cases where the provider isn't mounted yet,
    // return a safe no-op implementation to avoid hard crashes.
    // The real provider will replace this on the client.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[DiscoveryModal] Falling back to no-op context (no provider found).');
    }
    return {
      showDiscoveryModal: false,
      setShowDiscoveryModal: () => {},
      discoveryInput: '',
      setDiscoveryInput: () => {},
      isListening: false,
      setIsListening: () => {},
    } as const;
  }
  return context;
}
