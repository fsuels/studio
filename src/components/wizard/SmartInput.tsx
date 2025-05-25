// src/components/wizard/SmartInput.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UseFormRegisterReturn, FieldValues, Path } from 'react-hook-form';
import { useFormContext } from 'react-hook-form'; 

const formatPhone = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  return input;
};

interface SmartInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'name' | 'ref' | 'value'> {
  rhfProps: UseFormRegisterReturn<Path<TFieldValues>>;
  type?: React.HTMLInputTypeAttribute;
}

const SmartInput = React.memo(React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ rhfProps, type, className, ...rest }, forwardedRef) => {
    const { setValue, watch, trigger } = useFormContext(); 

    const { name: rhfName, ref: rhfRegisterRefFromProps, onChange: rhfInternalOnChangeFromProps, onBlur: rhfOnBlurFromProps, ...otherRhfProps } = rhfProps;

    const watchedRHFValue = watch(rhfName);

    const [displayValue, setDisplayValue] = useState<string>(() => {
      const initialVal = typeof watchedRHFValue === 'string' ? watchedRHFValue : '';
      return type === 'tel' ? formatPhone(initialVal) : initialVal;
    });

    useEffect(() => {
      const currentRHFValue = typeof watchedRHFValue === 'string' ? watchedRHFValue : '';
      const newDisplayValue = type === 'tel' ? formatPhone(currentRHFValue) : currentRHFValue;
      if (newDisplayValue !== displayValue) {
        setDisplayValue(newDisplayValue);
      }
    }, [watchedRHFValue, type, displayValue]); 

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      let currentValue = event.target.value;
      let valueToSetInRHF = currentValue;

      if (type === 'tel') {
        const formattedValue = formatPhone(currentValue);
        setDisplayValue(formattedValue); 
        valueToSetInRHF = formattedValue; 
      } else {
        setDisplayValue(currentValue);
      }
      
      setValue(rhfName, valueToSetInRHF, { shouldValidate: true, shouldDirty: true });
    }, [type, rhfName, setValue]);


    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        if (rhfOnBlurFromProps) {
            rhfOnBlurFromProps(event);
        }
        trigger(rhfName);
    }, [rhfOnBlurFromProps, rhfName, trigger]);


    return (
      <Input
        {...rest} 
        {...otherRhfProps} 
        name={rhfName}
        type={type === 'tel' ? 'text' : type} 
        inputMode={type === 'tel' ? 'tel' : undefined}
        className={cn("w-full max-w-sm", className)}
        value={displayValue} 
        onChange={handleInputChange}
        onBlur={handleBlur} 
        ref={(e) => {
          rhfRegisterRefFromProps(e); 
          if (typeof forwardedRef === 'function') {
            forwardedRef(e);
          } else if (forwardedRef && 'current' in forwardedRef) {
            forwardedRef.current = e;
          }
        }}
      />
    );
  }
));
SmartInput.displayName = 'SmartInput';
export default SmartInput;
