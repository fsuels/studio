'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea' // Import Textarea
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormField } from '@/data/formSchemas'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { Check, Loader2 } from 'lucide-react'; // Import icons


interface Props {
  documentType: string; // Pass the document type name for the title
  schema: FormField[];
  onSubmit: (values: Record<string, any>) => void; // Changed to Record<string, any>
  isReadOnly?: boolean;
}

// Placeholder Icon (consistent with previous Questionnaire)
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);


export default function DynamicFormRenderer({ documentType, schema, onSubmit, isReadOnly = false }: Props) {
  const [values, setValues] = useState<Record<string, any>>({}); // Allow any value type initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [hasSubmitted, setHasSubmitted] = useState(isReadOnly); // Initialize based on isReadOnly

  const handleChange = (id: string, value: string | number | boolean | undefined) => {
      if (isReadOnly) return;
      setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isReadOnly || isLoading || hasSubmitted) return;

      setIsLoading(true);

      // Basic validation: Check if all required fields have values
      const missingRequired = schema.some(field => field.required && (values[field.id] === undefined || values[field.id] === ''));
      if (missingRequired) {
          alert('Please fill in all required fields (*).'); // Simple alert, replace with better UI feedback
          setIsLoading(false);
          return;
      }


      // Simulate submission delay
      setTimeout(() => {
          console.log('Collected form values:', values);
          onSubmit(values);
          setHasSubmitted(true); // Mark as submitted
          setIsLoading(false);
      }, 1000);
  };


    if (schema.length === 0) {
        // Handle case where schema is empty (e.g., General Inquiry or no questions needed)
        return (
             <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
                 <CardHeader>
                     <div className="flex items-center space-x-2">
                         <QuestionnaireIcon />
                         <CardTitle className="text-2xl">Step 2: Details for {documentType}</CardTitle>
                     </div>
                     <CardDescription>
                          No specific questions are needed for this document type.
                     </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground italic">You can proceed to the next step.</p>
                 </CardContent>
                 <CardFooter>
                    <Button onClick={() => { if (!hasSubmitted) onSubmit({}); setHasSubmitted(true); }} className="w-full" disabled={hasSubmitted || isReadOnly}>
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
           {isReadOnly ? 'Review the details provided below.' : 'Answer the questions below.'}
         </CardDescription>
       </CardHeader>
       <CardContent>
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {schema.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.type === 'select' ? (
                  <Select
                    value={values[field.id] || ''}
                    onValueChange={(val) => handleChange(field.id, val)}
                    disabled={isReadOnly || isLoading}
                    required={field.required}
                    name={field.id}
                   >
                    <SelectTrigger id={field.id} className={`${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                     <Textarea
                      id={field.id}
                      value={values[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={isReadOnly || isLoading}
                      placeholder={field.placeholder || ''}
                      className={`resize-none ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                      rows={3}
                      name={field.id}
                    />
                ) : (
                  <Input
                    id={field.id}
                    value={values[field.id] || ''}
                    placeholder={field.placeholder || ''}
                    required={field.required}
                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    disabled={isReadOnly || isLoading}
                    className={`${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                    name={field.id}
                  />
                )}
              </div>
            ))}
            {/* Hide button in read-only mode or if already submitted */}
            {/* {!isReadOnly && !hasSubmitted && (
                 <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
                     {isLoading ? (
                         <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting... </>
                     ) : (
                         'Confirm & Proceed'
                     )}
                 </Button>
             )} */}
          </form>
       </CardContent>
        <CardFooter>
             <Button type="button" onClick={() => handleFormSubmit()} disabled={isLoading || isReadOnly || hasSubmitted} className="w-full">
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
