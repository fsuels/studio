'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Question } from '@/types/documents';

interface SimpleDynamicFormProps {
  form: UseFormReturn<any>;
  questions: Question[];
  values: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function DynamicForm({ form, questions, values, onChange }: SimpleDynamicFormProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  const handleFieldChange = (fieldId: string, value: any) => {
    setValue(fieldId, value);
    const newValues = { ...values, [fieldId]: value };
    onChange(newValues);
  };

  const isFieldVisible = (question: Question): boolean => {
    if (!question.conditional) return true;

    const conditionField = question.conditional.field;
    const conditionValue = question.conditional.value;
    const currentValue = watch(conditionField);

    return currentValue === conditionValue;
  };

  return (
    <div className="space-y-6">
      {questions.filter(isFieldVisible).map((question) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id} className="text-sm font-medium">
            {question.label}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {question.type === 'text' && (
            <Input
              {...register(question.id, { required: question.required })}
              id={question.id}
              placeholder={question.placeholder}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
            />
          )}

          {question.type === 'textarea' && (
            <Textarea
              {...register(question.id, { required: question.required })}
              id={question.id}
              placeholder={question.placeholder}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
            />
          )}

          {question.type === 'number' && (
            <Input
              {...register(question.id, { required: question.required })}
              id={question.id}
              type="number"
              placeholder={question.placeholder}
              onChange={(e) => handleFieldChange(question.id, Number(e.target.value))}
            />
          )}

          {question.type === 'date' && (
            <Input
              {...register(question.id, { required: question.required })}
              id={question.id}
              type="date"
              onChange={(e) => handleFieldChange(question.id, new Date(e.target.value))}
            />
          )}

          {question.type === 'select' && question.options && (
            <Select onValueChange={(value) => handleFieldChange(question.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={question.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === 'boolean' && (
            <div className="flex items-center space-x-2">
              <Switch
                id={question.id}
                onCheckedChange={(checked) => handleFieldChange(question.id, checked)}
              />
              <Label htmlFor={question.id} className="text-sm">
                {question.label}
              </Label>
            </div>
          )}

          {question.type === 'address' && (
            <Textarea
              {...register(question.id, { required: question.required })}
              id={question.id}
              placeholder={question.placeholder || "Enter full address including street, city, state, and ZIP"}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
            />
          )}

          {question.type === 'button' && (
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => {
                if (question.buttonAction === 'toggle_show_seller2') {
                  handleFieldChange('show_seller2', !watch('show_seller2'));
                } else if (question.buttonAction === 'toggle_show_buyer2') {
                  handleFieldChange('show_buyer2', !watch('show_buyer2'));
                }
              }}
            >
              {question.label}
            </button>
          )}

          {question.tooltip && (
            <p className="text-xs text-muted-foreground">{question.tooltip}</p>
          )}

          {errors[question.id] && (
            <p className="text-xs text-red-500">{errors[question.id]?.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}