"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Edit2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define a basic structure for a question
interface Question {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea'; // Add more types as needed
  required?: boolean;
}

// Example questions - This would be dynamically loaded based on the inferred document type
const exampleQuestions: Record<string, Question[]> = {
  "Lease Agreement": [
    { id: "tenantName", label: "Tenant's Full Name", type: "text", required: true },
    { id: "propertyAddress", label: "Property Address", type: "textarea", required: true },
    { id: "rentAmount", label: "Monthly Rent Amount", type: "number", required: true },
    { id: "leaseStartDate", label: "Lease Start Date", type: "date", required: true },
  ],
  "Partnership Agreement": [
     { id: "partner1Name", label: "Partner 1 Full Name", type: "text", required: true },
     { id: "partner2Name", label: "Partner 2 Full Name", type: "text", required: true },
     { id: "businessName", label: "Business Name", type: "text", required: true },
     { id: "profitSplit", label: "Profit Sharing Arrangement", type: "textarea" },
  ],
  "Default": [ // Fallback if no specific questions defined
     {id: "relevantInfo", label: "Please provide relevant details", type: "textarea", required: true}
  ]
};

interface QuestionnaireProps {
  documentType: string | null; // The inferred document type
  // Callback to pass answers back to the parent component
  onAnswersSubmit: (answers: Record<string, any>) => void;
}

export function Questionnaire({ documentType, onAnswersSubmit }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({}); // Track editing state per field
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const questions = documentType ? (exampleQuestions[documentType] || exampleQuestions["Default"]) : [];

  const handleInputChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

   const toggleEdit = (id: string) => {
    setIsEditing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation (check required fields)
    const missingRequired = questions.some(q => q.required && !answers[q.id]);
    if (missingRequired) {
         toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
         });
         setIsLoading(false);
         return;
    }


    // Simulate submission delay
    setTimeout(() => {
      console.log("Submitted Answers:", answers);
      onAnswersSubmit(answers); // Pass answers to parent
      toast({
        title: "Questionnaire Submitted",
        description: "Your answers have been recorded.",
      });
      setIsLoading(false);
      // Reset editing state after submission
      setIsEditing({});
    }, 1000);
  };

   if (!documentType) {
    // Render placeholder if no document type is selected yet
     return (
        <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed">
          <CardHeader>
             <div className="flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
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
     <Card className="shadow-lg rounded-lg">
      <CardHeader>
         <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
           <CardTitle className="text-2xl">Step 2: Provide Details for {documentType}</CardTitle>
        </div>
        <CardDescription>
          Please answer the following questions to help generate your document. You can edit answers later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map(q => (
            <div key={q.id} className="space-y-2 relative group">
              <Label htmlFor={q.id}>
                {q.label} {q.required && <span className="text-destructive">*</span>}
              </Label>
               <Input
                  id={q.id}
                  type={q.type} // Use appropriate input type
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  required={q.required}
                  readOnly={!isEditing[q.id] && answers[q.id] !== undefined} // Readonly if submitted and not editing
                  className="peer rounded-md shadow-sm pr-10" // Add padding for edit button
               />
                {answers[q.id] !== undefined && ( // Show edit button only after an answer exists
                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => toggleEdit(q.id)}
                     className="absolute right-1 top-[2.1rem] h-7 w-7 opacity-0 group-hover:opacity-100 peer-focus:opacity-100 transition-opacity"
                     aria-label={isEditing[q.id] ? 'Save Answer' : 'Edit Answer'}
                  >
                      {isEditing[q.id] ? <Save className="h-4 w-4 text-green-600" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                )}
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Answers...
            </>
          ) : (
            'Confirm Answers'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
