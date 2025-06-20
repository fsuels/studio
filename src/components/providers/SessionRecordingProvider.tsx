'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionRecording } from '@/hooks/useSessionRecording';

interface SessionRecordingContextType {
  isRecording: boolean;
  sessionId: string | undefined;
  trackEvent: {
    documentStarted: (documentType: string, step: string) => void;
    documentCompleted: (documentType: string, totalSteps: number, completedSteps: number) => void;
    documentAbandoned: (documentType: string, step: string, reason?: string) => void;
    paymentStarted: (amount: number, documentType: string) => void;
    paymentCompleted: (amount: number, documentType: string, paymentMethod: string) => void;
    paymentFailed: (amount: number, documentType: string, errorCode?: string) => void;
    supportRequest: (type: 'chat' | 'phone' | 'email', context?: string) => void;
    formValidationError: (field: string, errorType: string, documentType: string) => void;
    searchPerformed: (query: string, resultsCount: number) => void;
  };
}

const SessionRecordingContext = createContext<SessionRecordingContextType | undefined>(undefined);

interface SessionRecordingProviderProps {
  children: ReactNode;
}

export function SessionRecordingProvider({ children }: SessionRecordingProviderProps) {
  const sessionRecording = useSessionRecording();

  return (
    <SessionRecordingContext.Provider value={sessionRecording}>
      {children}
    </SessionRecordingContext.Provider>
  );
}

export function useSessionRecordingContext() {
  const context = useContext(SessionRecordingContext);
  if (context === undefined) {
    // Return safe defaults if context is not available
    return {
      isRecording: false,
      sessionId: undefined,
      trackEvent: {
        documentStarted: () => {},
        documentCompleted: () => {},
        documentAbandoned: () => {},
        paymentStarted: () => {},
        paymentCompleted: () => {},
        paymentFailed: () => {},
        supportRequest: () => {},
        formValidationError: () => {},
        searchPerformed: () => {},
      }
    };
  }
  return context;
}