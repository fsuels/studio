// src/components/wizard/SmartInput.tsx
'use client';
import React from 'react';
import { useSmartField } from './useSmartField';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input'; 

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; 
}

export default function SmartInput({ name, type, ...rest }: Props) {
  const { register, watch, setValue } = useFormContext();
  
  const fieldRegistration = register(name, {
     valueAsNumber: type === 'number',
     // Add other RHF register options if needed, e.g., onBlur for VIN
     onBlur: name === 'vin' ? (e) => {
        // Assuming useSmartField's VIN logic or a separate useVinDecoder hook handles the actual decoding
        // This onBlur could trigger that decoding if it's not already handled by watching the value.
        // For now, keeping it simple as useSmartField watches the value.
     } : undefined,
  });

  // useSmartField now gets `name`, `watch`, `setValue`
  // It will use `watch(name)` for the current value and `setValue(name, ...)` to update.
  useSmartField({
    name, // Pass the field's name
    watch,
    setValue,
  });

  return (
    <Input
      {...rest} 
      {...fieldRegistration} 
      type={type} 
    />
  );
}
