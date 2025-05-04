
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X, Text, FileText, MapPin, Lightbulb } from 'lucide-react'; // Added FileText, MapPin, Lightbulb icons
import { usStates } from '@/lib/document-library'; // Import state list

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
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined); // State for US State selection
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InferDocumentTypeOutput | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text'); // State for tabs
  const { toast } = useToast();
  const isRecordingRef = useRef(isRecording); // Top-level ref

  // State for browser speech recognition API
  const [recognition, setRecognition] = useState<any | null>(null); // Use 'any' for broader compatibility initially

  // Memoize the callback to prevent unnecessary re-renders if passed inline
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);

  // Helper function to safely check for window object
  const isBrowser = typeof window !== 'undefined';


  useEffect(() => {
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionApi) {
        try {
            recognitionInstance = new SpeechRecognitionApi();
            recognitionInstance.continuous = true; // Keep listening
            recognitionInstance.interimResults = true; // Get results while speaking

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                     if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                         interimTranscript += event.results[i][0].transcript; // Capture interim
                    }
                }
                 // Update description optimistically with interim, then finalize
                 // For simplicity, only update with final results for now
                 if (finalTranscript) {
                     setDescription(prev => (prev + finalTranscript).trim() + ' ');
                 }
                 // Optionally update with interimTranscript for real-time feedback, but handle carefully
                 // e.g., setInterimDescription(interimTranscript);
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error, event.message);
                let errorMessage = `Error: ${event.error}. ${event.message || 'Please try again or type your description.'}`;
                 if (event.error === 'no-speech') {
                     errorMessage = "No speech detected. Ensure mic is working and speak clearly.";
                 } else if (event.error === 'audio-capture') {
                     errorMessage = "Audio capture failed. Check mic permissions & hardware.";
                 } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                     errorMessage = "Microphone access denied. Allow microphone access in browser settings.";
                 } else if (event.error === 'network'){
                      errorMessage = "Network error during speech recognition. Check connection.";
                 } else if (event.error === 'aborted') {
                      // Check ref to see if abort was expected (user stopped)
                      if (isRecordingRef.current) {
                          errorMessage = "Speech recognition stopped."; // Less alarming message
                      } else {
                         // Abort might have been triggered by switching tabs or other non-error scenarios
                         console.log("Speech recognition aborted (likely intentional or component unmount).");
                         setIsRecording(false); // Ensure state consistency
                         return; // Don't show error toast for intentional stops
                      }
                 }
                toast({ title: "Speech Error", description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false); // Stop recording state on error only if it was active
            };

            recognitionInstance.onend = () => {
                console.log("Speech recognition ended.");
                // Only update state if it was supposed to be recording (use ref)
                if (isRecordingRef.current) {
                    setIsRecording(false); // Ensure state reflects reality if service stops unexpectedly
                    // Toast handled by toggle button now
                    // toast({ title: "Recording Stopped" }); // Inform user
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

    // Cleanup: Stop recognition if active when component unmounts
    return () => {
       if (recognitionInstance) {
            // Check the recording state *ref* because state might be stale in cleanup
            if (isRecordingRef.current) {
                try {
                    recognitionInstance.stop();
                    console.log("Stopped speech recognition on component unmount (was recording).");
                } catch (e) {
                    console.warn("Error stopping speech recognition on unmount:", e);
                    try { recognitionInstance.abort(); console.log("Aborted speech recognition on unmount."); }
                    catch (abortError) { console.warn("Could not abort speech recognition on unmount:", abortError); }
                }
            } else {
                 // console.log("Speech recognition cleanup on unmount (was not recording).");
            }
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrowser, toast]); // isRecordingRef should not be a dependency


  // Effect to start/stop recognition when isRecording state changes
   useEffect(() => {
       // Update the ref whenever isRecording changes
       isRecordingRef.current = isRecording;

       if (recognition) {
           if (isRecording) {
               try {
                   recognition.start();
                   console.log("Speech recognition started via state change.");
               } catch (e: any) {
                   console.error("Error starting recognition:", e);
                    let errorMsg = `Could not start recording: ${e.message}. Ensure permissions are granted.`;
                    if (e.name === 'NotAllowedError' || e.name === 'SecurityError') { // Added SecurityError
                        errorMsg = "Microphone access denied. Please allow access in your browser settings.";
                    } else if (e.name === 'InvalidStateError'){
                        console.warn("Recognition already started or in invalid state. Ignoring redundant start().");
                        return; // Avoid setting isRecording back to false
                    }
                   toast({ title: "Recording Error", description: errorMsg, variant: "destructive" });
                   setIsRecording(false); // Correct state if start fails
               }
           } else {
               try {
                   // Check if already stopped to avoid redundant calls/errors
                   // Note: Checking recognition.readyState might be browser-specific
                   recognition.stop();
                   console.log("Speech recognition stopped by state change.");
                   toast({ title: "Recording Stopped", description: "Processing transcribed text..." });
               } catch(e) {
                    console.warn("Error stopping recognition (might already be stopped):", e);
               }
           }
       }
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isRecording, recognition, toast]); // Depend on isRecording and recognition instance


  const handleRecordToggle = () => {
    if (!recognition) {
         toast({
            title: "Unsupported Feature",
            description: "Speech recognition is not available in your browser. Please use the text input.",
            variant: "destructive",
        });
        setActiveTab('text'); // Switch back to text tab
      return;
    }

    // Toggle recording state - the useEffect handles start/stop
    const nextRecordingState = !isRecording;
    setIsRecording(nextRecordingState);

    if (nextRecordingState) {
         toast({
            title: "Recording...",
            description: "Speak clearly. Click the mic again to stop.",
        });
    } else {
         // Toast for stopping is handled in recognition.onend or effect
    }
  };

  const handleSubmit = useCallback(async (currentDescription: string) => {
    const trimmedDescription = currentDescription.trim();
    if (!trimmedDescription) {
      toast({ title: "Input Required", description: "Please provide a description.", variant: "destructive" });
      return;
    }
    // Optional: Add validation for state selection if required later
    // if (!selectedState) {
    //    toast({ title: "State Required", description: "Please select the relevant U.S. state.", variant: "destructive" });
    //    return;
    // }

    setIsLoading(true);
    setResult(null);
    stableOnInferenceResult(null);

    const inputPayload: InferDocumentTypeInput = {
        description: trimmedDescription,
        ...(selectedState && { state: selectedState }), // Include state if selected
    };

    console.log("[handleSubmit] Sending payload to API:", inputPayload);

    // --- TEMPORARY CHANGE FOR STATIC EXPORT ---
    console.log("[handleSubmit] AI Inference Temporarily Disabled for Static Export.");
    await new Promise(resolve => setTimeout(resolve, 700)); // Slightly longer delay
    // Simulate response based on description/state
    let dummyDocType = "Lease Agreement (Dummy)";
    let dummyConfidence = 0.75;
    let dummyReasoning = "Based on keywords like 'renting'.";
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
     }

     if (selectedState === 'CA') {
         dummyReasoning += ` State CA might have specific clauses.`;
     } else if (selectedState) {
         dummyReasoning += ` Considering state ${selectedState}.`;
     }

    const dummyOutput: InferDocumentTypeOutput = {
      documentType: dummyDocType,
      confidence: dummyConfidence,
      reasoning: dummyReasoning,
      alternatives: dummyAlternatives,
    };
    setResult(dummyOutput);
    stableOnInferenceResult(dummyOutput);
    toast({ title: "Analysis Complete (Dummy)", description: `Suggested: ${dummyOutput.documentType}. Confidence: ${(dummyOutput.confidence * 100).toFixed(0)}%. Proceed to Step 2.` });
    setIsLoading(false);
    return; // Exit before attempting the fetch call

    // --- ORIGINAL CODE (Requires a backend/API route) ---
    /*
    try {
      console.log(`${logPrefix} Calling fetch to /api/infer-document-type...`);
      const response = await fetch('/api/infer-document-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputPayload),
      });
      console.log(`${logPrefix} Fetch response status: ${response.status}`);

      if (!response.ok) {
        let errorData: any = { message: `HTTP error! Status: ${response.status}` };
        try {
          errorData = await response.json(); // Try to parse JSON error response
        } catch (parseError) {
          console.warn(`${logPrefix} Could not parse error response as JSON.`);
        }
        console.error(`${logPrefix} API error response:`, errorData);
        throw new Error(errorData.error || errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const output: InferDocumentTypeOutput = await response.json();
      console.log(`${logPrefix} Parsed API response:`, output);
      setResult(output);
      stableOnInferenceResult(output); // Pass result to parent
      toast({
          title: "Analysis Complete",
          description: `Suggested: ${output.documentType}. Confidence: ${(output.confidence * 100).toFixed(0)}%. ${output.reasoning || ''} Proceed to Step 2.`,
      });

    } catch (error: unknown) {
      console.error(`${logPrefix} Error in handleSubmit:`, error);
      let errorMessage = 'Failed to infer document type.';
      if (error instanceof Error) {
         // Provide more specific feedback based on common errors
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
             errorMessage = 'Network error. Could not reach the AI service. Please check your connection.';
          } else if (error.message.includes('API route is disabled')) {
              errorMessage = 'AI service is temporarily unavailable (static export mode).';
          } else if (error.message.includes('Invalid input')) {
              errorMessage = `There was an issue with the data sent: ${error.message}`;
          } else {
               errorMessage = error.message;
          }
      }
      toast({ title: "Inference Error", description: errorMessage, variant: "destructive" });
      setResult(null);
      stableOnInferenceResult(null); // Notify parent of failure
    } finally {
      setIsLoading(false);
    }
    */

  }, [toast, stableOnInferenceResult, selectedState]);


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
        // Automatically re-submit after saving edited text
        handleSubmit(newDescription);
    } else {
         // If saved text is empty, clear results
         toast({ title: "Input Cleared", description: "Description removed.", variant: "destructive" });
         setResult(null);
         stableOnInferenceResult(null);
    }
  };

   // Effect to initialize editedDescription when description changes and result exists
   // and we are *not* currently in editing mode.
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
         setIsRecording(false); // This will trigger the useEffect to stop recognition
     }
  };


  return (
    <div className="space-y-4">
       {/* Removed CardHeader/CardContent wrapper, now part of the parent card */}
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
        <TabsContent value="text" className="mt-4"> {/* Added mt-4 for spacing */}
          <div className="space-y-2 relative group">
            <Label htmlFor="description-text" className="sr-only">Description (Text)</Label>
            <Textarea
              id="description-text"
              placeholder="e.g., 'Renting my apartment', 'Starting a business with a partner', 'Need someone to stop contacting me...'"
              value={isEditingDescription ? editedDescription : description}
              onChange={(e) => isEditingDescription ? setEditedDescription(e.target.value) : setDescription(e.target.value)}
              rows={5}
              className="pr-12 rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring bg-card" // Ensure background matches card
              readOnly={isLoading || (result && !isEditingDescription)} // Readonly if loading OR if result exists and not editing
              disabled={isLoading}
              aria-describedby="text-helper-text"
            />
            {/* Edit/Save/Cancel Buttons for Textarea */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {/* Show Edit button only if result exists, not loading, and not editing */}
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
                 {isEditingDescription ? 'Editing description. Click Save (✓) or Cancel (✕).' : (result ? 'Analysis complete. Click edit (✎) to revise, or proceed to Step 2.' : 'Describe your situation clearly.')}
            </p>
          </div>
        </TabsContent>

        {/* Microphone Input Content */}
        <TabsContent value="microphone" className="mt-4"> {/* Added mt-4 for spacing */}
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
                        autoFocus // Focus when editing starts
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
                    disabled={isLoading || isEditingDescription} // Disable mic while loading or editing text
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
               {isRecording ? <span className="text-red-600">Listening... Click mic again to stop.</span> : (recognition ? "Click the microphone to start recording." : "Microphone input not available.")}
               {isEditingDescription && <span> Editing description. Click Save (✓) or Cancel (✕).</span>}
               {description && !isRecording && !isEditingDescription && result && <span> Click edit (✎) to revise, or proceed to Step 2.</span>}
               {description && !isRecording && !isEditingDescription && !result && <span> Click "Infer My Document" below.</span>}
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
             onValueChange={setSelectedState}
             disabled={isLoading || isEditingDescription}
         >
           <SelectTrigger id="state-select" className="w-full rounded-md shadow-sm" aria-label="Select relevant U.S. state">
             <SelectValue placeholder="Select State..." />
           </SelectTrigger>
           <SelectContent>
             {usStates.map(state => (
               <SelectItem key={state.value} value={state.value}>
                 {state.label} ({state.value})
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         <p className="text-xs text-muted-foreground pl-1">
              Select the state where the legal matter primarily takes place. This helps tailor the document.
         </p>
       </div>


       {/* Submit Button - Updated Icon & Text */}
       <Button onClick={() => handleSubmit(description)} disabled={isLoading || isRecording || isEditingDescription || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-5 w-5"/> {/* Changed icon */}
            {result ? 'Infer Again with Edited Text' : 'Infer My Document'}
          </>
        )}
      </Button>


      {/* Result Card - Enhanced */}
      {result && !isLoading && !isEditingDescription && (
        <Card className="mt-6 bg-secondary/70 rounded-lg shadow-inner border border-border">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center font-medium">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                Suggested Document Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            <p className="text-xl font-semibold text-primary">{result.documentType}</p>
            <p className="text-sm text-muted-foreground">
              Confidence: <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
            </p>
             {/* Display Reasoning */}
             {result.reasoning && (
                 <p className="text-xs text-muted-foreground italic border-l-2 border-primary/50 pl-2">
                      {result.reasoning}
                 </p>
             )}
             {/* Display Alternatives */}
            {result.alternatives && result.alternatives.length > 0 && (
                <div className="pt-2">
                     <p className="text-sm font-medium text-foreground flex items-center">
                         <Lightbulb className="mr-2 h-4 w-4 text-yellow-500"/>
                         Also consider:
                     </p>
                    <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground">
                        {result.alternatives.map((alt, index) => (
                            <li key={index}>{alt}</li>
                        ))}
                    </ul>
                </div>
            )}
          </CardContent>
           <CardFooter className="pt-0 pb-3">
             <p className="text-xs text-muted-foreground">
                If this isn't right, click the edit icon (<Edit2 className="inline h-3 w-3 mx-0.5" />) above to revise the description and infer again. Otherwise, proceed to Step 2.
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
