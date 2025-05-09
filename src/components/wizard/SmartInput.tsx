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
  
  let formattedNumber = '(';
  if (length >= 1) {
    formattedNumber += digits.substring(0, Math.min(3, length));
  }
  if (length > 3) {
    formattedNumber += ') ' + digits.substring(3, Math.min(6, length));
  }
  if (length > 6) {
    formattedNumber += '-' + digits.substring(6, Math.min(10, length));
  }
  return formattedNumber;
};

interface SmartInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'name' | 'ref'> {
  rhfProps: UseFormRegisterReturn;
  type?: React.HTMLInputTypeAttribute;
}

const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ rhfProps, type, className, ...rest }, forwardedRef) => {
    
    const { onChange: rhfOnChange, name: rhfName, ref: rhfRegisterRef, ...restRhfRegisterProps } = rhfProps;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let currentValue = event.target.value;
      if (type === 'tel') {
        const formattedValue = formatPhoneNumber(currentValue);
        
        // Create a synthetic event with the formatted value to pass to RHF
        const syntheticEvent = {
          ...event,
          target: { ...event.target, value: formattedValue, name: rhfName },
        } as React.ChangeEvent<HTMLInputElement>;
        rhfOnChange(syntheticEvent);

      } else {
        rhfOnChange(event); // Call original RHF onChange for non-phone fields
      }
    };

    return (
      <Input
        {...rest} 
        {...restRhfRegisterProps} 
        name={rhfName}
        type={type} 
        className={cn("max-w-sm", className)} 
        onChange={handleInputChange} 
        ref={(e) => { 
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