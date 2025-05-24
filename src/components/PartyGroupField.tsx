import React, { useEffect } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartyGroupFieldProps {
  name: 'sellers' | 'buyers';
  locale: 'en' | 'es';
  max?: number;
}

const formatPhone = (input: string) => {
  const cleaned = input.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return input;
};

export default function PartyGroupField({ name, locale, max = 3 }: PartyGroupFieldProps) {
  const { control, register, formState: { errors }, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', address: '', phone: '' }); // ✅ one entry only
    }
  }, [fields.length, append]);

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const prefix = `${name}[${index}]`;
        return (
          <Card key={field.id} className="bg-muted/30 border border-muted-foreground/20">
            <CardContent className="grid grid-cols-1 gap-4 p-4">
              <h3 className="text-sm font-semibold">
                {name === 'sellers' ? `Seller ${index + 1}` : `Buyer ${index + 1}`}
              </h3>

              <div>
                <Label htmlFor={`${prefix}.name`} className="text-sm font-medium">
                  {locale === 'es' ? 'Nombre completo' : 'Full Name'}
                </Label>
                <Input
                  id={`${prefix}.name`}
                  {...register(`${prefix}.name` as const, { required: true })}
                  className={cn(errors?.[name]?.[index]?.name && 'border-destructive')}
                  aria-invalid={!!errors?.[name]?.[index]?.name}
                />
                {errors?.[name]?.[index]?.name && (
                  <p className="text-xs text-destructive mt-1">
                    {locale === 'es' ? 'Se requiere el nombre.' : 'Name is required.'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`${prefix}.address`} className="text-sm font-medium">
                  {locale === 'es' ? 'Dirección' : 'Address'}
                </Label>
                <Input
                  id={`${prefix}.address`}
                  {...register(`${prefix}.address` as const, { required: true })}
                  className={cn(errors?.[name]?.[index]?.address && 'border-destructive')}
                  aria-invalid={!!errors?.[name]?.[index]?.address}
                />
                {errors?.[name]?.[index]?.address && (
                  <p className="text-xs text-destructive mt-1">
                    {locale === 'es' ? 'Se requiere la dirección.' : 'Address is required.'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`${prefix}.phone`} className="text-sm font-medium">
                  {locale === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                </Label>
                <Controller
                  name={`${prefix}.phone` as const}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={`${prefix}.phone`}
                      placeholder="(123) 456-7890"
                      value={field.value || ''}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      className={cn(errors?.[name]?.[index]?.phone && 'border-destructive')}
                      aria-invalid={!!errors?.[name]?.[index]?.phone}
                    />
                  )}
                />
                {errors?.[name]?.[index]?.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {locale === 'es'
                      ? 'Formato de teléfono inválido.'
                      : 'Invalid phone format. Expected (123) 456-7890.'}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-xs"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> {locale === 'es' ? 'Eliminar' : 'Remove'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {fields.length < max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', address: '', phone: '' })}
          className="text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          {locale === 'es'
            ? `Agregar otro ${name === 'sellers' ? 'vendedor' : 'comprador'}`
            : `Add another ${name === 'sellers' ? 'seller' : 'buyer'}`}
        </Button>
      )}
    </div>
  );
}
