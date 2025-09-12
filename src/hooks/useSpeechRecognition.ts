import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UseSpeechRecognitionOptions {
  locale: 'en' | 'es';
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
}

export function useSpeechRecognition({
  locale,
  continuous = false,
  interimResults = false,
  onResult,
  onError
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const checkSecurityRequirements = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    const isSecure = location.protocol === 'https:' || 
                    location.hostname === 'localhost' || 
                    location.hostname === '127.0.0.1' ||
                    location.hostname.endsWith('.local') ||
                    location.protocol === 'file:';

    if (!isSecure) {
      const errorMsg = "Voice input requires a secure connection (HTTPS or localhost)";
      setError(errorMsg);
      onError?.(errorMsg);
      toast({
        title: "HTTPS Required",
        description: "Voice input requires a secure connection. Please use HTTPS or localhost for development.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [onError, toast]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      const errorMsg = "Speech recognition not supported in this browser";
      setError(errorMsg);
      onError?.(errorMsg);
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Please try Chrome, Safari, or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (!checkSecurityRequirements()) {
      return;
    }

  try {
      type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
      interface SpeechRecognitionEventLike {
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
      }
      interface SpeechRecognitionInstance {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onresult: (event: SpeechRecognitionEventLike) => void;
        onerror: (event: { error: string }) => void;
        onend: () => void;
        start: () => void;
        stop?: () => void;
      }

      const win = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      const recognition = new (SpeechRecognition as SpeechRecognitionConstructor)();
      
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = locale === 'es' ? 'es-ES' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        toast({
          title: "Listening...",
          description: "Speak clearly about your legal document needs.",
        });
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        try {
          const result = event.results[event.results.length - 1];
          const newTranscript = result[0].transcript;
          
          setTranscript(newTranscript);
          
          if (result.isFinal) {
            onResult?.(newTranscript);
            toast({
              title: "Voice captured!",
              description: `You said: "${newTranscript}"`,
            });
          }
        } catch (err) {
          console.error('Speech recognition result error:', err);
          const errorMsg = "Could not process speech result";
          setError(errorMsg);
          onError?.(errorMsg);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Voice input failed. Please try again.";
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not accessible. Please check your microphone permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone permission denied. Please allow microphone access and try again.";
            break;
          case 'network':
            errorMessage = "Network error occurred. Please check your connection and try again.";
            break;
        }
        
        setError(errorMessage);
        onError?.(errorMessage);
        toast({
          title: "Voice Input Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition setup error:', err);
      const errorMsg = "Could not initialize voice input";
      setError(errorMsg);
      onError?.(errorMsg);
      setIsListening(false);
      toast({
        title: "Voice input failed",
        description: "Could not initialize voice input. Please try text input instead.",
        variant: "destructive",
      });
    }
  }, [isSupported, checkSecurityRequirements, continuous, interimResults, locale, onResult, onError, toast]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // Note: The actual recognition instance would need to be stored in a ref to call stop()
    // This could be enhanced if needed
  }, []);

  // Reset error when starting new session
  useEffect(() => {
    if (isListening) {
      setError(null);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    error
  };
}
