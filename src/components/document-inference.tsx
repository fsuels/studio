
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X, Text } from 'lucide-react'; // Added Text icon

// Mock SpeechRecognition - Replace with actual implementation if needed
const MockSpeechRecognition = {
  start: () => console.log("Mock SpeechRecognition started"),
  stop: () => console.log("Mock SpeechRecognition stopped"),
  onresult: (event: any) => {},
  onerror: (event: any) => {},
  abort: () => console.log("Mock SpeechRecognition aborted"),
  continuous: false,
  interimResults: false,
  onend: () => {} // Added onend mock
};

// Define props for the component, including the callback
interface DocumentInferenceProps {
    onInferenceResult: (result: InferDocumentTypeOutput | null) => void;
}

export function DocumentInference({ onInferenceResult }: DocumentInferenceProps) {
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InferDocumentTypeOutput | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text'); // State for tabs
  const { toast } = useToast();

  const isRecordingRef = useRef(isRecording); // Top-level hook

  // State for browser speech recognition API
  const [recognition, setRecognition] = useState<any | null>(null); // Use 'any' for broader compatibility initially

  // Memoize the callback to prevent unnecessary re-renders if passed inline
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);

  // Helper function to safely check for window object
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    isRecordingRef.current = isRecording; // Keep ref in sync

    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionApi) {
        try {
            recognitionInstance = new SpeechRecognitionApi();
            recognitionInstance.continuous = true; // Keep listening
            recognitionInstance.interimResults = true; // Get results while speaking

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
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

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error, event.message);
                let errorMessage = `Error: ${event.error}. ${event.message || 'Please try again or type your description.'}`;
                 if (event.error === 'no-speech') {
                     errorMessage = "No speech detected. Ensure mic is working and speak clearly.";
                 } else if (event.error === 'audio-capture') {
                     errorMessage = "Audio capture failed. Check mic permissions & hardware.";
                 } else if (event.error === 'not-allowed') {
                     errorMessage = "Microphone access denied. Allow microphone access in browser settings.";
                 }
                toast({ title: "Speech Error", description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false); // Stop recording state on error
            };

            recognitionInstance.onend = () => {
                console.log("Speech recognition ended.");
                // Only update state if it was supposed to be recording
                if (isRecordingRef.current) {
                    setIsRecording(false); // Ensure state reflects reality if service stops unexpectedly
                }
            };

            setRecognition(recognitionInstance);

        } catch (e) {
            console.error("Failed to initialize SpeechRecognition:", e);
            setRecognition(null); // Ensure recognition state is null if init fails
        }

    } else {
        console.warn('Speech Recognition API not supported.');
        setRecognition(null); // Explicitly set to null if not supported
    }

    // Cleanup
    return () => {
       if (recognitionInstance && isRecordingRef.current) {
           try {
              recognitionInstance.stop();
              console.log("Stopped speech recognition on component unmount.");
           } catch (e) {
               console.warn("Could not stop speech recognition on unmount:", e);
               try { recognitionInstance.abort(); console.log("Aborted speech recognition on unmount."); }
               catch (abortError) { console.warn("Could not abort speech recognition on unmount:", abortError); }
           }
       }
    };
  }, [isBrowser, toast]); // Removed isRecording dependency


  // Effect to start/stop recognition when isRecording changes
   useEffect(() => {
       if (recognition) {
           if (isRecording) {
               try {
                   recognition.start();
                   console.log("Speech recognition started.");
               } catch (e: any) {
                   console.error("Error starting recognition:", e);
                    let errorMsg = `Could not start recording: ${e.message}. Ensure permissions are granted.`;
                    if (e.name === 'NotAllowedError') {
                        errorMsg = "Microphone access denied. Please allow access in your browser settings.";
                    } else if (e.name === 'InvalidStateError'){
                        // This might happen if start() is called while already started
                        console.warn("Recognition already started or in invalid state.");
                        // Don't toast for this internal state issue unless necessary
                        return; // Avoid setting isRecording back to false
                    }
                   toast({ title: "Recording Error", description: errorMsg, variant: "destructive" });
                   setIsRecording(false); // Correct state if start fails
               }
           } else {
               try {
                   recognition.stop();
                   console.log("Speech recognition stopped by state change.");
               } catch(e) {
                    // Catch potential error if stop() is called when already stopped
                    console.warn("Error stopping recognition (might already be stopped):", e);
               }
           }
       }
   }, [isRecording, recognition, toast]); // Depend on isRecording and recognition instance


  const handleRecordToggle = () => {
    if (!recognition) {
         toast({
            title: "Unsupported",
            description: "Speech recognition not supported. Please type.",
            variant: "destructive",
        });
        setActiveTab('text'); // Switch back to text tab
      return;
    }

    // Toggle recording state - the useEffect handles start/stop
    setIsRecording(prev => !prev);

    if (!isRecording) {
        // Clear description when starting a new recording? Optional UX choice.
        // setDescription('');
         toast({
            title: "Recording...",
            description: "Speak clearly. Click the mic again to stop.",
        });
    } else {
         toast({
            title: "Recording Stopped",
         });
    }
  };

  const handleSubmit = useCallback(async (currentDescription: string) => {
    const trimmedDescription = currentDescription.trim();
    if (!trimmedDescription) {
      toast({ title: "Input Required", description: "Please provide a description.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);
    stableOnInferenceResult(null);

    try {
      console.log("[handleSubmit] Calling API /api/infer-document-type with description:", trimmedDescription);
      const input: InferDocumentTypeInput = { description: trimmedDescription };

      const response = await fetch('/api/infer-document-type', {
          method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(input),
      });
      const responseData = await response.json();

      if (!response.ok) {
          console.error("[handleSubmit Error] API error:", response.status, responseData);
          throw new Error(responseData.error || `API Error: ${response.status}`);
      }

      const output: InferDocumentTypeOutput = responseData;
      console.log("[handleSubmit] API success. Output:", output);
      setResult(output);
      stableOnInferenceResult(output);
      toast({ title: "Analysis Complete", description: `Suggested: ${output.documentType}` });
    } catch (error: unknown) {
      console.error('[handleSubmit Error]', error);
      const errorMessage = error instanceof Error ? error.message : `An unexpected error occurred: ${String(error)}`;
      toast({ title: "AI Error", description: errorMessage, variant: "destructive" });
      stableOnInferenceResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast, stableOnInferenceResult]);


   const handleEditDescription = () => {
    setEditedDescription(description);
    setIsEditingDescription(true);
  };

  const handleCancelEdit = () => {
      setIsEditingDescription(false);
      setEditedDescription('');
  };

  const handleSaveDescription = () => {
    const newDescription = editedDescription.trim();
    setDescription(newDescription);
    setIsEditingDescription(false);
    if (newDescription) {
        handleSubmit(newDescription);
    } else {
         toast({ title: "Input Required", description: "Description cannot be empty.", variant: "destructive" });
         setResult(null);
         stableOnInferenceResult(null);
    }
  };

   // Effect to initialize editedDescription when description changes and result exists
   useEffect(() => {
      if (result && !isEditingDescription) {
         setEditedDescription(description);
      }
   }, [description, result, isEditingDescription]);

  // Handle tab change
  const handleTabChange = (value: string) => {
     const newTab = value as 'text' | 'microphone';
     setActiveTab(newTab);
     // Stop recording if switching away from microphone tab
     if (newTab === 'text' && isRecording) {
         setIsRecording(false);
     }
  };


  return (
    <div className="space-y-4">
      {/* Tabs for Input Mode */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" aria-label="Use Text Input">
             <Text className="mr-2 h-4 w-4" /> Text
          </TabsTrigger>
          <TabsTrigger value="microphone" aria-label="Use Microphone Input">
             <Mic className="mr-2 h-4 w-4" /> Microphone
          </TabsTrigger>
        </TabsList>

        {/* Text Input Content */}
        <TabsContent value="text" className="mt-0">
          <div className="space-y-2 relative group">
            <Label htmlFor="description-text" className="sr-only">Description (Text)</Label>
            <Textarea
              id="description-text"
              placeholder="e.g., 'Renting my apartment', 'Starting a business with a partner', 'Need someone to stop contacting me...'"
              value={isEditingDescription ? editedDescription : description}
              onChange={(e) => isEditingDescription ? setEditedDescription(e.target.value) : setDescription(e.target.value)}
              rows={5}
              className="pr-12 rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring bg-card" // Ensure background matches card
              readOnly={isLoading || (result && !isEditingDescription)}
              disabled={isLoading}
              aria-describedby="text-helper-text"
            />
            {/* Edit/Save/Cancel Buttons for Textarea */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {result && !isLoading && !isEditingDescription && (
                 <Button variant="ghost" size="icon" onClick={handleEditDescription} aria-label="Edit Description" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4" />
                 </Button>
               )}
               {isEditingDescription && (
                   <>
                       <Button variant="ghost" size="icon" onClick={handleSaveDescription} aria-label="Save Description" className="rounded-full w-8 h-8 hover:bg-green-100">
                           <Check className="h-4 w-4 text-green-600" />
                       </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel Edit" className="rounded-full w-8 h-8 hover:bg-red-100">
                           <X className="h-4 w-4 text-red-600" />
                       </Button>
                   </>
               )}
            </div>
             <p id="text-helper-text" className="text-xs text-muted-foreground pl-1">
                 {isEditingDescription ? 'Editing description. Click Save (✓) or Cancel (✕).' : (result ? 'Analysis complete. Click edit (✎) to revise.' : 'Describe your situation clearly.')}
            </p>
          </div>
        </TabsContent>

        {/* Microphone Input Content */}
        <TabsContent value="microphone" className="mt-0">
           <div className="space-y-2 relative group">
            <Label htmlFor="description-mic" className="sr-only">Description (Microphone)</Label>
            {/* Display area for transcribed text */}
            <div
              id="description-mic"
              className="min-h-[120px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-12"
              aria-live="polite"
            >
                 {isEditingDescription ? (
                     <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={5}
                        className="w-full h-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none p-0"
                        aria-label="Edit transcribed text"
                     />
                 ) : (
                     description || <span className="text-muted-foreground italic">Your transcribed text will appear here...</span>
                 )}

            </div>
            {/* Mic Button & Edit/Save/Cancel */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRecordToggle}
                    disabled={isLoading || isEditingDescription}
                    className={`transition-all duration-200 ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300 animate-pulse ring-2 ring-red-300 ring-offset-2' : 'hover:bg-accent'} rounded-full w-8 h-8`}
                    aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                    <Mic className="h-4 w-4" />
                </Button>
                {/* Show edit button only if there's text, not loading/recording, and not currently editing */}
                {description && !isLoading && !isRecording && !isEditingDescription && (
                    <Button variant="ghost" size="icon" onClick={handleEditDescription} aria-label="Edit Description" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Edit2 className="h-4 w-4" />
                    </Button>
                )}
                 {isEditingDescription && (
                     <>
                         <Button variant="ghost" size="icon" onClick={handleSaveDescription} aria-label="Save Description" className="rounded-full w-8 h-8 hover:bg-green-100">
                             <Check className="h-4 w-4 text-green-600" />
                         </Button>
                          <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel Edit" className="rounded-full w-8 h-8 hover:bg-red-100">
                             <X className="h-4 w-4 text-red-600" />
                         </Button>
                     </>
                 )}
            </div>
             <p id="mic-helper-text" className="text-xs text-muted-foreground pl-1">
               {isRecording ? <span className="text-red-600">Listening... Click mic again to stop.</span> : "Click the microphone to start recording."}
               {isEditingDescription && <span> Editing description. Click Save (✓) or Cancel (✕).</span>}
               {description && !isRecording && !isEditingDescription && <span> Click edit (✎) to revise the text.</span>}
            </p>
          </div>
        </TabsContent>
      </Tabs>

       {/* Submit Button - Updated Icon & Text */}
       <Button onClick={() => handleSubmit(description)} disabled={isLoading || isRecording || isEditingDescription || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            {result ? 'Infer Again with Edited Text' : 'Infer My Document'}
          </>
        )}
      </Button>


      {/* Result Card */}
      {result && !isLoading && !isEditingDescription && (
        <Card className="mt-6 bg-secondary rounded-lg shadow-inner border border-border">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center font-medium">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                Suggested Document Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pb-4">
            <p className="text-xl font-semibold text-primary">{result.documentType}</p>
            <p className="text-sm text-muted-foreground">
              Confidence: <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
            </p>
          </CardContent>
           <CardFooter className="pt-0 pb-3">
             <p className="text-xs text-muted-foreground">
                If this isn't right, click the edit icon (<Edit2 className="inline h-3 w-3 mx-0.5" />) above to revise the description and infer again.
             </p>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}


// Assign window properties conditionally for SSR safety
if (typeof window !== 'undefined') {
  window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}
