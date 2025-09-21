import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  abort?: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

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
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [isSupported, setIsSupported] = useState(false);

  // Detect support on mount so we don't run window checks on the server
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    setIsSupported(Boolean(win.SpeechRecognition || win.webkitSpeechRecognition));
  }, []);

  const checkSecurityRequirements = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    const isSecure = location.protocol === 'https:' || 
                    location.hostname === 'localhost' || 
                    location.hostname === '127.0.0.1' ||
                    location.hostname.endsWith('.local') ||
                    location.hostname.endsWith('.localhost') ||
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
      const win = window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        const errorMsg = "Voice input isn't available in this browser. Try Chrome, Edge, or Safari.";
        setError(errorMsg);
        onError?.(errorMsg);
        toast({
          title: "Voice input unavailable",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop?.();
          recognitionRef.current.abort?.();
        } catch (err) {
          console.error('Speech recognition cleanup before restart failed:', err);
        }
      }

      const recognition = new (SpeechRecognition as SpeechRecognitionConstructor)();
      recognitionRef.current = recognition;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = locale === 'es' ? 'es-ES' : 'en-US';

      recognition.onstart = () => {
        // onstart may fire a bit later; we optimistically set listening below
        // but ensure state stays synced when the event arrives.
        setIsListening(true);
        setError(null);
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
        recognitionRef.current = null;

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
        recognitionRef.current = null;
      };

      setTranscript('');
      setError(null);
      setIsListening(true);
      toast({
        title: "Listening…",
        description: "We’re ready. Describe the document you need.",
      });

      recognition.start();
    } catch (err) {
      console.error('Speech recognition setup error:', err);
      const errorMsg = "Could not initialize voice input";
      setError(errorMsg);
      onError?.(errorMsg);
      setIsListening(false);
      recognitionRef.current = null;
      toast({
        title: "Voice input failed",
        description: "Could not initialize voice input. Please try text input instead.",
        variant: "destructive",
      });
    }
  }, [isSupported, checkSecurityRequirements, continuous, interimResults, locale, onResult, onError, toast]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;

    try {
      recognition?.stop?.();
      recognition?.abort?.();
    } catch (err) {
      console.error('Speech recognition stop error:', err);
    }

    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
        recognitionRef.current?.abort?.();
      } catch (err) {
        console.error('Speech recognition cleanup error:', err);
      } finally {
        recognitionRef.current = null;
      }
    };
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
