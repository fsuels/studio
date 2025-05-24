import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddressField from '@/components/AddressField';
import SmartInput from './wizard/SmartInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PartyGroupFieldProps {
  name: 'sellers' | 'buyers';
  locale: 'en' | 'es';
  max?: number;
  itemLabel?: string;
}

export default function PartyGroupField({ name, locale, max = 3, itemLabel }: PartyGroupFieldProps) {
  const { t } = useTranslation('common');
  const { control, register, setValue, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', address: '', phone: '' });
    }
  }, []);

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const prefix = `${name}[${index}]` as const;
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
                  {...register(`${prefix}.name`, { required: true })}
                  className={cn(errors?.[name]?.[index]?.name && 'border-destructive')}
                />
                {errors?.[name]?.[index]?.name && (
                  <p className="text-xs text-destructive mt-1">
                    {locale === 'es' ? 'Se requiere el nombre.' : 'Name is required.'}
                  </p>
                )}
              </div>

              <div>
                <AddressField
                  name={`${prefix}.address`}
                  label={locale === 'es' ? 'Dirección' : 'Address'}
                  required
                  placeholder="Enter address..."
                  error={errors?.[name]?.[index]?.address?.message as string | undefined}
                  onChange={(val) => {
                    // ensure RHF state updates when using controlled component
                    const fieldName = `${prefix}.address` as const;
                    setValue(fieldName, val, { shouldDirty: true, shouldValidate: true });
                  }}
                />
              </div>

              <div>
                <Label htmlFor={`${prefix}.phone`} className="text-sm font-medium">
                  {locale === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}
                </Label>
                <SmartInput
                  id={`${prefix}.phone`}
                  placeholder="(123) 456-7890"
                  type="tel"
                  rhfProps={register(`${prefix}.phone`)}
                  className={cn(errors?.[name]?.[index]?.phone && 'border-destructive')}
                />
                {errors?.[name]?.[index]?.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {locale === 'es' ? 'Formato de teléfono inválido.' : 'Invalid phone format. Expected (123) 456-7890.'}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <div className="flex justify-end">
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="text-xs">
                    <Trash2 className="h-4 w-4 mr-1" /> {locale === 'es' ? 'Eliminar' : 'Remove'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {fields.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', address: '', phone: '' })} className="text-sm">
          <Plus className="h-4 w-4 mr-1" />
          {locale === 'es'
            ? `Agregar otro ${name === 'sellers' ? 'vendedor' : 'comprador'}`
            : `Add another ${name === 'sellers' ? 'seller' : 'buyer'}`}
        </Button>
      )}
    </div>
  );
}
