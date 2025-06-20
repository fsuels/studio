'use client'

import React from 'react'
import { cn } from '@/lib/utils'

// Touch-friendly button with proper sizing and feedback
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function TouchButton({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'ghost':
        return 'bg-transparent hover:bg-muted active:bg-muted/80 text-foreground'
      case 'outline':
        return 'border border-border bg-background hover:bg-muted active:bg-muted/80'
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90 active:bg-destructive/80 text-destructive-foreground'
      default:
        return 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-h-[40px] px-3 py-2 text-sm'
      case 'lg':
        return 'min-h-[52px] px-6 py-3 text-lg'
      default:
        return 'min-h-[44px] px-4 py-2.5 text-base'
    }
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'select-none touch-manipulation', // Prevent text selection and improve touch
        'active:scale-[0.98]', // Subtle press feedback
        getVariantClasses(),
        getSizeClasses(),
        isPressed && 'scale-[0.98]',
        className
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  )
}

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ReactNode
    label: string
    color?: 'primary' | 'destructive' | 'secondary'
  }
  rightAction?: {
    icon: React.ReactNode
    label: string
    color?: 'primary' | 'destructive' | 'secondary'
  }
  threshold?: number
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = 80,
  className
}: SwipeableCardProps) {
  const [dragOffset, setDragOffset] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    
    // Limit drag distance
    const maxDrag = 120
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff))
    setDragOffset(limitedDiff)
  }

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) >= threshold) {
      if (dragOffset > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }
    
    setDragOffset(0)
    setIsDragging(false)
  }

  const getActionColor = (color?: string) => {
    switch (color) {
      case 'destructive': return 'bg-destructive text-destructive-foreground'
      case 'secondary': return 'bg-secondary text-secondary-foreground'
      default: return 'bg-primary text-primary-foreground'
    }
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* Left action */}
      {rightAction && dragOffset > 0 && (
        <div 
          className={cn(
            'absolute left-0 top-0 h-full flex items-center justify-center transition-all duration-200',
            getActionColor(rightAction.color)
          )}
          style={{ width: `${Math.abs(dragOffset)}px` }}
        >
          <div className="flex flex-col items-center space-y-1 px-4">
            {rightAction.icon}
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action */}
      {leftAction && dragOffset < 0 && (
        <div 
          className={cn(
            'absolute right-0 top-0 h-full flex items-center justify-center transition-all duration-200',
            getActionColor(leftAction.color)
          )}
          style={{ width: `${Math.abs(dragOffset)}px` }}
        >
          <div className="flex flex-col items-center space-y-1 px-4">
            {leftAction.icon}
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'relative bg-background transition-transform duration-200',
          isDragging ? 'transition-none' : ''
        )}
        style={{ transform: `translateX(${dragOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Long press component
interface LongPressProps {
  onLongPress: () => void
  onPress?: () => void
  delay?: number
  children: React.ReactNode
  className?: string
}

export function LongPress({
  onLongPress,
  onPress,
  delay = 500,
  children,
  className
}: LongPressProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const start = React.useCallback(() => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, delay)
  }, [onLongPress, delay])

  const stop = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (isPressed) {
      onPress?.()
    }
    setIsPressed(false)
  }, [isPressed, onPress])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPressed(false)
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn(
        'select-none touch-manipulation transition-transform duration-150',
        isPressed && 'scale-95',
        className
      )}
      onTouchStart={start}
      onTouchEnd={stop}
      onTouchCancel={cancel}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={cancel}
    >
      {children}
    </div>
  )
}

// Touch-friendly dropdown/select component
interface TouchSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: Array<{ value: string; label: string }>
  disabled?: boolean
  className?: string
}

export function TouchSelect({
  value,
  onValueChange,
  placeholder = 'Select...',
  options,
  disabled = false,
  className
}: TouchSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-touch-select]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={cn('relative', className)} data-touch-select>
      <TouchButton
        variant="outline"
        className="w-full justify-between min-h-[48px] text-left"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn(
          selectedOption ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </TouchButton>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'w-full px-4 py-3 text-left min-h-[48px] transition-colors duration-150',
                'hover:bg-muted active:bg-muted/80',
                'focus:outline-none focus:bg-muted',
                value === option.value && 'bg-primary/10 text-primary font-medium'
              )}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Touch-optimized input component
interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function TouchInput({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  ...props
}: TouchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full min-h-[48px] px-3 py-3 rounded-md border border-border',
            'bg-background text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-base', // Prevent zoom on iOS
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-destructive focus:ring-destructive',
            isFocused && 'ring-2 ring-ring',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}