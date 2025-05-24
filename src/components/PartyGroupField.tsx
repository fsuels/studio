import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PartyGroupFieldProps {
  name: 'sellers' | 'buyers';
  locale: 'en' | 'es';
  max?: number;
}

export default function PartyGroupField({ name, locale, max = 3 }: PartyGroupFieldProps) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const prefix = `${name}[${index}]` as const;
        return (
          <Card key={field.id} className="bg-muted/30 border border-muted-foreground/20">
            <CardContent className="grid grid-cols-1 gap-4 p-4">
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
                <Label htmlFor={`${prefix}.address`} className="text-sm font-medium">
                  {locale === 'es' ? 'Dirección' : 'Address'}
                </Label>
                <Input
                  id={`${prefix}.address`}
                  {...register(`${prefix}.address`, { required: true })}
                  className={cn(errors?.[name]?.[index]?.address && 'border-destructive')}
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
                <Input
                  id={`${prefix}.phone`}
                  {...register(`${prefix}.phone`)}
                  placeholder="(123) 456-7890"
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
          <Plus className="h-4 w-4 mr-1" /> {locale === 'es' ? 'Agregar otro' : 'Add another'}
        </Button>
      )}
    </div>
  );
}
