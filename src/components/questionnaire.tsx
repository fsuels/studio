
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Loader2, Edit2, Lock, Check } from 'lucide-react'; // Updated icons
import { useToast } from '@/hooks/use-toast';

// Define a basic structure for a question
interface Question {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea'; // Add more types as needed
  required?: boolean;
  placeholder?: string; // Add placeholder text
}

// Example questions - This would be dynamically loaded based on the inferred document type
const exampleQuestions: Record<string, Question[]> = {
  "Lease Agreement": [
    { id: "tenantName", label: "Tenant's Full Name", type: "text", required: true, placeholder: "e.g., Jane Doe" },
    { id: "propertyAddress", label: "Property Address", type: "textarea", required: true, placeholder: "e.g., 123 Main St, Anytown, USA 12345" },
    { id: "rentAmount", label: "Monthly Rent Amount ($)", type: "number", required: true, placeholder: "e.g., 1500" },
    { id: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
  ],
   "Lease Agreement (Dummy)": [ // Add dummy questions for the dummy type
    { id: "tenantName", label: "Tenant's Full Name (Dummy)", type: "text", required: true, placeholder: "e.g., Jane Doe" },
    { id: "propertyAddress", label: "Property Address (Dummy)", type: "textarea", required: true, placeholder: "e.g., 123 Main St, Anytown, USA 12345" },
    { id: "rentAmount", label: "Monthly Rent Amount ($) (Dummy)", type: "number", required: true, placeholder: "e.g., 1500" },
    { id: "leaseStartDate", label: "Lease Start Date (Dummy)", type: "date", required: true },
  ],
  "Partnership Agreement": [
     { id: "partner1Name", label: "Partner 1 Full Name", type: "text", required: true, placeholder: "e.g., John Smith" },
     { id: "partner2Name", label: "Partner 2 Full Name", type: "text", required: true, placeholder: "e.g., Alice Brown" },
     { id: "businessName", label: "Business Name", type: "text", required: true, placeholder: "e.g., Acme Innovations LLC" },
     { id: "profitSplit", label: "Profit Sharing Arrangement", type: "textarea", placeholder: "e.g., 50/50 split after expenses" },
  ],
  "Default": [ // Fallback if no specific questions defined
     {id: "relevantInfo", label: "Please provide relevant details", type: "textarea", required: true, placeholder: "Enter all necessary information..."}
  ]
};

interface QuestionnaireProps {
  documentType: string | null; // The inferred document type
  onAnswersSubmit: (answers: Record<string, any>) => void; // Callback
  isReadOnly?: boolean; // Optional prop to make the form read-only
}

// Placeholder SVG Icon
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

export function Questionnaire({ documentType, onAnswersSubmit, isReadOnly = false }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({}); // Track editing state per field
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if submitted
  const { toast } = useToast();

  const questions = documentType ? (exampleQuestions[documentType] || exampleQuestions["Default"]) : [];

  // Effect to initialize editing state and answers when questions load or docType changes
  useEffect(() => {
     if (documentType && questions.length > 0) {
         const initialEditingState = questions.reduce((acc, q) => {
             acc[q.id] = !isReadOnly; // Start in editing mode unless globally read-only
             return acc;
         }, {} as Record<string, boolean>);
         setIsEditing(initialEditingState);
         // Reset answers if document type changes or we move back to this step
         setAnswers({});
         setHasSubmitted(false); // Reset submission status
     } else {
        // Clear state if documentType becomes null
        setAnswers({});
        setIsEditing({});
        setHasSubmitted(false);
     }
  }, [documentType, questions.length, isReadOnly]); // Rerun when docType, questions, or readOnly state changes


  const handleInputChange = (id: string, value: any) => {
    if (isReadOnly || !isEditing[id]) return; // Prevent changes if read-only or not editing this field
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

   const toggleEdit = (id: string) => {
    if (isReadOnly || isLoading) return; // Prevent toggling if read-only or loading

    const currentlyEditing = isEditing[id];
    // If saving (going from edit to non-edit)
    if (currentlyEditing) {
         // Optional: Add validation before saving/locking the field
         if (questions.find(q => q.id === id)?.required && !answers[id]) {
             toast({ title: "Required Field", description: "This field cannot be empty.", variant: "destructive" });
             return; // Keep editing if required field is empty
         }
         toast({ title: "Answer Saved", description: `Answer for "${questions.find(q=>q.id === id)?.label}" locked.`});
    } else {
        toast({ title: "Editing Enabled", description: `You can now edit "${questions.find(q=>q.id === id)?.label}".`});
    }

    setIsEditing(prev => ({ ...prev, [id]: !currentlyEditing }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isReadOnly || isLoading || hasSubmitted) return; // Prevent submit if read-only, loading, or already submitted

    setIsLoading(true);

    // Check if all fields are locked (not in editing mode)
    const allLocked = questions.every(q => !isEditing[q.id] || answers[q.id] !== undefined);
    const missingRequired = questions.some(q => q.required && !answers[q.id]);

    if (!allLocked && Object.values(isEditing).some(editing => editing)) {
         toast({
            title: "Unsaved Changes",
            description: "Please save (lock) all answers before confirming.",
            variant: "destructive",
         });
         setIsLoading(false);
         return;
    }
    if (missingRequired) {
         toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
         });
         // Optionally, unlock required fields that are empty
          questions.forEach(q => {
            if (q.required && !answers[q.id]) {
              setIsEditing(prev => ({ ...prev, [q.id]: true }));
            }
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
      const lockedState = questions.reduce((acc, q) => { acc[q.id] = false; return acc; }, {} as Record<string, boolean>);
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
               Infer a document type in Step 1 to see the relevant questions here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Waiting for document type...</p>
          </CardContent>
        </Card>
     );
   }


  return (
     <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
      <CardHeader>
         <div className="flex items-center space-x-2">
            <QuestionnaireIcon />
           <CardTitle className="text-2xl">Step 2: Provide Details for {documentType}</CardTitle> {/* Updated Step Number */}
        </div>
        <CardDescription>
          {isReadOnly
             ? "Review the answers provided for your document."
             : "Answer the questions below. Click the lock/edit icon to save/modify each answer."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map(q => (
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
