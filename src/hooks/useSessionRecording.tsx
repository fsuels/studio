// React hook for session recording integration
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sessionRecorder } from '@/lib/support-toolkit/session-replay';

export function useSessionRecording() {
  const { user } = useAuth();
  const isRecordingRef = useRef(false);

  useEffect(() => {
    // Start recording when user is authenticated and recording hasn't started
    if (user && sessionRecorder && !isRecordingRef.current) {
      sessionRecorder.startRecording(user.uid);
      isRecordingRef.current = true;

      // Track user identification for better support
      sessionRecorder.trackDocumentAction('user_session', 'user_identified', {
        userId: user.uid,
        email: user.email,
        signInProvider: user.providerData?.[0]?.providerId
      });
    }

    // Stop recording when user logs out
    if (!user && sessionRecorder && isRecordingRef.current) {
      sessionRecorder.stopRecording();
      isRecordingRef.current = false;
    }

    // Cleanup on unmount
    return () => {
      if (sessionRecorder && isRecordingRef.current) {
        sessionRecorder.stopRecording();
        isRecordingRef.current = false;
      }
    };
  }, [user]);

  // Public API for tracking specific events from components
  const trackEvent = {
    documentStarted: (documentType: string, step: string) => {
      sessionRecorder?.trackDocumentAction(documentType, 'document_started', { step });
    },
    
    documentCompleted: (documentType: string, totalSteps: number, completedSteps: number) => {
      sessionRecorder?.trackDocumentAction(documentType, 'document_completed', { 
        totalSteps, 
        completedSteps,
        completionRate: completedSteps / totalSteps 
      });
    },
    
    documentAbandoned: (documentType: string, step: string, reason?: string) => {
      sessionRecorder?.trackDocumentAction(documentType, 'document_abandoned', { 
        step, 
        reason: reason || 'unknown'
      });
    },
    
    paymentStarted: (amount: number, documentType: string) => {
      sessionRecorder?.trackDocumentAction('payment', 'payment_started', { 
        amount, 
        documentType 
      });
    },
    
    paymentCompleted: (amount: number, documentType: string, paymentMethod: string) => {
      sessionRecorder?.trackDocumentAction('payment', 'payment_completed', { 
        amount, 
        documentType,
        paymentMethod 
      });
    },
    
    paymentFailed: (amount: number, documentType: string, errorCode?: string) => {
      sessionRecorder?.trackDocumentAction('payment', 'payment_failed', { 
        amount, 
        documentType,
        errorCode 
      });
    },
    
    supportRequest: (type: 'chat' | 'phone' | 'email', context?: string) => {
      sessionRecorder?.trackDocumentAction('support', 'support_requested', { 
        type, 
        context 
      });
    },
    
    formValidationError: (field: string, errorType: string, documentType: string) => {
      sessionRecorder?.trackDocumentAction(documentType, 'validation_error', { 
        field, 
        errorType 
      });
    },
    
    searchPerformed: (query: string, resultsCount: number) => {
      sessionRecorder?.trackDocumentAction('search', 'search_performed', { 
        query: query.slice(0, 50), // Limit query length for privacy
        resultsCount 
      });
    }
  };

  return {
    isRecording: isRecordingRef.current,
    sessionId: sessionRecorder?.getSessionId(),
    trackEvent
  };
}