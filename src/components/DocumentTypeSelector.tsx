// src/components/DocumentTypeSelector.tsx
'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Adjusted imports
import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react'; // Added an icon

export interface SuggestedDoc {
  name: string;
  reason: string;
  confidence?: number; // Add confidence for potential display
}

interface Props {
  suggestions: SuggestedDoc[];
  onSelect: (docType: string) => void;
}

export default function DocumentTypeSelector({ suggestions, onSelect }: Props) {
  const { t } = useTranslation();

  if (!suggestions || suggestions.length === 0) return null;

  // Ensure "General Inquiry" has a standard reason if none provided
  const processedSuggestions = suggestions.map(s => ({
      ...s,
      reason: s.name === 'General Inquiry' && !s.reason ? 'Your request is broad or doesn\'t match specific templates. Select this if unsure.' : s.reason
  }));

  return (
    <Card className="mt-6 bg-secondary/70 rounded-lg shadow-inner border border-border animate-fade-in">
       <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-lg flex items-center font-medium">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Suggested Documents
          </CardTitle>
           <CardDescription className="text-sm">
             {t('Based on your description, we suggest the following. Please select the best fit to continue.')}
           </CardDescription>
        </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {processedSuggestions.map((doc, index) => (
          <Card
            key={index}
            onClick={() => onSelect(doc.name)}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-card"
            tabIndex={0} // Make card focusable
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(doc.name); }} // Allow selection with keyboard
          >
            <CardContent className="p-4">
              <CardTitle className="text-base font-semibold mb-2 flex items-center justify-between">
                 <span>{doc.name}</span>
                  {/* Optional: Display confidence */}
                 {doc.confidence !== undefined && (
                    <span className={`ml-2 text-xs font-normal px-1.5 py-0.5 rounded ${
                        doc.confidence > 0.7 ? 'bg-green-100 text-green-800' :
                        doc.confidence > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {(doc.confidence * 100).toFixed(0)}% Match
                    </span>
                 )}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {doc.reason}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </CardContent>
      {/* Footer can be added if needed, e.g., for "None of these" option */}
    </Card>
  );
}
