// src/components/wizard/SmartInput.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UseFormRegisterReturn, FieldValues, Path } from 'react-hook-form';
import { useFormContext } from 'react-hook-form'; 

const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
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
      return type === 'tel' ? formatPhoneNumber(initialVal) : initialVal;
    });

    useEffect(() => {
      const currentRHFValue = typeof watchedRHFValue === 'string' ? watchedRHFValue : '';
      const newDisplayValue = type === 'tel' ? formatPhoneNumber(currentRHFValue) : currentRHFValue;
      if (newDisplayValue !== displayValue) {
        setDisplayValue(newDisplayValue);
      }
    }, [watchedRHFValue, type, displayValue]); 

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = event.target.value;
      let valueToSetInRHF = currentValue;

      if (type === 'tel') {
        const formattedValue = formatPhoneNumber(currentValue);
        setDisplayValue(formattedValue); 
        valueToSetInRHF = formattedValue; 
      } else {
        setDisplayValue(currentValue);
      }
      
      setValue(rhfName, valueToSetInRHF, { shouldValidate: true, shouldDirty: true });
      if (rhfInternalOnChangeFromProps) {
        rhfInternalOnChangeFromProps(event);
      }
    }, [type, rhfName, setValue, rhfInternalOnChangeFromProps]);


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
        className={cn("max-w-sm", className)}
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
