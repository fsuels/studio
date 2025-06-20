'use client'

import React, { useState, useEffect, ComponentType } from 'react'
import { Skeleton } from './skeleton'

interface ProgressiveLoaderProps<T = {}> {
  component: () => Promise<{ default: ComponentType<T> }>
  fallback?: React.ReactNode
  delay?: number
  timeout?: number
  props?: T
}

export function ProgressiveLoader<T = {}>({
  component,
  fallback,
  delay = 0,
  timeout = 10000,
  props = {} as T,
}: ProgressiveLoaderProps<T>) {
  const [LoadedComponent, setLoadedComponent] = useState<ComponentType<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    let mounted = true
    let delayTimer: NodeJS.Timeout
    let timeoutTimer: NodeJS.Timeout

    const loadComponent = async () => {
      try {
        // Add minimum delay to prevent flash
        if (delay > 0) {
          delayTimer = setTimeout(() => {
            if (mounted) setShowFallback(true)
          }, delay)
        } else {
          setShowFallback(true)
        }

        // Set timeout for loading
        timeoutTimer = setTimeout(() => {
          if (mounted && isLoading) {
            setHasError(true)
            setIsLoading(false)
          }
        }, timeout)

        const module = await component()
        
        if (mounted) {
          setLoadedComponent(() => module.default)
          setIsLoading(false)
          setHasError(false)
        }
      } catch (error) {
        console.error('Failed to load component:', error)
        if (mounted) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      mounted = false
      if (delayTimer) clearTimeout(delayTimer)
      if (timeoutTimer) clearTimeout(timeoutTimer)
    }
  }, [component, delay, timeout, isLoading])

  if (hasError) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Failed to load component. Please try refreshing the page.</p>
      </div>
    )
  }

  if (isLoading || !LoadedComponent) {
    return (
      showFallback ? (
        fallback || <Skeleton className="h-32 w-full" />
      ) : null
    )
  }

  return <LoadedComponent {...props} />
}

// Higher-order component version
export function withProgressiveLoading<T = {}>(
  component: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode,
  options?: { delay?: number; timeout?: number }
) {
  return function ProgressiveComponent(props: T) {
    return (
      <ProgressiveLoader
        component={component}
        fallback={fallback}
        delay={options?.delay}
        timeout={options?.timeout}
        props={props}
      />
    )
  }
}

// Hook for progressive loading
export function useProgressiveLoad<T>(
  component: () => Promise<{ default: ComponentType<T> }>,
  options?: { delay?: number; timeout?: number }
) {
  const [LoadedComponent, setLoadedComponent] = useState<ComponentType<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let mounted = true
    let timeoutTimer: NodeJS.Timeout

    const loadComponent = async () => {
      try {
        if (options?.timeout) {
          timeoutTimer = setTimeout(() => {
            if (mounted && isLoading) {
              setHasError(true)
              setIsLoading(false)
            }
          }, options.timeout)
        }

        const module = await component()
        
        if (mounted) {
          setLoadedComponent(() => module.default)
          setIsLoading(false)
          setHasError(false)
        }
      } catch (error) {
        console.error('Failed to load component:', error)
        if (mounted) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      mounted = false
      if (timeoutTimer) clearTimeout(timeoutTimer)
    }
  }, [component, options?.timeout, isLoading])

  return { LoadedComponent, isLoading, hasError }
}