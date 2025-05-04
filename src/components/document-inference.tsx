
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X, Text, FileText, MapPin } from 'lucide-react'; // Removed HelpCircle, Lightbulb
import { usStates } from '@/lib/document-library';

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
  // ** Removed inferenceOutput and selectedDocument state from here **
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text');
  const { toast } = useToast();
  const isRecordingRef = useRef(isRecording);
  const [recognition, setRecognition] = useState<any | null>(null);
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);
  const isBrowser = typeof window !== 'undefined';

  // --- Speech Recognition Setup Effect ---
  useEffect(() => {
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionApi) {
        try {
            recognitionInstance = new SpeechRecognitionApi();
            recognitionInstance.continuous = true; // Keep listening
            recognitionInstance.interimResults = true; // Show results as they come in

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                 // Update description with final transcript, append space for continuous speech
                 // Append interim results for real-time feedback (optional, can be noisy)
                if (finalTranscript) {
                    setDescription(prev => (prev + finalTranscript).trim() + ' ');
                }
                // You could potentially display interimTranscript elsewhere if needed
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error, event.message);
                 let errorMessage = `Error: ${event.error}. ${event.message || 'Try typing.'}`;
                 if (event.error === 'no-speech') errorMessage = "No speech detected.";
                 else if (event.error === 'audio-capture') errorMessage = "Mic capture failed.";
                 else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMessage = "Mic access denied.";
                 else if (event.error === 'network') errorMessage = "Network error during recognition.";
                 else if (event.error === 'aborted' && !isRecordingRef.current) return; // Ignore intentional stops

                toast({ title: "Speech Error", description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false); // Stop recording state on error
            };

            recognitionInstance.onend = () => {
                 // Only automatically set isRecording to false if it wasn't an intentional stop
                 // If the user clicked stop, isRecordingRef.current would be false already
                 if (isRecordingRef.current) {
                    setIsRecording(false);
                    console.log("Recognition ended unexpectedly, stopping recording state.");
                 } else {
                    console.log("Recognition ended intentionally.");
                 }
            };

            setRecognition(recognitionInstance);

        } catch (e) {
            console.error("Failed to initialize SpeechRecognition:", e);
            setRecognition(null);
        }
    } else {
        console.warn('Speech Recognition API not supported.');
        setRecognition(null);
    }

    // Cleanup function
    return () => {
       if (recognitionInstance && isRecordingRef.current) {
           isRecordingRef.current = false; // Ensure ref is updated before stopping
           try {
                recognitionInstance.stop();
                console.log("Stopping recognition on unmount/cleanup.");
           } catch (e) { console.warn("Error stopping recognition on unmount:", e); }
       }
    };
  }, [isBrowser, toast]); // isRecording removed as dependency, managed by handleRecordToggle

  // --- Start/Stop Recognition Effect (Simplified) ---
   // This effect now only syncs the ref
   useEffect(() => {
       isRecordingRef.current = isRecording;
   }, [isRecording]);


  // --- Handlers ---
  const handleRecordToggle = () => {
    if (!recognition) {
         toast({ title: "Unsupported", description: "Speech recognition unavailable.", variant: "destructive" });
         setActiveTab('text');
         return;
    }

    if (isRecording) {
         // Stop recording
        try {
            recognition.stop();
            console.log("Manually stopping recognition.");
        } catch (e) { console.warn("Error stopping recognition:", e); }
        setIsRecording(false); // Update state *after* stopping
        toast({ title: "Recording Stopped" });
    } else {
        // Start recording
        try {
            recognition.start();
            console.log("Starting recognition.");
             setIsRecording(true); // Update state *after* starting
             toast({ title: "Recording...", description: "Speak clearly." });
        } catch (e: any) {
            console.error("Error starting recognition:", e);
            let errorMsg = `Could not start recording: ${e.message}.`;
            if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorMsg = "Mic access denied.";
            else if (e.name === 'InvalidStateError') {
                // Attempt to recover if already started somehow
                console.warn("Recognition already started? Attempting to stop and restart.");
                try { recognition.stop(); } catch {}
                setTimeout(() => {
                     try {
                        recognition.start();
                        setIsRecording(true);
                         toast({ title: "Recording...", description: "Speak clearly." });
                     } catch (nestedE: any) {
                         toast({ title: "Recording Error", description: `Could not start recording: ${nestedE.message}.`, variant: "destructive" });
                         setIsRecording(false);
                     }
                 }, 100);
                 return; // Exit early
            } else {
                 toast({ title: "Recording Error", description: errorMsg, variant: "destructive" });
                 setIsRecording(false);
            }
        }
    }
  };


  // --- Submit to AI Flow ---
  const handleInferDocument = useCallback(async (currentDescription: string) => {
    const logPrefix = "[handleInferDocument]";
    const trimmedDescription = currentDescription.trim();
    if (!trimmedDescription) {
      toast({ title: "Input Required", description: "Please provide a description.", variant: "destructive" });
      stableOnInferenceResult(null, selectedState); // Notify parent of cleared state
      return;
    }

    setIsLoading(true);
    // ** Removed setInferenceOutput and setSelectedDocument **
    stableOnInferenceResult(null, selectedState); // Clear previous results in parent

    const inputPayload: InferDocumentTypeInput = {
        description: trimmedDescription,
        ...(selectedState && { state: selectedState }),
    };

    console.log(`${logPrefix} Sending payload to API:`, inputPayload);

    // --- TEMPORARY CHANGE FOR STATIC EXPORT ---
    // Simulate response (keep this or use API call based on env)
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

     // ** Call parent callback with the result **
     stableOnInferenceResult(dummyOutput, selectedState);
     setIsLoading(false);
     return; // Exit simulation

    // --- ORIGINAL API CALL CODE (Keep for reference or conditional use) ---
    /*
    try {
      const response = await fetch('/api/infer-document-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputPayload),
      });

      if (!response.ok) {
        let errorData: any = { message: `HTTP error! Status: ${response.status}` };
        try { errorData = await response.json(); } catch { }
        throw new Error(errorData.error || errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const output: InferDocumentTypeOutput = await response.json();
      stableOnInferenceResult(output, selectedState); // Pass raw output to parent

    } catch (error: unknown) {
      console.error(`${logPrefix} Error in handleInferDocument:`, error);
      let errorMessage = 'Failed to infer document type.';
      // ... (keep error handling logic) ...
      toast({ title: "Inference Error", description: errorMessage, variant: "destructive" });
      stableOnInferenceResult(null, selectedState); // Notify parent of error
    } finally {
      setIsLoading(false);
    }
    */
  }, [toast, stableOnInferenceResult, selectedState]);


   const handleEditDescription = () => {
    setEditedDescription(description);
    setIsEditingDescription(true);
    // ** Removed setInferenceOutput and setSelectedDocument **
    stableOnInferenceResult(null, selectedState); // Clear results when starting edit
  };

  const handleCancelEdit = () => {
      setIsEditingDescription(false);
      setEditedDescription('');
      // Re-infer if description wasn't empty before cancel
       if (description) {
          handleInferDocument(description);
       } else {
           stableOnInferenceResult(null, selectedState); // Clear results if description was empty
       }
  };

  const handleSaveDescription = () => {
    const newDescription = editedDescription.trim();
    setDescription(newDescription);
    setIsEditingDescription(false);
    handleInferDocument(newDescription); // Automatically re-submit after saving
  };

   // Effect to initialize editedDescription when description changes (simpler)
   useEffect(() => {
       if (!isEditingDescription) {
         setEditedDescription(description);
       }
   }, [description, isEditingDescription]);

  // Handle tab change
  const handleTabChange = (value: string) => {
     const newTab = value as 'text' | 'microphone';
     setActiveTab(newTab);
     if (newTab === 'text' && isRecording) {
         handleRecordToggle(); // Stop recording if switching to text tab
     }
  };

  // ** Removed handleConfirmSelection - confirmation happens in parent **

  // ** Removed documentOptions preparation - handled in parent **


  return (
    <div className="space-y-6"> {/* Increased spacing */}
      {/* Input Area */}
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
        <TabsContent value="text" className="mt-4">
          <div className="space-y-2 relative group">
            <Label htmlFor="description-text" className="sr-only">Description (Text)</Label>
            <Textarea
              id="description-text"
              placeholder="e.g., 'Renting my apartment', 'Starting a business with a partner', 'Need someone to stop contacting me...'"
              value={isEditingDescription ? editedDescription : description}
              onChange={(e) => isEditingDescription ? setEditedDescription(e.target.value) : setDescription(e.target.value)}
              rows={5}
              className="pr-12 rounded-md shadow-sm border border-input focus-visible:ring-2 focus-visible:ring-ring bg-card"
              readOnly={isLoading || (!isEditingDescription && !!description)} // Lock if loading or if description exists and not editing
              disabled={isLoading}
              aria-describedby="text-helper-text"
            />
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {description && !isLoading && !isEditingDescription && ( // Show edit button if description exists and not editing/loading
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
                 {isEditingDescription ? 'Editing description. Save (✓) or Cancel (✕).' : (description ? 'Click edit (✎) to revise description.' : 'Describe your situation.')}
            </p>
          </div>
        </TabsContent>

        {/* Microphone Input Content */}
        <TabsContent value="microphone" className="mt-4">
           <div className="space-y-2 relative group">
            <Label htmlFor="description-mic" className="sr-only">Description (Microphone)</Label>
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
                        autoFocus
                     />
                 ) : (
                     description || <span className="text-muted-foreground italic">Transcribed text appears here...</span>
                 )}
            </div>
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
                {description && !isLoading && !isRecording && !isEditingDescription && ( // Show edit if description exists, not loading/recording/editing
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
               {isRecording ? <span className="text-red-600">Listening...</span> : (recognition ? "Click mic to start/stop." : "Mic unavailable.")}
               {isEditingDescription && <span> Editing. Save (✓) or Cancel (✕).</span>}
               {description && !isRecording && !isEditingDescription && <span> Click "Analyze My Situation" or edit (✎).</span>}
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
                 const newState = value === 'none' ? undefined : value; // Handle potential 'none' value if added
                 setSelectedState(newState);
                 // Re-infer if description exists, otherwise clear results
                  if (description) {
                      handleInferDocument(description);
                  } else {
                      stableOnInferenceResult(null, newState);
                  }
             }}
             disabled={isLoading || isEditingDescription}
         >
           <SelectTrigger id="state-select" className="w-full rounded-md shadow-sm" aria-label="Select relevant U.S. state">
             <SelectValue placeholder="Select State..." />
           </SelectTrigger>
           <SelectContent>
             {/* Optional: Add a "None" option */}
             {/* <SelectItem value="none">Not Applicable / Unsure</SelectItem> */}
             {usStates.map(state => (
               <SelectItem key={state.value} value={state.value}>
                 {state.label} ({state.value})
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         <p className="text-xs text-muted-foreground pl-1">
              Helps tailor the document suggestions. Select if applicable.
         </p>
       </div>


       {/* Infer Button */}
       <Button onClick={() => handleInferDocument(description)} disabled={isLoading || isRecording || isEditingDescription || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing... </>
        ) : (
          <> <BrainCircuit className="mr-2 h-5 w-5"/> Analyze My Situation </> // Updated text
        )}
      </Button>


      {/* ----- Result Selection Area Removed - Handled by Parent Component ----- */}
    </div>
  );
}


// Assign window properties conditionally for SSR safety
if (typeof window !== 'undefined') {
  window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}
