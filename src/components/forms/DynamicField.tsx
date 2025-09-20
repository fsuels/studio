'use client';

// Dynamic field renderer for individual form inputs
// Handles all field types defined in JSON configuration

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { type QuestionConfig } from '@/lib/config-loader';

interface DynamicFieldProps {
  config: QuestionConfig;
  error?: string;
  className?: string;
}

export default function DynamicField({ 
  config, 
  error,
  className = '' 
}: DynamicFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={config.id}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-2">
            <span id={`${config.id}-label`}>{config.label}</span>
            {config.required && <span className="text-red-500">*</span>}
            {config.tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{config.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </FormLabel>
          
          <FormControl>
            {renderFieldInput(config, field, `${config.id}-label`)}
          </FormControl>
          
          {config.tooltip && !config.tooltip.includes('Click') && (
            <FormDescription>
              {config.tooltip}
            </FormDescription>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFieldInput(config: QuestionConfig, field: any, labelId: string) {
  const baseProps = {
    ...field,
    name: config.id,
  };
  
  switch (config.type) {
    case 'text':
      return (
        <Input
          {...baseProps}
          id={config.id}
          placeholder={config.placeholder}
          aria-labelledby={labelId}
          type="text"
          autoComplete={getAutoComplete(config.id)}
        />
      );
      
    case 'textarea':
      return (
        <Textarea
          {...baseProps}
          id={config.id}
          placeholder={config.placeholder}
          aria-labelledby={labelId}
          rows={4}
          className="resize-vertical"
        />
      );
      
    case 'number':
      return (
        <Input
          {...baseProps}
          id={config.id}
          placeholder={config.placeholder}
          aria-labelledby={labelId}
          type="number"
          min={config.validation?.min}
          max={config.validation?.max}
          step={config.id.includes('price') || config.id.includes('amount') ? '0.01' : '1'}
        />
      );
      
    case 'select':
      return (
        <Select
          onValueChange={field.onChange}
          value={field.value}
          name={config.id}
          aria-labelledby={labelId}
          aria-label={config.label}
        >
          <SelectTrigger id={config.id} aria-labelledby={labelId}>
            <SelectValue placeholder={config.placeholder || `Select ${config.label}`} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            id={config.id}
          />
          <label
            htmlFor={config.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {config.placeholder || 'Yes'}
          </label>
        </div>
      );
      
    case 'date':
      return <DatePicker field={field} config={config} />;
      
    case 'address':
      return <AddressInput field={field} config={config} />;
      
    default:
      return (
        <Input
          {...baseProps}
          id={config.id}
          placeholder={config.placeholder}
          aria-labelledby={labelId}
          type="text"
        />
      );
  }
}

// Date picker component
function DatePicker({ field, config }: { field: any; config: QuestionConfig }) {
  const [open, setOpen] = React.useState(false);
  
  // Parse the date value (string) to Date object
  const dateValue = field.value ? 
    (typeof field.value === 'string' ? parse(field.value, 'yyyy-MM-dd', new Date()) : field.value) : 
    undefined;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(dateValue!, 'PPP') : (config.placeholder || 'Pick a date')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              field.onChange(format(date, 'yyyy-MM-dd'));
              setOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Address input component (can be enhanced with autocomplete)
function AddressInput({ field, config }: { field: any; config: QuestionConfig }) {
  return (
    <Textarea
      {...field}
      placeholder={config.placeholder || 'Enter full address including city, state, and ZIP code'}
      rows={3}
      className="resize-vertical"
    />
  );
}

// Get appropriate autocomplete attribute for common field types
function getAutoComplete(fieldId: string): string {
  const autoCompleteMap: Record<string, string> = {
    // Names
    'seller_name': 'name',
    'buyer_name': 'name', 
    'grantor_name': 'name',
    'grantee_name': 'name',
    'party1_name': 'name',
    'party2_name': 'name',
    
    // Addresses
    'seller_address': 'street-address',
    'buyer_address': 'street-address',
    'address': 'street-address',
    'mailing_address': 'street-address',
    
    // Contact
    'phone': 'tel',
    'email': 'email',
    'seller_phone': 'tel',
    'buyer_phone': 'tel',
    
    // Location
    'city': 'address-level2',
    'state': 'address-level1', 
    'zip': 'postal-code',
    'country': 'country',
    
    // Organization
    'company': 'organization',
    'organization': 'organization',
    
    // Dates
    'birth_date': 'bday',
    'date_of_birth': 'bday'
  };
  
  return autoCompleteMap[fieldId] || 'off';
}

// Helper function to determine if field should be highlighted
export function shouldHighlightField(config: QuestionConfig, value: any): boolean {
  if (!config.required) return false;
  
  switch (config.type) {
    case 'boolean':
      return value === undefined || value === null;
    case 'select':
      return !value;
    case 'number':
      return !value && value !== 0;
    default:
      return !value || value === '';
  }
}

// Export for external use
export type { DynamicFieldProps };