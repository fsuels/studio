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
    throw new Error('useDiscoveryModal must be used within a DiscoveryModalProvider');
  }
  return context;
}