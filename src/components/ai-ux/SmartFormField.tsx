// src/components/ai-ux/SmartFormField.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Brain, 
  Lightbulb,
  Clock,
  User,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartSuggestion {
  value: string;
  confidence: number;
  source: 'ai' | 'pattern' | 'user_history' | 'legal_standard';
  explanation?: string;
}

interface SmartFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'email' | 'phone' | 'address';
  placeholder?: string;
  required?: boolean;
  fieldId: string;
  documentType: string;
  userContext?: Record<string, any>;
  className?: string;
}

const SmartFormField: React.FC<SmartFormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  fieldId,
  documentType,
  userContext,
  className
}) => {
  const [suggestions, setSuggestions] = React.useState<SmartSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [recentlyCopied, setRecentlyCopied] = React.useState<string | null>(null);
  const [typingTimer, setTypingTimer] = React.useState<NodeJS.Timeout | null>(null);

  // Generate smart suggestions based on context
  React.useEffect(() => {
    if (value.length > 2 && !isLoadingSuggestions) {
      generateSmartSuggestions();
    }
  }, [value, fieldId, documentType, userContext]);

  const generateSmartSuggestions = async () => {
    setIsLoadingSuggestions(true);
    
    try {
      const response = await fetch('/api/ai/field-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          currentValue: value,
          documentType,
          userContext,
          fieldType: type
        })
      });

      const { suggestions: newSuggestions } = await response.json();
      setSuggestions(newSuggestions || []);
      
      if (newSuggestions?.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.warn('Failed to get field suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    // Debounce suggestions
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    setTypingTimer(setTimeout(() => {
      if (newValue.length > 2) {
        generateSmartSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500));
  };

  const applySuggestion = (suggestion: SmartSuggestion) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
    
    // Track suggestion usage
    trackSuggestionUsage(suggestion);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setRecentlyCopied(text);
      setTimeout(() => setRecentlyCopied(null), 2000);
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  };

  const trackSuggestionUsage = (suggestion: SmartSuggestion) => {
    // Analytics tracking
    try {
      fetch('/api/analytics/suggestion-used', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          documentType,
          suggestion: suggestion.value,
          source: suggestion.source,
          confidence: suggestion.confidence
        })
      });
    } catch (error) {
      // Fail silently
    }
  };

  const getSuggestionIcon = (source: string) => {
    switch (source) {
      case 'ai': return <Brain className="h-3 w-3" />;
      case 'pattern': return <Lightbulb className="h-3 w-3" />;
      case 'user_history': return <User className="h-3 w-3" />;
      case 'legal_standard': return <Building className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  const getSuggestionColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderInput = () => {
    const commonProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(e.target.value),
      placeholder,
      required,
      className: cn(
        "transition-all duration-200",
        suggestions.length > 0 && "border-blue-300 shadow-sm"
      )
    };

    switch (type) {
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />;
      case 'email':
        return <Input {...commonProps} type="email" />;
      case 'phone':
        return <Input {...commonProps} type="tel" />;
      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {isLoadingSuggestions && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 animate-spin" />
            Generating suggestions...
          </div>
        )}
      </label>

      <div className="relative">
        {renderInput()}

        {/* Smart Suggestions Popup */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border">
            <CardContent className="p-2 space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 border-b">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">Smart Suggestions</span>
              </div>
              
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {suggestion.value}
                    </p>
                    {suggestion.explanation && (
                      <p className="text-xs text-muted-foreground">
                        {suggestion.explanation}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs px-1.5 py-0.5", getSuggestionColor(suggestion.confidence))}
                    >
                      <div className="flex items-center gap-1">
                        {getSuggestionIcon(suggestion.source)}
                        {Math.round(suggestion.confidence * 100)}%
                      </div>
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(suggestion.value);
                      }}
                    >
                      {recentlyCopied === suggestion.value ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="px-2 py-1 border-t">
                <p className="text-xs text-muted-foreground">
                  Click to apply • Right-click for more options
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Smart Validation */}
      <SmartValidation 
        value={value}
        fieldId={fieldId}
        type={type}
        required={required}
        documentType={documentType}
      />
    </div>
  );
};

// Smart validation component
const SmartValidation: React.FC<{
  value: string;
  fieldId: string;
  type: string;
  required: boolean;
  documentType: string;
}> = ({ value, fieldId, type, required, documentType }) => {
  const [validationResult, setValidationResult] = React.useState<{
    isValid: boolean;
    suggestion?: string;
    warning?: string;
  } | null>(null);

  React.useEffect(() => {
    if (value && value.length > 2) {
      validateField();
    } else {
      setValidationResult(null);
    }
  }, [value, fieldId, type]);

  const validateField = async () => {
    try {
      const response = await fetch('/api/ai/validate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          value,
          type,
          documentType
        })
      });

      const result = await response.json();
      setValidationResult(result);
    } catch (error) {
      console.warn('Field validation failed:', error);
    }
  };

  if (!validationResult) return null;

  return (
    <div className="space-y-1">
      {validationResult.warning && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
          <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <span className="text-amber-800">{validationResult.warning}</span>
        </div>
      )}
      
      {validationResult.suggestion && (
        <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <Brain className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <span className="text-blue-800">{validationResult.suggestion}</span>
        </div>
      )}
    </div>
  );
};

export default SmartFormField;