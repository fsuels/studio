
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X, Text, FileText, MapPin, Lightbulb, HelpCircle } from 'lucide-react'; // Added HelpCircle
import { usStates } from '@/lib/document-library';

// Define props for the component, including the callback
interface DocumentInferenceProps {
    // Callback now returns the *selected* document name (string) and the state (string | undefined)
    onInferenceResult: (selectedDocumentName: string | null, state?: string) => void;
}

export function DocumentInference({ onInferenceResult }: DocumentInferenceProps) {
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inferenceOutput, setInferenceOutput] = useState<InferDocumentTypeOutput | null>(null); // Store the full AI output
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null); // Store user's choice
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text');
  const { toast } = useToast();

  // Use top-level ref
  const isRecordingRef = useRef(isRecording);

  // State for browser speech recognition API
  const [recognition, setRecognition] = useState<any | null>(null);

  // Memoize the callback to prevent unnecessary re-renders
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);

  // Helper function to safely check for window object
  const isBrowser = typeof window !== 'undefined';

  // --- Speech Recognition Setup Effect ---
  useEffect(() => {
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    let recognitionInstance: SpeechRecognition | null = null;

    if (SpeechRecognitionApi) {
        try {
            recognitionInstance = new SpeechRecognitionApi();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

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
                 let errorMessage = `Error: ${event.error}. ${event.message || 'Try typing.'}`;
                 if (event.error === 'no-speech') errorMessage = "No speech detected.";
                 else if (event.error === 'audio-capture') errorMessage = "Mic capture failed.";
                 else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMessage = "Mic access denied.";
                 else if (event.error === 'network') errorMessage = "Network error during recognition.";
                 else if (event.error === 'aborted' && !isRecordingRef.current) return; // Ignore intentional stops

                toast({ title: "Speech Error", description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false);
            };

            recognitionInstance.onend = () => {
                if (isRecordingRef.current) setIsRecording(false);
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

    return () => {
       if (recognitionInstance && isRecordingRef.current) {
           try { recognitionInstance.stop(); } catch (e) { console.warn("Error stopping recognition on unmount:", e); }
       }
    };
  }, [isBrowser, toast]);

  // --- Start/Stop Recognition Effect ---
  useEffect(() => {
    isRecordingRef.current = isRecording;
    if (recognition) {
      if (isRecording) {
        try {
          recognition.start();
        } catch (e: any) {
          console.error("Error starting recognition:", e);
          let errorMsg = `Could not start recording: ${e.message}.`;
          if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorMsg = "Mic access denied.";
          else if (e.name === 'InvalidStateError') return;
          toast({ title: "Recording Error", description: errorMsg, variant: "destructive" });
          setIsRecording(false);
        }
      } else {
        try { recognition.stop(); } catch (e) { console.warn("Error stopping recognition:", e); }
      }
    }
  }, [isRecording, recognition, toast]);

  // --- Handlers ---
  const handleRecordToggle = () => {
    if (!recognition) {
         toast({ title: "Unsupported", description: "Speech recognition unavailable.", variant: "destructive" });
         setActiveTab('text');
         return;
    }
    setIsRecording(prev => !prev);
    if (!isRecording) toast({ title: "Recording...", description: "Speak clearly." });
    else toast({ title: "Recording Stopped" });
  };

  // --- Submit to AI Flow ---
  const handleInferDocument = useCallback(async (currentDescription: string) => {
    const logPrefix = "[handleInferDocument]";
    const trimmedDescription = currentDescription.trim();
    if (!trimmedDescription) {
      toast({ title: "Input Required", description: "Please provide a description.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setInferenceOutput(null); // Clear previous results
    setSelectedDocument(null); // Clear previous selection
    stableOnInferenceResult(null, selectedState); // Notify parent

    const inputPayload: InferDocumentTypeInput = {
        description: trimmedDescription,
        ...(selectedState && { state: selectedState }),
    };

    console.log(`${logPrefix} Sending payload to API:`, inputPayload);

    // --- TEMPORARY CHANGE FOR STATIC EXPORT ---
     console.log(`${logPrefix} AI Inference API Call Disabled for Static Export. Simulating...`);
     await new Promise(resolve => setTimeout(resolve, 700));
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
      } else if (trimmedDescription.length < 15) { // Example for low confidence
          dummyDocType = "General Inquiry";
          dummyConfidence = 0.3;
          dummyReasoning = "Description is very short. Unclear specific need.";
          dummyAlternatives = ["Service Agreement", "Residential Lease Agreement"];
      }

      if (selectedState === 'CA') dummyReasoning += ` State CA may have specific clauses.`;
      else if (selectedState) dummyReasoning += ` Considering state ${selectedState}.`;

     const dummyOutput: InferDocumentTypeOutput = {
       documentType: dummyDocType,
       confidence: dummyConfidence,
       reasoning: dummyReasoning,
       alternatives: dummyAlternatives?.filter(alt => alt !== dummyDocType), // Filter out primary if it's also an alternative
     };

     setInferenceOutput(dummyOutput);
     // Automatically select the highest confidence option initially
     setSelectedDocument(dummyOutput.documentType);
     // Notify parent immediately with the *initial best guess*
     // stableOnInferenceResult(dummyOutput.documentType, selectedState);
     toast({ title: "Analysis Complete (Dummy)", description: `Suggestions loaded below. Review and confirm.` });
     setIsLoading(false);
     return; // Exit before attempting the fetch call

    // --- ORIGINAL API CALL CODE ---
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
        try { errorData = await response.json(); } catch { }
        console.error(`${logPrefix} API error response:`, errorData);
        throw new Error(errorData.error || errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const output: InferDocumentTypeOutput = await response.json();
      console.log(`${logPrefix} Parsed API response:`, output);

      setInferenceOutput(output);
      // Automatically select the highest confidence option initially
      setSelectedDocument(output.documentType);
      // Notify parent immediately with the initial best guess
      // stableOnInferenceResult(output.documentType, selectedState);

      toast({
          title: "Analysis Complete",
          description: `AI suggestions loaded below. Please review and confirm your choice.`,
      });

    } catch (error: unknown) {
      console.error(`${logPrefix} Error in handleInferDocument:`, error);
      let errorMessage = 'Failed to infer document type.';
      if (error instanceof Error) {
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) errorMessage = 'Network error. Could not reach AI service.';
          else if (error.message.includes('API route is disabled')) errorMessage = 'AI service unavailable (static export mode).';
          else if (error.message.includes('Invalid input')) errorMessage = `Data issue: ${error.message}`;
          else errorMessage = error.message.replace(`${logPrefix} Error: `, ''); // Clean up prefix if added by flow
      }
      toast({ title: "Inference Error", description: errorMessage, variant: "destructive" });
      setInferenceOutput(null);
      setSelectedDocument(null);
      stableOnInferenceResult(null, selectedState);
    } finally {
      setIsLoading(false);
    }
    */
  }, [toast, stableOnInferenceResult, selectedState]);


   const handleEditDescription = () => {
    setEditedDescription(description);
    setIsEditingDescription(true);
    setInferenceOutput(null); // Clear results when starting edit
    setSelectedDocument(null);
    stableOnInferenceResult(null, selectedState);
  };

  const handleCancelEdit = () => {
      setIsEditingDescription(false);
      setEditedDescription('');
      // Optionally re-infer if description wasn't empty before cancel?
      // if (description) handleInferDocument(description);
  };

  const handleSaveDescription = () => {
    const newDescription = editedDescription.trim();
    setDescription(newDescription);
    setIsEditingDescription(false);
    if (newDescription) {
        handleInferDocument(newDescription); // Automatically re-submit after saving
    } else {
         toast({ title: "Input Cleared", description: "Description removed.", variant: "destructive" });
         setInferenceOutput(null);
         setSelectedDocument(null);
         stableOnInferenceResult(null, selectedState);
    }
  };

   // Effect to initialize editedDescription when description changes and result exists, not editing
   useEffect(() => {
      if (inferenceOutput && !isEditingDescription) {
         setEditedDescription(description);
      }
   }, [description, inferenceOutput, isEditingDescription]);

  // Handle tab change
  const handleTabChange = (value: string) => {
     const newTab = value as 'text' | 'microphone';
     setActiveTab(newTab);
     if (newTab === 'text' && isRecording) setIsRecording(false);
  };

  // Handle final confirmation of selected document type
   const handleConfirmSelection = () => {
        if (!selectedDocument) {
             toast({ title: "Selection Required", description: "Please select a document type.", variant: "destructive" });
             return;
        }
        console.log(`[handleConfirmSelection] User confirmed: ${selectedDocument}, State: ${selectedState}`);
        stableOnInferenceResult(selectedDocument, selectedState); // Send final selection to parent
        toast({ title: "Document Type Confirmed", description: `Proceeding with ${selectedDocument}.` });
        // Optionally, disable further changes after confirmation
        // setIsLoading(true); // Or use a different state like `isConfirmed`
   }


  // --- Prepare options for Radio Group ---
  const documentOptions: { value: string; label: string; confidence?: number }[] = [];
  if (inferenceOutput) {
      // Add primary suggestion
      documentOptions.push({
          value: inferenceOutput.documentType,
          label: inferenceOutput.documentType,
          confidence: inferenceOutput.confidence
      });
      // Add alternatives, ensuring no duplicates with primary
      inferenceOutput.alternatives?.forEach(alt => {
          if (alt !== inferenceOutput.documentType) {
              documentOptions.push({ value: alt, label: alt }); // Confidence not provided for alternatives
          }
      });
      // Optionally add "General Inquiry" if it wasn't the primary suggestion
      if (inferenceOutput.documentType !== 'General Inquiry' && !documentOptions.some(opt => opt.value === 'General Inquiry')) {
            documentOptions.push({ value: 'General Inquiry', label: 'None of these / Unsure' });
      }
  }


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
              readOnly={isLoading || (inferenceOutput && !isEditingDescription)}
              disabled={isLoading}
              aria-describedby="text-helper-text"
            />
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {inferenceOutput && !isLoading && !isEditingDescription && (
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
                 {isEditingDescription ? 'Editing description. Save (✓) or Cancel (✕).' : (inferenceOutput ? 'Click edit (✎) to revise description.' : 'Describe your situation.')}
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
               {isRecording ? <span className="text-red-600">Listening...</span> : (recognition ? "Click mic to start." : "Mic unavailable.")}
               {isEditingDescription && <span> Editing. Save (✓) or Cancel (✕).</span>}
               {description && !isRecording && !isEditingDescription && !inferenceOutput && <span> Click "Infer My Document" below.</span>}
               {description && !isRecording && !isEditingDescription && inferenceOutput && <span> Click edit (✎) to revise.</span>}
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
                 setSelectedState(value);
                 // Clear previous results if state changes
                 setInferenceOutput(null);
                 setSelectedDocument(null);
                 stableOnInferenceResult(null, value); // Notify parent immediately about state change
             }}
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
              Helps tailor the document. Select if applicable.
         </p>
       </div>


       {/* Infer Button */}
       <Button onClick={() => handleInferDocument(description)} disabled={isLoading || isRecording || isEditingDescription || !description.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {isLoading ? (
          <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing... </>
        ) : (
          <> <BrainCircuit className="mr-2 h-5 w-5"/> Infer My Document </>
        )}
      </Button>


      {/* ----- Result Selection Area ----- */}
      {inferenceOutput && !isLoading && !isEditingDescription && (
        <Card className="mt-6 bg-secondary/70 rounded-lg shadow-inner border border-border">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-lg flex items-center font-medium">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                Select Document Type
            </CardTitle>
             <CardDescription className="text-sm">
                Based on your description, we suggest the following. Please review and select the best fit.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-4">
              {/* Display Reasoning */}
             {inferenceOutput.reasoning && (
                 <p className="text-xs text-muted-foreground italic border-l-2 border-primary/50 pl-2 py-1 bg-background/30 rounded-r-md">
                      <strong>AI Reasoning:</strong> {inferenceOutput.reasoning}
                 </p>
             )}

             {/* Radio Group for Selection */}
             <RadioGroup
                 value={selectedDocument ?? ''}
                 onValueChange={setSelectedDocument}
                 className="space-y-2"
             >
                {documentOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 rounded-md border border-transparent hover:border-primary/50 hover:bg-background/50 p-3 transition-colors">
                       <RadioGroupItem value={option.value} id={option.value} />
                       <Label htmlFor={option.value} className="font-medium flex-grow cursor-pointer">
                           {option.label}
                           {option.confidence !== undefined && (
                               <span className={`ml-2 text-xs font-normal px-1.5 py-0.5 rounded ${
                                   option.confidence > 0.7 ? 'bg-green-100 text-green-800' :
                                   option.confidence > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800'
                               }`}>
                                   Confidence: {(option.confidence * 100).toFixed(0)}%
                               </span>
                           )}
                           {option.value === 'General Inquiry' && <HelpCircle className="inline-block ml-1 h-4 w-4 text-muted-foreground" />}
                       </Label>
                    </div>
                ))}
             </RadioGroup>

          </CardContent>
           <CardFooter className="pt-0 pb-4">
             <Button
                onClick={handleConfirmSelection}
                disabled={!selectedDocument || isLoading} // Disable if nothing selected or loading
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
             >
                 <Check className="mr-2 h-4 w-4" />
                 Confirm Selection & Proceed to Step 2
             </Button>
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
