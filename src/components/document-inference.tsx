"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type'; // Updated import
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, StopCircle, BrainCircuit, X, Text, FileText, MapPin, Edit2 } from 'lucide-react'; // Added StopCircle, Edit2
import { usStates } from '@/lib/document-library';
import { cn } from '@/lib/utils'; // Import cn utility
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Define props for the component, including the callback
interface DocumentInferenceProps {
    // Callback now returns the *full* AI output object and the state used
    onInferenceResult: (output: InferDocumentTypeOutput | null, state?: string) => void; // Use InferDocumentTypeOutput
}

export function DocumentInference({ onInferenceResult }: DocumentInferenceProps) {
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text');
  const { toast } = useToast();
  const { t, i18n } = useTranslation(); // Get i18n instance for current language
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  // Move useRef calls to the top level
  const isRecordingRef = useRef(isRecording);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recognition, setRecognition] = useState<any | null>(null); // Keep state if needed for conditional UI
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);
  const isBrowser = typeof window !== 'undefined';

  // Effect to track hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);


  // --- Speech Recognition Setup Effect ---
  useEffect(() => {
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (SpeechRecognitionApi && !recognitionRef.current) { // Initialize only once
        try {
            const instance = new SpeechRecognitionApi();
            instance.continuous = true;
            instance.interimResults = true;
            instance.lang = i18n.language; // Set recognition language based on i18n

            instance.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setDescription(prev => (prev + finalTranscript).trim() + ' ');
                }
            };

            instance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error, event.message);
                 let errorMessage = t('documentInference.micErrorDefault', { error: event.error, message: event.message || 'Try typing.' });
                 if (event.error === 'no-speech') errorMessage = t('documentInference.micErrorNoSpeech');
                 else if (event.error === 'audio-capture') errorMessage = t('documentInference.micErrorAudioCapture');
                 else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMessage = t('documentInference.micErrorNotAllowed');
                 else if (event.error === 'network') errorMessage = t('documentInference.micErrorNetwork');
                 else if (event.error === 'aborted' && !isRecordingRef.current) return; // Ignore intentional stops

                toast({ title: t('documentInference.micErrorTitle'), description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false);
            };

            instance.onend = () => {
                 if (isRecordingRef.current) {
                    setIsRecording(false);
                    console.log("Recognition ended unexpectedly, stopping recording state.");
                 } else {
                    console.log("Recognition ended intentionally.");
                 }
            };

            recognitionRef.current = instance; // Store instance in ref
            setRecognition(instance); // Keep state for potential conditional rendering if needed

        } catch (e) {
            console.error("Failed to initialize SpeechRecognition:", e);
            setRecognition(null);
        }
    } else if (!SpeechRecognitionApi) {
        console.warn('Speech Recognition API not supported.');
        setRecognition(null);
    } else if (recognitionRef.current) {
        // Update language if i18n language changes after initialization
        recognitionRef.current.lang = i18n.language;
    }

    // Cleanup function
    return () => {
       const currentRecognition = recognitionRef.current;
       if (currentRecognition && isRecordingRef.current) {
           isRecordingRef.current = false;
           try {
                currentRecognition.stop();
                console.log("Stopping recognition on unmount/cleanup.");
           } catch (e) { console.warn("Error stopping recognition on unmount:", e); }
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrowser, toast, i18n.language, t]); // Added t to dependency array

  // Effect to sync isRecording state with its ref
   useEffect(() => {
       isRecordingRef.current = isRecording;
   }, [isRecording]);


  // --- Handlers ---
  const handleRecordToggle = () => {
     const currentRecognition = recognitionRef.current;
    if (!currentRecognition) {
         toast({ title: t('documentInference.micUnsupportedTitle'), description: t('documentInference.micUnsupportedDescription'), variant: "destructive" });
         setActiveTab('text');
         return;
    }

    if (isRecording) {
         // Stop recording
        try {
            currentRecognition.stop();
            console.log("Manually stopping recognition.");
        } catch (e) { console.warn("Error stopping recognition:", e); }
        setIsRecording(false);
        // Don't toast on manual stop, less intrusive
    } else {
        // Start recording
        try {
            currentRecognition.lang = i18n.language; // Ensure correct language before starting
            currentRecognition.start();
            console.log(`Starting recognition in language: ${currentRecognition.lang}.`);
             setIsRecording(true);
             // Don't toast on start, rely on UI change
        } catch (e: any) {
            console.error("Error starting recognition:", e);
            let errorMsg = t('documentInference.micStartErrorDefault', { message: e.message });
            if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorMsg = t('documentInference.micErrorNotAllowed');
            else if (e.name === 'InvalidStateError') {
                console.warn("Recognition already started? Attempting to stop and restart.");
                try { currentRecognition.stop(); } catch {}
                setTimeout(() => {
                     try {
                        currentRecognition.lang = i18n.language; // Ensure correct language
                        currentRecognition.start();
                        setIsRecording(true);
                     } catch (nestedE: any) {
                         toast({ title: t('documentInference.micStartErrorTitle'), description: t('documentInference.micStartErrorDefault', { message: nestedE.message }), variant: "destructive" });
                         setIsRecording(false);
                     }
                 }, 100);
                 return; // Exit early
            }
             toast({ title: t('documentInference.micStartErrorTitle'), description: errorMsg, variant: "destructive" });
             setIsRecording(false);
        }
    }
  };


  // --- Submit to AI Flow ---
  const handleInferDocument = useCallback(async () => { // No argument needed, reads from state
    const logPrefix = "[handleInferDocument]";
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      toast({ title: t('documentInference.inputRequiredTitle'), description: t('documentInference.inputRequiredDescription'), variant: "destructive" });
      stableOnInferenceResult(null, selectedState);
      return;
    }
     // Stop recording if analysis starts while recording
     if (isRecordingRef.current) { // Use ref for accurate check within async callback
         handleRecordToggle();
     }

    setIsLoading(true);
    stableOnInferenceResult(null, selectedState); // Clear previous results in parent

    const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en'; // Get current language

    const inputPayload: InferDocumentTypeInput = {
        description: trimmedDescription,
        language: currentLanguage, // Add language to payload
        ...(selectedState && { state: selectedState }),
    };

    console.log(`${logPrefix} Sending payload to API:`, inputPayload);

    // --- PRODUCTION: Use API Route or Cloud Function call ---
    try {
        const response = await fetch('/api/infer-document-type', { // Or your Cloud Function URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputPayload),
        });

        if (!response.ok) {
            let errorMsg = t('documentInference.analysisFailedDefault');
            let errorCode = 'API_ERROR';
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
                errorCode = errorData.code || errorCode;
                 console.error(`${logPrefix} API Error ${response.status} (${errorCode}):`, errorData);
            } catch {
                // Ignore JSON parsing error if response is not JSON
                 console.error(`${logPrefix} API Error ${response.status}:`, await response.text());
            }
            // Handle specific known errors from API
            if (errorCode === 'STATIC_EXPORT_API_DISABLED') {
                errorMsg = t('documentInference.analysisFailedApiDisabled');
            }
            toast({ title: t('documentInference.analysisFailedTitle'), description: errorMsg, variant: "destructive" });
            stableOnInferenceResult(null, selectedState); // Clear results on error
             setIsLoading(false); // Ensure loading state is reset
            return;
        }

        const result: InferDocumentTypeOutput = await response.json();
        console.log(`${logPrefix} Received API response:`, result);
        stableOnInferenceResult(result, selectedState); // Pass the full output object

    } catch (error: unknown) {
        console.error(`${logPrefix} Network or other error during fetch:`, error);
        toast({ title: t('documentInference.networkErrorTitle'), description: t('documentInference.networkErrorDescription'), variant: "destructive" });
        stableOnInferenceResult(null, selectedState); // Clear results on error
    } finally {
        setIsLoading(false);
    }
    // --- END PRODUCTION ---

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, toast, stableOnInferenceResult, selectedState, handleRecordToggle, i18n.language, t]); // Added t to dependency array


  // Handle tab change
  const handleTabChange = (value: string) => {
     const newTab = value as 'text' | 'microphone';
     setActiveTab(newTab);
     if (newTab === 'text' && isRecordingRef.current) { // Use ref
         handleRecordToggle(); // Stop recording if switching to text tab
     }
  };

  if (!isHydrated) {
     // Render a placeholder or null during SSR and initial client render
     return <div className="h-64 animate-pulse bg-muted rounded-lg"></div>; // Example placeholder
  }

  return (
    <div className="space-y-6">
      {/* Input Area */}
       {/* Use standard Tabs component */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            {/* Apply visual styling for active/inactive tabs */}
           <TabsTrigger
              value="text"
              aria-label="Use Text Input"
              className={cn(
                  "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none",
                  "text-muted-foreground"
              )}
              disabled={isLoading}
           >
             <Text className="mr-2 h-4 w-4" /> {t('Text')} {/* Translate Tab Label */}
           </TabsTrigger>
           <TabsTrigger
             value="microphone"
             aria-label={isRecording ? "Stop Recording" : "Use Microphone Input"}
             className={cn(
                 "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none",
                  "text-muted-foreground",
                  isRecording && 'bg-red-100 text-red-700 data-[state=active]:bg-red-100 data-[state=active]:text-red-700' // Highlight red when recording
             )}
             onClick={() => {
                 // Toggle recording only if microphone tab becomes active or is already active
                 handleRecordToggle(); // Simplified toggle logic
             }}
             disabled={isLoading || !recognition} // Disable if loading or mic not supported
           >
               {isRecording ? (
                  <>
                    <StopCircle className="mr-2 h-4 w-4 text-red-600" /> {t('Stop Recording')} {/* Translate Tab Label */}
                  </>
               ) : (
                   <>
                     <Mic className="mr-2 h-4 w-4" /> {t('Start Mic')} {/* Translate Tab Label */}
                   </>
               )}
           </TabsTrigger>
        </TabsList>

        {/* Text Input Content */}
        <TabsContent value="text" className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="description-text" className="sr-only">Description (Text)</Label>
            <Textarea
              id="description-text"
              placeholder={t('documentInference.describePlaceholder') || "e.g., 'Renting my apartment'..."} // Translate placeholder
              value={description} // Directly bind to description state
              onChange={(e) => setDescription(e.target.value)} // Directly update description
              rows={5}
              className="rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring bg-card"
              disabled={isLoading} // Disable only when loading
              aria-describedby="text-helper-text"
            />
             <p id="text-helper-text" className="text-xs text-muted-foreground pl-1">
                {t('documentInference.textHelper')} {/* Translate helper text */}
            </p>
          </div>
        </TabsContent>

        {/* Microphone Input Content */}
        <TabsContent value="microphone" className="mt-4">
           <div className="space-y-2">
            <Label htmlFor="description-mic" className="sr-only">Description (Microphone Transcript)</Label>
            <div
              id="description-mic"
              className="min-h-[120px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-live="polite"
            >
                 {/* Display transcript directly */}
                 {description || (
                    <span className="text-muted-foreground italic">
                         {isRecording ? t('documentInference.micTranscriptPlaceholderListening') : (recognition ? t('documentInference.micTranscriptPlaceholderStart') : t('documentInference.micTranscriptPlaceholderUnavailable'))} {/* Translate placeholder */}
                    </span>
                 )}
            </div>
             <p id="mic-helper-text" className="text-xs text-muted-foreground pl-1">
                {isRecording ? <span className="text-red-600 font-medium">{t('documentInference.micHelperRecording')}</span> : (recognition ? t('documentInference.micHelperStart') : t('documentInference.micHelperUnavailable'))} {/* Translate helper text */}
            </p>
          </div>
        </TabsContent>
      </Tabs>

       {/* State Selection Dropdown */}
       <div className="space-y-2">
         <Label htmlFor="state-select" className="flex items-center">
             <MapPin className="mr-2 h-4 w-4 text-muted-foreground"/>
             {t('documentInference.stateLabel')} {/* Translate label */}
         </Label>
         <Select
             value={selectedState}
             onValueChange={(value) => {
                 const newState = value === 'none' ? undefined : value;
                 setSelectedState(newState);
             }}
             disabled={isLoading || isRecording} // Disable during loading or recording
         >
           <SelectTrigger id="state-select" className="w-full rounded-md shadow-sm" aria-label="Select relevant U.S. state">
             <SelectValue placeholder={t('documentInference.statePlaceholder') || "Select State..."} /> {/* Translate placeholder */}
           </SelectTrigger>
           <SelectContent>
             {/* <SelectItem value="none">Not Applicable / Unsure</SelectItem> */}
             {usStates.map(state => (
               <SelectItem key={state.value} value={state.value}>
                 {state.label} ({state.value})
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         <p className="text-xs text-muted-foreground pl-1">
              {t('documentInference.stateHelper')} {/* Translate helper text */}
         </p>
       </div>


       {/* Infer Button */}
       <Button onClick={handleInferDocument} disabled={isLoading || isRecording || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('documentInference.analyzingButton')} </>
        ) : (
          <> <BrainCircuit className="mr-2 h-5 w-5"/> {t('documentInference.analyzeButton')} </>
        )}
      </Button>

    </div>
  );
}


// Assign window properties conditionally for SSR safety
if (typeof window !== 'undefined') {
  window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// Define SpeechRecognition types if not available globally (common issue)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
}
