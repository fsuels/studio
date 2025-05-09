// src/components/wizard/SmartInput.tsx
'use client';
import React from 'react';
import { useSmartField } from './useSmartField';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input'; 
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; 
}

export default function SmartInput({ name, type, className, ...rest }: Props) {
  const { register, watch, setValue } = useFormContext();
  
  const fieldRegistration = register(name, {
     valueAsNumber: type === 'number',
     onBlur: name === 'vin' ? (e) => {
        // VIN decoding logic is handled by useVinDecoder hook in FieldRenderer
     } : undefined,
  });

  // useSmartField is primarily for specific field behaviors like phone masking or VIN decoding effects.
  // General input styling should be applied directly.
  // useSmartField({
  //   name, 
  //   watch,
  //   setValue,
  // });

  return (
    <Input
      {...rest} 
      {...fieldRegistration} 
      type={type} 
      className={cn("max-w-sm", className)} // Added max-w-sm
    />
  );
}
