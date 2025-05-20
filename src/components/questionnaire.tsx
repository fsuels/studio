
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select
import { Loader2, Edit2, Lock, Check } from 'lucide-react'; // Updated icons
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, usStates, type Question } from '@/lib/document-library'; // Import library and Question type

interface QuestionnaireProps {
  documentType: string | null; // The inferred document type NAME (e.g., "Residential Lease Agreement")
  selectedState?: string | null; // The selected US state code (e.g., "CA")
  onAnswersSubmit: (answers: Record<string, any>) => void; // Callback
  isReadOnly?: boolean; // Optional prop to make the form read-only
}

// Placeholder SVG Icon
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

export function Questionnaire({ documentType, selectedState, onAnswersSubmit, isReadOnly = false }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({}); // Track editing state per field
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if submitted
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  // Find the document object based on the name
   const selectedDocument = documentLibrary.find(doc => doc.name === documentType);

  // Effect to load and filter questions based on documentType and selectedState
  useEffect(() => {
     let questionsToLoad: Question[] = [];
     if (selectedDocument) {
         questionsToLoad = selectedDocument.questions || []; // Get questions from the matched document object

         // Filter questions based on state relevance
         questionsToLoad = questionsToLoad.filter(q =>
            !q.stateSpecific || // Keep if not state-specific
            q.stateSpecific.length === 0 || // Keep if empty array (applies to all)
            (selectedState && q.stateSpecific.includes(selectedState)) // Keep if state matches
         );
     } else if (documentType === 'General Inquiry') {
         // Handle General Inquiry case specifically if needed
         const generalDoc = documentLibrary.find(doc => doc.id === 'general-inquiry');
         questionsToLoad = generalDoc?.questions || [];
     } else if (documentType) {
          // Fallback if name doesn't match but type is provided (e.g., use default)
         const defaultDoc = documentLibrary.find(doc => doc.id === 'default');
         questionsToLoad = defaultDoc?.questions || [];
     }

     setCurrentQuestions(questionsToLoad);

     // Reset state when document type or state changes significantly
     const initialEditingState = questionsToLoad.reduce((acc, q) => {
         acc[q.id] = !isReadOnly; // Start in editing mode unless globally read-only
         return acc;
     }, {} as Record<string, boolean>);
     setIsEditing(initialEditingState);
     setAnswers({}); // Clear previous answers
     setHasSubmitted(false); // Reset submitted state

  }, [documentType, selectedDocument, selectedState, isReadOnly]); // Re-run when these change


  const handleInputChange = (id: string, value: any) => {
    if (isReadOnly || !isEditing[id]) return; // Prevent changes if read-only or not editing this field
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

   const toggleEdit = (id: string) => {
    if (isReadOnly || isLoading) return; // Prevent toggling if read-only or loading

    const currentlyEditing = isEditing[id];
    const questionLabel = currentQuestions.find(q => q.id === id)?.label || id;

    // If saving (going from edit to non-edit)
    if (currentlyEditing) {
         // Optional: Add validation before saving/locking the field
         if (currentQuestions.find(q => q.id === id)?.required && !answers[id]) {
             toast({ title: "Required Field", description: `"${questionLabel}" cannot be empty.`, variant: "destructive" });
             return; // Keep editing if required field is empty
         }
         toast({ title: "Answer Saved", description: `Answer for "${questionLabel}" locked.`});
    } else {
        toast({ title: "Editing Enabled", description: `You can now edit "${questionLabel}".`});
    }

    setIsEditing(prev => ({ ...prev, [id]: !currentlyEditing }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isReadOnly || isLoading || hasSubmitted) return; // Prevent submit if read-only, loading, or already submitted

    setIsLoading(true);

    // Check if all fields are locked (not in editing mode) OR if all required fields have answers
    const missingRequired = currentQuestions.some(q => q.required && !answers[q.id]);
    const anyStillEditing = currentQuestions.some(q => isEditing[q.id]);

    if (missingRequired) {
         toast({
            title: "Missing Information",
            description: "Please fill in all required (*) fields.",
            variant: "destructive",
         });
         // Optionally, unlock required fields that are empty and still marked as locked
          currentQuestions.forEach(q => {
            if (q.required && !answers[q.id] && !isEditing[q.id]) {
              setIsEditing(prev => ({ ...prev, [q.id]: true }));
            }
          });
         setIsLoading(false);
         return;
    }
    if (anyStillEditing && currentQuestions.length > 0) {
         toast({
            title: "Unsaved Changes",
            description: "Please save (lock) all answers before confirming.",
            variant: "destructive",
         });
         setIsLoading(false);
         return;
    }


    // Simulate submission delay
    setTimeout(() => {
      console.log("Submitted Answers:", answers);
      onAnswersSubmit(answers); // Pass answers to parent
      setHasSubmitted(true); // Mark as submitted
      // Lock all fields after successful submission
      const lockedState = currentQuestions.reduce((acc, q) => { acc[q.id] = false; return acc; }, {} as Record<string, boolean>);
      setIsEditing(lockedState);

      toast({
        title: "Questionnaire Submitted",
        description: "Your answers have been recorded. Proceed to the next step.",
      });
      setIsLoading(false);

    }, 1000);
  };

   if (!documentType) {
    // Render placeholder if no document type is selected yet
     return (
        <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
          <CardHeader>
             <div className="flex items-center space-x-2">
               <QuestionnaireIcon />
              <CardTitle className="text-2xl">Step 2: Answer Questions</CardTitle>
            </div>
            <CardDescription>
               Confirm a document type in Step 1 to see the relevant questions here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Waiting for document confirmation from Step 1...</p>
          </CardContent>
        </Card>
     );
   }
   if (currentQuestions.length === 0 && documentType !== 'General Inquiry') {
        // Handle case where a document type is selected but has no questions defined (or filtered out)
        return (
            <Card className="shadow-lg rounded-lg bg-card border border-border">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <QuestionnaireIcon />
                        <CardTitle className="text-2xl">Step 2: Details for {documentType}</CardTitle>
                    </div>
                    <CardDescription>
                         No specific questions are needed for this document based on the information provided{selectedState ? ` and state ${selectedState}` : ''}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground italic">You can proceed to the next step.</p>
                </CardContent>
                <CardFooter>
                   <Button onClick={() => onAnswersSubmit({})} className="w-full" disabled={hasSubmitted || isReadOnly}>
                     {hasSubmitted || isReadOnly ? (
                         <> <Check className="mr-2 h-4 w-4" /> Confirmed - Proceed </>
                     ) : (
                         'Confirm & Proceed Without Questions'
                     )}
                   </Button>
                </CardFooter>
            </Card>
        );
   }


  return (
     <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
      <CardHeader>
         <div className="flex items-center space-x-2">
            <QuestionnaireIcon />
           <CardTitle className="text-2xl">Step 2: Provide Details for {documentType}</CardTitle>
        </div>
        <CardDescription>
          {isReadOnly
             ? `Review the answers provided for your document ${selectedState ? `(State: ${selectedState})` : ''}.`
             : `Answer the questions below ${selectedState ? `for state ${selectedState}` : ''}. Click the lock/edit icon to save/modify each answer.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentQuestions.map(q => (
            <div key={q.id} className="space-y-2 relative group">
              <Label htmlFor={q.id} className={`${isReadOnly ? 'text-muted-foreground' : ''} ${!isEditing[q.id] ? 'text-muted-foreground' : ''}`}>
                {q.label} {q.required && <span className="text-destructive">*</span>}
              </Label>
               {q.type === 'textarea' ? (
                   <Textarea
                       id={q.id}
                       value={answers[q.id] || ''}
                       onChange={(e) => handleInputChange(q.id, e.target.value)}
                       required={q.required}
                       readOnly={!isEditing[q.id] || isReadOnly || isLoading}
                       placeholder={q.placeholder || ''}
                       className={`peer rounded-md shadow-sm pr-10 resize-none ${isReadOnly || !isEditing[q.id] ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                       rows={3}
                       aria-disabled={isReadOnly || !isEditing[q.id]}
                   />
               ) : q.type === 'select' && q.options ? (
                   <Select
                       value={answers[q.id] || ''}
                       onValueChange={(value) => handleInputChange(q.id, value)}
                       disabled={!isEditing[q.id] || isReadOnly || isLoading}
                       required={q.required}
                   >
                       <SelectTrigger
                           id={q.id}
                           className={`peer rounded-md shadow-sm pr-10 ${isReadOnly || !isEditing[q.id] ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                           aria-disabled={isReadOnly || !isEditing[q.id]}
                           aria-label={q.placeholder || 'Select...'}
                       >
                           <SelectValue placeholder={q.placeholder || 'Select...'} />
                       </SelectTrigger>
                       <SelectContent>
                           {q.options.map(opt => (
                               <SelectItem key={opt.value} value={opt.value}>
                                   {opt.label}
                               </SelectItem>
                           ))}
                       </SelectContent>
                   </Select>

               ) : (
                   <Input
                       id={q.id}
                       type={q.type === 'number' ? 'number' : q.type === 'date' ? 'date' : 'text'}
                       value={answers[q.id] || ''}
                       onChange={(e) => handleInputChange(q.id, e.target.value)}
                       required={q.required}
                       readOnly={!isEditing[q.id] || isReadOnly || isLoading}
                       placeholder={q.placeholder || ''}
                       className={`peer rounded-md shadow-sm pr-10 ${isReadOnly || !isEditing[q.id] ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                       aria-disabled={isReadOnly || !isEditing[q.id]}
                    />
               )}
                {/* Show Edit/Lock button only if not globally read-only */}
                {!isReadOnly && (
                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => toggleEdit(q.id)}
                     disabled={isLoading}
                     className="absolute right-1 top-[2.1rem] h-7 w-7 opacity-0 group-hover:opacity-100 peer-focus:opacity-100 peer-disabled:opacity-50 transition-opacity"
                     aria-label={isEditing[q.id] ? 'Lock Answer' : 'Edit Answer'}
                  >
                      {isEditing[q.id] ? <Lock className="h-4 w-4 text-orange-500" /> : <Edit2 className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                )}

            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="button" onClick={() => handleSubmit()} disabled={isLoading || isReadOnly || hasSubmitted} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Answers...
            </>
          ) : hasSubmitted || isReadOnly ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Answers Confirmed - Proceed
              </>
          ): (
            'Confirm All Answers & Proceed'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
