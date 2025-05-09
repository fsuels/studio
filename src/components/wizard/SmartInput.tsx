// src/components/wizard/SmartInput.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react'; // Import useState, useEffect, useCallback
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { UseFormRegisterReturn, FieldValues, Path } from 'react-hook-form';
import { useFormContext } from 'react-hook-form'; // To get setValue and watch

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

interface SmartInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'name' | 'ref' | 'value'> {
  rhfProps: UseFormRegisterReturn<Path<TFieldValues>>;
  type?: React.HTMLInputTypeAttribute;
}

const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ rhfProps, type, className, ...rest }, forwardedRef) => {
    const { setValue, watch, trigger } = useFormContext(); // Get RHF's setValue, watch, and trigger

    // rhfProps contains name, onBlur, onChange (RHF's internal), ref
    const { name: rhfName, ref: rhfRegisterRefFromProps, onChange: rhfInternalOnChangeFromProps, onBlur: rhfOnBlurFromProps, ...otherRhfProps } = rhfProps;

    // Watch the RHF value for this field
    const watchedRHFValue = watch(rhfName);

    // Local state for the displayed value
    const [displayValue, setDisplayValue] = useState<string>(() => {
      const initialVal = typeof watchedRHFValue === 'string' ? watchedRHFValue : '';
      return type === 'tel' ? formatPhoneNumber(initialVal) : initialVal;
    });

    // Effect to update displayValue if RHF's value changes from outside (e.g., form.reset, setValue elsewhere)
    useEffect(() => {
      const currentRHFValue = typeof watchedRHFValue === 'string' ? watchedRHFValue : '';
      const newDisplayValue = type === 'tel' ? formatPhoneNumber(currentRHFValue) : currentRHFValue;
      // Only update if displayValue is out of sync with formatted RHF value
      // This prevents infinite loops if formatPhoneNumber is stable for already formatted strings
      if (newDisplayValue !== displayValue) {
        setDisplayValue(newDisplayValue);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedRHFValue, type]); // Removed displayValue from dependencies to prevent potential loops

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      let currentValue = event.target.value;
      let valueToSetInRHF = currentValue;

      if (type === 'tel') {
        const formattedValue = formatPhoneNumber(currentValue);
        setDisplayValue(formattedValue); // Update visual state immediately
        valueToSetInRHF = formattedValue; // RHF should store the formatted value for validation
      } else {
        setDisplayValue(currentValue);
      }
      
      // Update RHF state
      setValue(rhfName, valueToSetInRHF, { shouldValidate: true, shouldDirty: true });
    }, [type, rhfName, setValue]);


    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        // Trigger RHF's onBlur if it exists
        if (rhfOnBlurFromProps) {
            rhfOnBlurFromProps(event);
        }
        // Optionally, trigger validation on blur as well
        trigger(rhfName);
    }, [rhfOnBlurFromProps, rhfName, trigger]);


    return (
      <Input
        {...rest} // Spread other user-passed props (id, placeholder, aria-invalid etc.)
        {...otherRhfProps} // Spread other props from register (like 'required' attribute)
        name={rhfName}
        type={type === 'tel' ? 'text' : type} // Use text for tel to allow custom formatting, browser can still use 'tel' for keypad hints
        inputMode={type === 'tel' ? 'tel' : undefined}
        className={cn("max-w-sm", className)}
        value={displayValue} // Display value is controlled by local state
        onChange={handleInputChange}
        onBlur={handleBlur} // Use our custom blur handler
        ref={(e) => {
          rhfRegisterRefFromProps(e); // RHF's ref from register
          if (typeof forwardedRef === 'function') {
            forwardedRef(e);
          } else if (forwardedRef && 'current' in forwardedRef) {
            forwardedRef.current = e;
          }
        }}
      />
    );
  }
);
SmartInput.displayName = 'SmartInput';
export default SmartInput;