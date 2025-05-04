
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
// **Removed direct import of inferDocumentType Server Action**
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type'; // Keep type imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X } from 'lucide-react';

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
  const { toast } = useToast();

  // State for browser speech recognition API
  const [recognition, setRecognition] = useState<typeof MockSpeechRecognition | null>(null);

  // ✅ top‐level hooks only
  const isRecordingRef = useRef(isRecording); // Moved useRef to top level

  // Memoize the callback to prevent unnecessary re-renders if passed inline
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);

  // Helper function to safely check for window object
  const isBrowser = typeof window !== 'undefined';


  useEffect(() => {
    // keep ref in sync
    isRecordingRef.current = isRecording;

    // Check for browser support and initialize SpeechRecognition
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionApi) {
        recognitionInstance = new SpeechRecognitionApi();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Append final transcript only to avoid duplicate text on finalization
            if (finalTranscript) {
                 setDescription(prev => (prev + finalTranscript).trim() + ' '); // Add space after appending
            }
            // Optionally update description with interim results for real-time feedback
            // setEditedDescription(description + interimTranscript); // If editing while recording
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error, event.message);
             let errorMessage = `Error: ${event.error}. ${event.message || 'Please try again or type your description.'}`;
             if (event.error === 'no-speech') {
                 errorMessage = "No speech detected. Please ensure your microphone is working and speak clearly.";
             } else if (event.error === 'audio-capture') {
                 errorMessage = "Audio capture failed. Please check microphone permissions and hardware.";
             } else if (event.error === 'not-allowed') {
                 errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
             }
            toast({
                title: "Speech Recognition Error",
                description: errorMessage,
                variant: "destructive",
            });
            setIsRecording(false); // Ensure recording state is stopped on error
        };

         recognitionInstance.onend = () => {
            // Automatically stop the recording state when the service disconnects
            // This can happen due to silence or network issues
            if (isRecordingRef.current) { // Use ref to check current recording status
                 setIsRecording(false);
                 console.log("Speech recognition service disconnected.");
            }
        };


        // Assign properties directly to the instance
         const mockCompatibleInstance = {
             ...MockSpeechRecognition, // Start with mock structure
             start: recognitionInstance.start.bind(recognitionInstance),
             stop: recognitionInstance.stop.bind(recognitionInstance),
             abort: recognitionInstance.abort.bind(recognitionInstance),
             onresult: recognitionInstance.onresult,
             onerror: recognitionInstance.onerror,
             onend: recognitionInstance.onend, // Add onend handler
             // We don't need to explicitly set continuous/interimResults here as they are set on the instance above
         };


        setRecognition(mockCompatibleInstance);

        // Start recognition if isRecording is true when the component mounts or recognition initializes
        if (isRecording) {
            try {
                recognitionInstance.start();
                console.log("Starting recognition on mount/init...");
            } catch (e: any) {
                console.error("Error starting recognition on mount/init:", e);
                // Handle potential errors like permissions already denied
                setIsRecording(false); // Correct state if start fails
            }
        }

    } else {
        console.warn('Speech Recognition API not supported in this browser.');
    }


    // Cleanup function to stop recognition if component unmounts while recording
    return () => {
       if (recognitionInstance && isRecordingRef.current) {
           try {
              recognitionInstance.stop();
              console.log("Stopped speech recognition on component unmount.");
           } catch (e) {
               console.warn("Could not stop speech recognition on unmount:", e);
               try {
                  recognitionInstance.abort();
                  console.log("Aborted speech recognition on unmount.");
                } catch (abortError) {
                     console.warn("Could not abort speech recognition on unmount:", abortError);
                }
           }
       }
    };

  // Only depend on toast, isBrowser and isRecording.
  // Recognition instance setup happens only once based on browser support.
  }, [toast, isBrowser, isRecording]); // Added isRecording to dependency array


  const handleRecord = () => {
    if (!recognition) {
         toast({
            title: "Unsupported Feature",
            description: "Speech recognition is not supported in your browser. Please type your description.",
            variant: "destructive",
        });
      return;
    }

    if (isRecording) {
       try {
           recognition.stop(); // This should trigger the onend event handler which sets isRecording to false
           console.log("Stopping recognition...");
           // No need to set state here, onend handler will do it
       } catch (e) {
            console.warn("Error stopping recognition:", e);
            // Force stop state if stop fails unexpectedly
            setIsRecording(false);
       }

    } else {
       // Consider clearing description or appending based on desired UX
       // setDescription(''); // Uncomment to clear previous description
       try {
            // The useEffect hook will now handle starting recognition when isRecording becomes true
            setIsRecording(true); // Set recording state to true
            toast({
                title: "Recording Started",
                description: "Speak clearly into your microphone. Click the mic again to stop.", // Updated description
            });
       } catch (e: any) {
            // This catch block might be less necessary now as useEffect handles start
            console.error("Error in handleRecord when setting isRecording:", e);
             let errorMsg = `Error: ${e.message || 'Unknown error setting recording state'}.`;
             toast({
                title: "Could Not Start Recording",
                description: errorMsg,
                variant: "destructive",
            });
             // Ensure state is correct if setting state fails somehow (unlikely)
             if (isRecording) setIsRecording(false);
       }

    }
  };

  const handleSubmit = useCallback(async (currentDescription: string) => {
    if (!currentDescription.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide a description of your situation.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null); // Clear previous results
    stableOnInferenceResult(null); // Notify parent that result is cleared

    try {
      console.log("[handleSubmit] Calling API /api/infer-document-type with description:", currentDescription);
      const input: InferDocumentTypeInput = { description: currentDescription };

      // **Use fetch to call the API route**
      const response = await fetch('/api/infer-document-type', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
      });

      const responseData = await response.json();

      if (!response.ok) {
          // Handle API errors (e.g., 4xx, 5xx)
          console.error("[handleSubmit Error] API responded with error:", response.status, responseData);
          // Use the error message from the API response if available
          const errorMessage = responseData.error || `API Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
      }

      // **Assuming responseData is of type InferDocumentTypeOutput on success**
      const output: InferDocumentTypeOutput = responseData;
      console.log("[handleSubmit] API call successful. Output:", output);
      setResult(output);
      stableOnInferenceResult(output); // Pass result to parent
      // Add a success toast
      toast({
        title: "Analysis Complete",
        description: `Suggested document type: ${output.documentType}`,
      });
    } catch (error: unknown) {
      // Log the full error object for better debugging
      console.error('[handleSubmit Error] Error during API call or processing:', error);

      // Create a user-friendly error message
      let errorMessage = "Could not process your request due to an unexpected error. Please try again later.";
       if (error instanceof Error) {
           // Use the message from the caught error (could be from fetch failure or API error response)
           errorMessage = error.message;
       } else {
            // Handle cases where the thrown object is not an Error instance
            errorMessage = `An unexpected error occurred: ${String(error)}`;
       }

      toast({
        title: "AI Inference Error",
        description: errorMessage,
        variant: "destructive",
      });
       stableOnInferenceResult(null); // Notify parent about the error (by passing null)
    } finally {
      setIsLoading(false);
    }
  }, [toast, stableOnInferenceResult]); // Add stableOnInferenceResult to dependency array


   const handleEditDescription = () => {
    setEditedDescription(description); // Load current description into editor
    setIsEditingDescription(true);
  };

  const handleCancelEdit = () => {
      setIsEditingDescription(false);
      setEditedDescription(''); // Clear edited description
  };


  const handleSaveDescription = () => {
    const newDescription = editedDescription.trim();
    setDescription(newDescription);
    setIsEditingDescription(false);
    // Re-submit with the updated description
    if (newDescription) { // Only submit if not empty after trimming
        handleSubmit(newDescription);
    } else {
         toast({
            title: "Input Required",
            description: "Description cannot be empty after editing.",
            variant: "destructive",
        });
         // Optionally clear results if description becomes empty
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


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <Textarea
            id="description"
            placeholder="e.g., 'I need to rent out my apartment', 'Starting a small business with a partner', 'Someone owes me money...'"
            value={isEditingDescription ? editedDescription : description}
            onChange={(e) => isEditingDescription ? setEditedDescription(e.target.value) : setDescription(e.target.value)}
            rows={5}
            className="pr-20 rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring" // Added focus styles
            readOnly={isLoading || isRecording || !isEditingDescription && !!result} // Prevent editing while loading/recording or if result exists and not editing
            disabled={isLoading || isRecording} // Disable textarea itself during loading/recording
            aria-describedby="description-helper-text"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-1.5">
             <Button
                variant="outline"
                size="icon"
                onClick={handleRecord}
                disabled={isLoading || isEditingDescription || (!!result && !isEditingDescription)} // Disable record when editing text or result exists and not editing
                className={`transition-colors duration-200 ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300' : 'hover:bg-accent'} rounded-full w-8 h-8`} // Smaller, rounded button
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>
             {/* Show edit button only if there's a result, not loading, and not currently editing */}
             {result && !isLoading && !isEditingDescription && (
               <Button variant="ghost" size="icon" onClick={handleEditDescription} aria-label="Edit Description" className="rounded-full w-8 h-8">
                  <Edit2 className="h-4 w-4" />
               </Button>
             )}
             {/* Show save/cancel only when editing */}
             {isEditingDescription && (
                 <div className="flex flex-col space-y-1.5">
                     <Button variant="ghost" size="icon" onClick={handleSaveDescription} aria-label="Save Description" className="rounded-full w-8 h-8 hover:bg-green-100">
                         <Check className="h-4 w-4 text-green-600" />
                     </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="Cancel Edit" className="rounded-full w-8 h-8 hover:bg-red-100">
                         <X className="h-4 w-4 text-red-600" />
                     </Button>
                 </div>
             )}
          </div>
        </div>
         <p id="description-helper-text" className="text-xs text-muted-foreground">
             {isRecording ? <span className="animate-pulse">Listening... Click mic again to stop.</span> : "You can type or use the microphone."}
              {isEditingDescription && <span> Editing description. Click Save (✓) or Cancel (✕).</span>}
               {result && !isEditingDescription && <span> Analysis complete. Click <Edit2 className="inline h-3 w-3 mx-0.5" /> to edit description and re-analyze.</span>}
         </p>
      </div>

       {/* Disable analyze button if editing description, recording, or result already exists and not editing */}
       <Button onClick={() => handleSubmit(description)} disabled={isLoading || isRecording || isEditingDescription || (!!result && !isEditingDescription)} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-4 w-4" />
            {result ? 'Analyze Again' : 'Infer Document Type'}
          </>
        )}
      </Button>


      {/* Only show result card when not loading AND not editing the description */}
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
               If this isn't right, click the <Edit2 className="inline h-3 w-3 mx-0.5" /> icon above to edit the description and analyze again.
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
