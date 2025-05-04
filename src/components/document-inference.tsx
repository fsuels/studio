
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, StopCircle, BrainCircuit, X, Text, FileText, MapPin, Edit2 } from 'lucide-react'; // Added StopCircle, Edit2
import { usStates } from '@/lib/document-library';
import { cn } from '@/lib/utils'; // Import cn utility

// Define props for the component, including the callback
interface DocumentInferenceProps {
    // Callback now returns the *raw* AI output and the state used
    onInferenceResult: (output: InferDocumentTypeOutput | null, state?: string) => void;
}

export function DocumentInference({ onInferenceResult }: DocumentInferenceProps) {
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text');
  const { toast } = useToast();
  const isRecordingRef = useRef(isRecording);
  const [recognition, setRecognition] = useState<any | null>(null);
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);
  const isBrowser = typeof window !== 'undefined';

  // Move useRef to the top level
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // --- Speech Recognition Setup Effect ---
  useEffect(() => {
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (SpeechRecognitionApi && !recognitionRef.current) { // Initialize only once
        try {
            const instance = new SpeechRecognitionApi();
            instance.continuous = true;
            instance.interimResults = true;

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
                 let errorMessage = `Error: ${event.error}. ${event.message || 'Try typing.'}`;
                 if (event.error === 'no-speech') errorMessage = "No speech detected.";
                 else if (event.error === 'audio-capture') errorMessage = "Mic capture failed.";
                 else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMessage = "Mic access denied.";
                 else if (event.error === 'network') errorMessage = "Network error during recognition.";
                 else if (event.error === 'aborted' && !isRecordingRef.current) return; // Ignore intentional stops

                toast({ title: "Speech Error", description: errorMessage, variant: "destructive" });
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
  }, [isBrowser, toast]); // Dependencies based on what triggers re-setup

  // Effect to sync isRecording state with its ref
   useEffect(() => {
       isRecordingRef.current = isRecording;
   }, [isRecording]);


  // --- Handlers ---
  const handleRecordToggle = () => {
     const currentRecognition = recognitionRef.current;
    if (!currentRecognition) {
         toast({ title: "Unsupported", description: "Speech recognition unavailable.", variant: "destructive" });
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
        // toast({ title: "Recording Stopped" });
    } else {
        // Start recording
        try {
            currentRecognition.start();
            console.log("Starting recognition.");
             setIsRecording(true);
             // Don't toast on start, rely on UI change
             // toast({ title: "Recording...", description: "Speak clearly." });
        } catch (e: any) {
            console.error("Error starting recognition:", e);
            let errorMsg = `Could not start recording: ${e.message}.`;
            if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorMsg = "Mic access denied.";
            else if (e.name === 'InvalidStateError') {
                console.warn("Recognition already started? Attempting to stop and restart.");
                try { currentRecognition.stop(); } catch {}
                setTimeout(() => {
                     try {
                        currentRecognition.start();
                        setIsRecording(true);
                     } catch (nestedE: any) {
                         toast({ title: "Recording Error", description: `Could not start recording: ${nestedE.message}.`, variant: "destructive" });
                         setIsRecording(false);
                     }
                 }, 100);
                 return; // Exit early
            }
             toast({ title: "Recording Error", description: errorMsg, variant: "destructive" });
             setIsRecording(false);
        }
    }
  };


  // --- Submit to AI Flow ---
  const handleInferDocument = useCallback(async () => { // No argument needed, reads from state
    const logPrefix = "[handleInferDocument]";
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      toast({ title: "Input Required", description: "Please provide a description via text or microphone.", variant: "destructive" });
      stableOnInferenceResult(null, selectedState);
      return;
    }
     // Stop recording if analysis starts while recording
     if (isRecording) {
         handleRecordToggle();
     }

    setIsLoading(true);
    stableOnInferenceResult(null, selectedState); // Clear previous results in parent

    const inputPayload: InferDocumentTypeInput = {
        description: trimmedDescription,
        ...(selectedState && { state: selectedState }),
    };

    console.log(`${logPrefix} Sending payload to API:`, inputPayload);

    // Use API Route or Cloud Function call here in production
    // For static export, keeping the simulation:
    console.log(`${logPrefix} AI Inference API Call Disabled for Static Export. Simulating...`);
    await new Promise(resolve => setTimeout(resolve, 700));
     let dummyDocType = "Residential Lease Agreement"; // Default to Lease
     let dummyConfidence = 0.75;
     let dummyReasoning = "Based on keywords like 'renting'. State considerations applied.";
     let dummyAlternatives : string[] | undefined = undefined;

      if (trimmedDescription.toLowerCase().includes("nda") || trimmedDescription.toLowerCase().includes("confidential")) {
         dummyDocType = "Mutual Non-Disclosure Agreement (NDA)";
         dummyConfidence = 0.85;
         dummyReasoning = "Keywords 'NDA' or 'confidential' detected.";
         dummyAlternatives = ["Unilateral Non-Disclosure Agreement (NDA)"];
      } else if (trimmedDescription.toLowerCase().includes("partner")) {
         dummyDocType = "Partnership Agreement";
         dummyConfidence = 0.80;
         dummyReasoning = "Keyword 'partner' detected.";
      } else if (trimmedDescription.length < 15) { // Example for low confidence
          dummyDocType = "General Inquiry";
          dummyConfidence = 0.3;
          dummyReasoning = "Description is very short. Unclear specific need.";
          dummyAlternatives = ["Service Agreement", "Residential Lease Agreement"];
      } else if (trimmedDescription.toLowerCase().includes("sell") || trimmedDescription.toLowerCase().includes("buy")) {
          dummyDocType = "Bill of Sale (Vehicle)";
          dummyConfidence = 0.70;
           dummyReasoning = "Keywords 'sell' or 'buy' detected, often related to vehicles.";
      }

      if (selectedState === 'CA') dummyReasoning += ` Specific clauses for CA might apply.`;
      else if (selectedState) dummyReasoning += ` Considering state ${selectedState}.`;

     const dummyOutput: InferDocumentTypeOutput = {
       documentType: dummyDocType,
       confidence: dummyConfidence,
       reasoning: dummyReasoning,
       alternatives: dummyAlternatives?.filter(alt => alt !== dummyDocType),
     };

     stableOnInferenceResult(dummyOutput, selectedState);
     setIsLoading(false);
     // return; // Keep exit for simulation

    /* // --- ORIGINAL API CALL CODE (Keep for reference or conditional use) ---
    try {
      const response = await fetch('/api/infer-document-type', { // Or your Cloud Function URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputPayload),
      });
      // ... rest of API handling ...
    } catch (error: unknown) {
       // ... error handling ...
    } finally {
      setIsLoading(false);
    }
    */
  }, [description, toast, stableOnInferenceResult, selectedState, isRecording]); // Added isRecording


  // Handle tab change
  const handleTabChange = (value: string) => {
     const newTab = value as 'text' | 'microphone';
     setActiveTab(newTab);
     if (newTab === 'text' && isRecording) {
         handleRecordToggle(); // Stop recording if switching to text tab
     }
  };


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
             <Text className="mr-2 h-4 w-4" /> Text
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
                 if (activeTab !== 'microphone' || !isRecording) {
                     handleRecordToggle();
                 } else if (isRecording) {
                     handleRecordToggle(); // Stop if already recording
                 }
             }}
             disabled={isLoading || !recognition} // Disable if loading or mic not supported
           >
               {isRecording ? (
                  <>
                    <StopCircle className="mr-2 h-4 w-4 text-red-600" /> Stop Recording
                  </>
               ) : (
                   <>
                     <Mic className="mr-2 h-4 w-4" /> Start Mic
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
              placeholder="e.g., 'Renting my apartment', 'Starting a business with a partner', 'Need someone to stop contacting me...'"
              value={description} // Directly bind to description state
              onChange={(e) => setDescription(e.target.value)} // Directly update description
              rows={5}
              className="rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring bg-card"
              disabled={isLoading} // Disable only when loading
              aria-describedby="text-helper-text"
            />
             <p id="text-helper-text" className="text-xs text-muted-foreground pl-1">
                Describe your situation clearly.
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
                        {isRecording ? 'Listening...' : (recognition ? 'Click "Start Mic" tab to begin.' : 'Microphone not available.')}
                    </span>
                 )}
            </div>
             <p id="mic-helper-text" className="text-xs text-muted-foreground pl-1">
               {isRecording ? <span className="text-red-600 font-medium">Recording... Speak clearly. Click "Stop Recording" tab when done.</span> : (recognition ? 'Click tab above to start recording.' : 'Mic unavailable.')}
            </p>
          </div>
        </TabsContent>
      </Tabs>

       {/* State Selection Dropdown */}
       <div className="space-y-2">
         <Label htmlFor="state-select" className="flex items-center">
             <MapPin className="mr-2 h-4 w-4 text-muted-foreground"/>
             Relevant U.S. State (Optional)
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
             <SelectValue placeholder="Select State..." />
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
              Helps tailor document suggestions. Select if applicable.
         </p>
       </div>


       {/* Infer Button */}
       <Button onClick={handleInferDocument} disabled={isLoading || isRecording || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing... </>
        ) : (
          <> <BrainCircuit className="mr-2 h-5 w-5"/> Analyze My Situation </>
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
