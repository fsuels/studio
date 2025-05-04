"use client";

import type { InferDocumentTypeInput, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { inferDocumentType } from '@/ai/flows/infer-document-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Edit2, Check, BrainCircuit, X } from 'lucide-react'; // Added X icon
import { useState, useEffect, useCallback } from 'react';

// Mock SpeechRecognition - Replace with actual implementation if needed
const MockSpeechRecognition = {
  start: () => console.log("Mock SpeechRecognition started"),
  stop: () => console.log("Mock SpeechRecognition stopped"),
  onresult: (event: any) => {},
  onerror: (event: any) => {},
  abort: () => console.log("Mock SpeechRecognition aborted"),
  continuous: false,
  interimResults: false,
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

  // Memoize the callback to prevent unnecessary re-renders if passed inline
  const stableOnInferenceResult = useCallback(onInferenceResult, [onInferenceResult]);


  useEffect(() => {
    // Check for browser support and initialize SpeechRecognition
    const SpeechRecognitionApi = isBrowser ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (SpeechRecognitionApi) {
        const recognitionInstance = new SpeechRecognitionApi();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onresult = (event: any) => {
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

        recognitionInstance.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
             let errorMessage = `Error: ${event.error}. Please try again or type your description.`;
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
            setIsRecording(false);
        };

         recognitionInstance.onend = () => {
            // Automatically stop the recording state when the service disconnects
            // This can happen due to silence or network issues
            if (isRecording) { // Only update state if we thought we were recording
                 setIsRecording(false);
                 console.log("Speech recognition service disconnected.");
                 // Optionally, inform the user
                 // toast({ title: "Recording Stopped", description: "Speech recognition stopped." });
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
             continuous: recognitionInstance.continuous,
             interimResults: recognitionInstance.interimResults,
         };


        setRecognition(mockCompatibleInstance);
    } else {
        console.warn('Speech Recognition API not supported in this browser.');
    }
    // Cleanup function to stop recognition if component unmounts while recording
    return () => {
        if (recognition && isRecording) {
            recognition.stop();
        }
    };

  }, [toast, isRecording]); // isRecording dependency added for cleanup


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
      recognition.stop(); // This will trigger the onend event handler
      // setIsRecording(false); // State is now set in onend
    } else {
       // Consider clearing description or appending based on desired UX
       // setDescription(''); // Uncomment to clear previous description
       try {
            recognition.start();
            setIsRecording(true);
            toast({
                title: "Recording Started",
                description: "Speak clearly into your microphone. Recording will stop automatically after a pause.",
            });
       } catch (e: any) {
            console.error("Error starting recognition:", e);
             toast({
                title: "Could Not Start Recording",
                description: `Error: ${e.message}. Please check microphone permissions.`,
                variant: "destructive",
            });
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
      const input: InferDocumentTypeInput = { description: currentDescription };
      const output = await inferDocumentType(input);
      setResult(output);
      stableOnInferenceResult(output); // Pass result to parent
    } catch (error) {
      console.error('Error inferring document type:', error);
      toast({
        title: "AI Inference Error",
        description: "Could not process your request. Please try again.",
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
    handleSubmit(newDescription);
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
            readOnly={isLoading || isRecording} // Prevent editing while loading/recording
            aria-describedby="description-helper-text"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-1.5">
             <Button
                variant="outline"
                size="icon"
                onClick={handleRecord}
                disabled={isLoading || isEditingDescription}
                className={`transition-colors duration-200 ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300' : 'hover:bg-accent'} rounded-full w-8 h-8`} // Smaller, rounded button
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>
             {result && !isEditingDescription && !isLoading && (
               <Button variant="ghost" size="icon" onClick={handleEditDescription} aria-label="Edit Description" className="rounded-full w-8 h-8">
                  <Edit2 className="h-4 w-4" />
               </Button>
             )}
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
             {isRecording ? <span className="animate-pulse">Listening... Speak clearly.</span> : "You can type or use the microphone."}
         </p>
      </div>

       <Button onClick={() => handleSubmit(description)} disabled={isLoading || isRecording || isEditingDescription} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-4 w-4" />
            Infer Document Type
          </>
        )}
      </Button>


      {result && !isLoading && ( // Only show result card when not loading
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
               If this isn't right, try editing the description above and analyze again.
             </p>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}

// Helper function to safely check for window object
const isBrowser = typeof window !== 'undefined';

// Assign window properties conditionally
if (isBrowser) {
  window.SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
}
