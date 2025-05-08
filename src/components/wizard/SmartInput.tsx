// src/components/wizard/SmartInput.tsx
'use client';
import React from 'react';
import { useSmartField } from './useSmartField';
import { useFormContext, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input'; // Assuming you use ShadCN input

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; // Pass name directly
  // rhf prop from original prompt was problematic, using name and useFormContext instead
}

export default function SmartInput({ name, type, ...rest }: Props) {
  const { register, watch, setValue } = useFormContext();
  
  // Get the registration properties for the field
  const fieldRegistration = register(name);

  // Apply smart behaviors using the custom hook
  // This hook might internally call setValue for the current field or related fields
  useSmartField({
    name,
    watch,
    setValue,
  });

  return (
    <Input
      {...rest} // Pass through other HTML input attributes
      {...fieldRegistration} // Spread RHF registration props (name, ref, onBlur, onChange)
      type={type} // Ensure type is correctly passed
      // value={watch(name) || ''} // Controlled component pattern can sometimes be needed with RHF + external updates
                                  // However, register() typically handles this. If direct setValue in hook
                                  // doesn't reflect, controlling value might be needed.
                                  // For now, relying on register's onChange.
    />
  );
}
