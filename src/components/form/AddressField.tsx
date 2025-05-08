// src/components/form/AddressField.tsx
'use client';
import React, { useEffect } from 'react'; // Added useEffect
import { useAddressAutocomplete, type Prediction } from '@/hooks/useAddressAutocomplete';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AddressFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string; // Made label optional as FieldRenderer might handle it
}

export default function AddressField({ name, label, className, ...rest }: AddressFieldProps) {
  const { register, setValue, watch } = useFormContext();
  const { input, setInput, predictions, clearPredictions, isGoogleMapsApiLoaded } = useAddressAutocomplete();

  const fieldValue = watch(name);

  // Sync internal input state with RHF value, e.g., when RHF defaultValues load
  useEffect(() => {
    if (fieldValue !== input && typeof fieldValue === 'string') {
      setInput(fieldValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]); // Removed setInput from dependencies to avoid loop with onChange

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value); // Update local state for autocomplete hook
    setValue(name, e.target.value, { shouldDirty: true, shouldValidate: true }); // Update RHF state
  };

  const handleSelectPrediction = (prediction: Prediction) => {
    setValue(name, prediction.description, { shouldValidate: true, shouldDirty: true });
    setInput(prediction.description); // Update local state
    clearPredictions();
    // Potentially trigger geocoding here to get city/state/zip and setValue for those fields
    // This would require extending useAddressAutocomplete and this component
  };

  return (
    <div className={cn("relative w-full space-y-1", className)}>
      {label && <Label htmlFor={name} className={cn(rest['aria-invalid'] && "text-destructive")}>{label}{rest.required && <span className="text-destructive">*</span>}</Label>}
      <Input
        {...register(name)} // RHF registration
        {...rest} // Pass other props like placeholder, required, aria-invalid
        id={name} // Ensure id matches RHF name for label association
        value={input} // Controlled component using local state for display
        onChange={handleInputChange}
        placeholder={rest.placeholder || "123 Main St, Anytown, USA"}
        autoComplete="off" // Important for custom autocomplete
        disabled={!isGoogleMapsApiLoaded || rest.disabled}
        className={cn(rest['aria-invalid'] && "border-destructive focus-visible:ring-destructive")}
      />

      {predictions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onMouseDown={(e) => { // Use onMouseDown to prevent input blur before click
                e.preventDefault(); 
                handleSelectPrediction(p);
              }}
              className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm transition-colors"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
       {!isGoogleMapsApiLoaded && input.length > 2 && (
        <p className="text-xs text-muted-foreground mt-1">Address suggestions loading...</p>
      )}
    </div>
  );
}
