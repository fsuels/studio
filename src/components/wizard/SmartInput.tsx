// src/components/wizard/SmartInput.tsx
'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UseFormRegisterReturn } from 'react-hook-form';

// Helper function for phone formatting
const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  // First, strip all non-digits
  const digits = value.replace(/[^\d]/g, '');
  const length = digits.length;

  if (length === 0) return '';
  if (length <= 3) return `(${digits}`;
  if (length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  // Ensure we don't exceed 10 digits for formatting
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

interface SmartInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'name' | 'ref'> {
  rhfProps: UseFormRegisterReturn;
  // type is part of HTMLAttributes, but we might want to be explicit for clarity
  type?: React.HTMLInputTypeAttribute;
}

const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ rhfProps, type, className, ...rest }, forwardedRef) => {
    
    const { onChange: rhfOnChange, name: rhfName, ref: rhfRegisterRef, ...restRhfRegisterProps } = rhfProps;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let currentValue = event.target.value;
      if (type === 'tel') {
        const formattedValue = formatPhoneNumber(currentValue);
        
        // Update the event target value for RHF
        // RHF's onChange expects an event or the value directly.
        // To ensure RHF updates correctly and its internal state matches the input field,
        // it's often safer to call it with the new value rather than a modified event,
        // unless specific event properties are needed by RHF's internal logic.
        // However, RHF's `register` typically provides an onChange that expects an event.
        const syntheticEvent = {
          ...event, // Spread original event to keep other properties if any
          target: { ...event.target, value: formattedValue, name: rhfName },
        } as React.ChangeEvent<HTMLInputElement>;
        rhfOnChange(syntheticEvent);

        // If cursor position needs manual management (often for complex masks),
        // this would be the place, but it adds significant complexity.
        // For simple formatting like this, it's often acceptable.
      } else {
        rhfOnChange(event); // Call original RHF onChange for non-phone fields
      }
    };

    return (
      <Input
        {...rest} // Spread other HTML attributes like placeholder, id, aria-invalid etc.
        {...restRhfRegisterProps} // Spread other RHF props like onBlur
        name={rhfName}
        type={type} // Use the type prop passed to SmartInput
        className={cn("max-w-sm", className)} // Ensure max-w-sm is applied as per original UI
        onChange={handleInputChange} // Our custom handler
        ref={(e) => { // Combine RHF's ref with the forwardedRef
          rhfRegisterRef(e);
          if (typeof forwardedRef === 'function') {
            forwardedRef(e);
          } else if (forwardedRef) {
            forwardedRef.current = e;
          }
        }}
      />
    );
  }
);

SmartInput.displayName = 'SmartInput';
export default SmartInput;
