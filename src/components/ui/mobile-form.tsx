import React from 'react'
import { cn } from '@/lib/utils'
import { TouchInput, TouchSelect, TouchButton } from './touch-interactions'
import { Skeleton } from './skeleton'

// Mobile-optimized form container
interface MobileFormProps {
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function MobileForm({ children, className, onSubmit }: MobileFormProps) {
  return (
    <form
      className={cn(
        'space-y-6 px-4 pb-6', // Extra padding for mobile
        'focus-within:pb-20', // Extra space when keyboard is open
        className
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

// Form section with proper spacing and visual separation
interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Field group for related inputs
interface FieldGroupProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2
}

export function FieldGroup({ children, className, columns = 1 }: FieldGroupProps) {
  return (
    <div className={cn(
      'space-y-4',
      columns === 2 && 'sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0',
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-optimized textarea with auto-resize
interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoResize?: boolean
}

export function MobileTextarea({
  label,
  error,
  autoResize = true,
  className,
  ...props
}: MobileTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = React.useCallback(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [autoResize])

  React.useEffect(() => {
    if (autoResize) {
      adjustHeight()
    }
  }, [adjustHeight, props.value])

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        className={cn(
          'w-full min-h-[100px] px-3 py-3 rounded-md border border-border',
          'bg-background text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-base resize-none', // Prevent zoom on iOS, disable manual resize if auto-resize
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        onInput={adjustHeight}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Mobile checkbox with larger touch target
interface MobileCheckboxProps {
  id: string
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function MobileCheckbox({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  className
}: MobileCheckboxProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={id}
        className={cn(
          'flex items-start space-x-3 cursor-pointer min-h-[44px] py-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="relative flex-shrink-0 mt-1">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div className={cn(
            'w-5 h-5 rounded border-2 transition-all duration-200',
            'flex items-center justify-center',
            checked 
              ? 'bg-primary border-primary' 
              : 'bg-background border-border hover:border-primary',
            error && 'border-destructive',
            disabled && 'opacity-50'
          )}>
            {checked && (
              <svg
                className="w-3 h-3 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1 text-sm leading-6">
          <span className={cn(
            'font-medium text-foreground',
            error && 'text-destructive'
          )}>
            {label}
          </span>
        </div>
      </label>
      {error && (
        <p className="text-sm text-destructive pl-8">{error}</p>
      )}
    </div>
  )
}

// Mobile radio group with proper spacing
interface RadioOption {
  value: string
  label: string
  description?: string
}

interface MobileRadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function MobileRadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className
}: MobileRadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start space-x-3 cursor-pointer min-h-[44px] py-2',
              'border border-border rounded-md px-3',
              'transition-colors duration-200',
              value === option.value && 'border-primary bg-primary/5',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div className={cn(
                'w-4 h-4 rounded-full border-2 transition-all duration-200',
                'flex items-center justify-center',
                value === option.value
                  ? 'border-primary' 
                  : 'border-border',
                error && 'border-destructive'
              )}>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                {option.label}
              </div>
              {option.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Mobile number input with increment/decrement buttons
interface MobileNumberInputProps {
  label?: string
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  error?: string
  disabled?: boolean
  className?: string
}

export function MobileNumberInput({
  label,
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  error,
  disabled = false,
  className
}: MobileNumberInputProps) {
  const increment = () => {
    const newValue = value + step
    if (max === undefined || newValue <= max) {
      onChange?.(newValue)
    }
  }

  const decrement = () => {
    const newValue = value - step
    if (min === undefined || newValue >= min) {
      onChange?.(newValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
      onChange?.(newValue)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <TouchButton
          variant="outline"
          size="md"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className="px-3"
        >
          -
        </TouchButton>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'flex-1 min-h-[44px] px-3 py-2 text-center rounded-md border border-border',
            'bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-base',
            error && 'border-destructive focus:ring-destructive'
          )}
        />
        <TouchButton
          variant="outline"
          size="md"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className="px-3"
        >
          +
        </TouchButton>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Form loading skeleton
export function MobileFormSkeleton() {
  return (
    <div className="space-y-6 px-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  )
}