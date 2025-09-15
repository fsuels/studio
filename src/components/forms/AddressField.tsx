// src/components/AddressField.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info, MapPin, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { getPublicGoogleMapsApiKey } from '@/lib/env';
// Lazy-load GooglePlacesLoader at render-time to allow jest.doMock overrides
// PlacePicker module will be required at render-time so tests can override via jest.doMock

interface AddressFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  tooltip?: string;
  value?: string;
  onChange?: (_value: string, _parts?: Record<string, string>) => void;
  onFocus?: () => void;
}

// Global variable to track if Google Maps is loading
let isGoogleMapsLoading = false;
let googleMapsLoadPromise: Promise<void> | null = null;

// Helper to obtain PlacePicker at runtime with a static module string.
// This preserves testability (supports jest.doMock) without triggering
// webpack's critical dependency warning.
function getPlacePickerModule(): any {
  try {
    // Bust require cache so late jest.doMock calls take effect
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const resolved = require.resolve(
      '@googlemaps/extended-component-library/react',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (require as any).cache?.[resolved];
    // Load module using a static string literal
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require('@googlemaps/extended-component-library/react');
  } catch {
    return {};
  }
}

const AddressField = React.memo(function AddressField({
  name,
  label,
  placeholder,
  required = false,
  className,
  error,
  tooltip,
  value: controlledValue,
  onChange: controlledOnChange,
  onFocus,
}: AddressFieldProps) {
  // PlacePicker is loaded dynamically via next/dynamic above
  const { t } = useTranslation('common');
  const {
    register,
    setValue: rhfSetValue,
    formState: { errors: formErrors },
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const fieldErrorActual = formErrors[name]?.message || error;

  // Check if Google Maps API key is available
  const apiKey = getPublicGoogleMapsApiKey();
  const hasGoogleMapsApiKey = !!apiKey;

  const { ref: rhfRef, ...restOfRegister } = register(name, { required });

  // Load Google Maps API
  const loadGoogleMaps = useCallback((): Promise<void> => {
    if (googleMapsLoadPromise) {
      return googleMapsLoadPromise;
    }

    if (window.google?.maps?.places?.Autocomplete) {
      setDebugInfo('Google Maps already loaded');
      return Promise.resolve();
    }

    if (isGoogleMapsLoading) {
      googleMapsLoadPromise = new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (window.google?.maps?.places?.Autocomplete) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        setTimeout(
          () => reject(new Error('Timeout loading Google Maps')),
          10000,
        );
      });
      return googleMapsLoadPromise;
    }

    setDebugInfo('Loading Google Maps API...');
    isGoogleMapsLoading = true;

    googleMapsLoadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]',
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      const key = getPublicGoogleMapsApiKey();
      if (!key) {
        setDebugInfo('No Google Maps API key provided');
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key ?? ''}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Global callback
      (window as unknown as { initGoogleMaps: () => void }).initGoogleMaps = () => {
        setDebugInfo('Google Maps API loaded successfully');
        isGoogleMapsLoading = false;
        resolve();
      };

      script.onerror = () => {
        setDebugInfo('Failed to load Google Maps API');
        isGoogleMapsLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (!window.google?.maps?.places?.Autocomplete) {
          setDebugInfo('Timeout loading Google Maps API');
          reject(new Error('Timeout loading Google Maps API'));
        }
      }, 10000);
    });

    return googleMapsLoadPromise;
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!hasGoogleMapsApiKey) {
      setIsLoading(false);
      setDebugInfo('No Google Maps API key configured');
      return;
    }

    let mounted = true;

    const initAutocomplete = async () => {
      try {
        await loadGoogleMaps();

        if (!mounted || !inputRef.current) {
          return;
        }

        setDebugInfo('Initializing autocomplete...');

        // Initialize autocomplete with more debugging
        try {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['address'],
              componentRestrictions: { country: ['us', 'ca', 'mx'] },
              fields: ['formatted_address', 'address_components', 'geometry'],
            },
          );

          setDebugInfo('Autocomplete object created successfully');

          // Add debugging for autocomplete events
          if (autocompleteRef.current) {
            // Check if predictions are working
            const service = new window.google.maps.places.AutocompleteService();

            // Test with a simple query
            service.getPlacePredictions(
              {
                input: '123 main',
                componentRestrictions: { country: ['us', 'ca', 'mx'] },
              },
              (predictions, status) => {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  setDebugInfo(
                    `✅ Predictions working: ${predictions?.length || 0} results for "123 main"`,
                  );
                } else {
                  const statusMessages: Record<string, string> = {
                    REQUEST_DENIED:
                      'API key issue - check restrictions/billing',
                    OVER_QUERY_LIMIT:
                      'Quota exceeded - check Google Cloud Console',
                    INVALID_REQUEST: 'Invalid request format',
                    UNKNOWN_ERROR: 'Server error - try again',
                    ZERO_RESULTS: 'No results found',
                  };
                  const message =
                    statusMessages[status] || `Unknown status: ${status}`;
                  setDebugInfo(
                    `❌ API restricted - falling back to manual entry`,
                  );
                  console.error('Google Places API Error:', status, message);

                  // Disable autocomplete and fall back to manual entry
                  setIsReady(false);
                  if (autocompleteRef.current && window.google?.maps?.event) {
                    window.google.maps.event.clearInstanceListeners(
                      autocompleteRef.current,
                    );
                  }
                  autocompleteRef.current = null;
                }
              },
            );

            // Handle place selection
            autocompleteRef.current.addListener('place_changed', () => {
              const place = autocompleteRef.current?.getPlace();

              if (!place || !place.formatted_address) {
                setDebugInfo('No place selected or invalid place');
                return;
              }

              setDebugInfo(`Selected: ${place.formatted_address}`);
              const formattedAddress = place.formatted_address;

              // Parse address components
              const addressParts: Record<string, string> = {};
              if (place.address_components) {
                place.address_components.forEach((component) => {
                  const types = component.types;
                  if (types.includes('street_number')) {
                    addressParts.street_number = component.long_name;
                  }
                  if (types.includes('route')) {
                    addressParts.route = component.long_name;
                  }
                  if (types.includes('locality')) {
                    addressParts.city = component.long_name;
                  }
                  if (types.includes('administrative_area_level_1')) {
                    addressParts.state = component.short_name;
                  }
                  if (types.includes('postal_code')) {
                    addressParts.postal_code = component.long_name;
                  }
                  if (types.includes('country')) {
                    addressParts.country = component.short_name;
                  }
                });
              }

              const parsedParts = {
                street:
                  `${addressParts.street_number || ''} ${addressParts.route || ''}`.trim(),
                city: addressParts.city || '',
                state: addressParts.state || '',
                postalCode: addressParts.postal_code || '',
                country: addressParts.country || '',
              };

              // Update form
              if (controlledOnChange) {
                controlledOnChange(formattedAddress, parsedParts);
              } else {
                rhfSetValue(name, formattedAddress, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            });

            setIsReady(true);
            setIsLoading(false);
            setDebugInfo('Autocomplete ready and tested');
          } else {
            throw new Error('Failed to create autocomplete object');
          }
        } catch (autocompleteError) {
          throw new Error(`Autocomplete creation failed: ${autocompleteError}`);
        }
      } catch (error) {
        if (mounted) {
          setIsLoading(false);
          setDebugInfo(
            `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          console.error('Google Maps initialization error:', error);
        }
      }
    };

    initAutocomplete();

    return () => {
      mounted = false;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current,
        );
      }
    };
  }, [
    hasGoogleMapsApiKey,
    loadGoogleMaps,
    controlledOnChange,
    rhfSetValue,
    name,
  ]);

  // Handle focus
  const handleFocus = useCallback(() => {
    onFocus?.();
    setDebugInfo((prev) => `${prev} | Input focused`);
  }, [onFocus]);

  // Handle key events for debugging
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setDebugInfo(
        `Key: ${e.key} | Current value: "${target.value}" | Autocomplete: ${isReady ? 'Active' : 'Inactive'}`,
      );
    },
    [isReady],
  );

  // Handle input events (raw input detection)
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setDebugInfo(
      `Input Event: "${target.value}" | Length: ${target.value.length}`,
    );
  }, []);

  // Handle manual input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDebugInfo(
        `Typing: "${value}" (Length: ${value.length}) | Event: ${e.type}`,
      );

      // Always allow typing and form updates
      if (controlledOnChange) {
        controlledOnChange(value);
      } else {
        rhfSetValue(name, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [controlledOnChange, rhfSetValue, name],
  );

  if (!hasGoogleMapsApiKey) {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center gap-1">
          <Label htmlFor={name} className={cn(fieldErrorActual && 'text-destructive')}>
            {t(label)} {required && <span className="text-destructive">*</span>}
          </Label>
          {tooltip && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="icon" aria-label={`Help for ${t(label)}`}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" sideOffset={15}>
                <p className="leading-relaxed font-medium">{t(tooltip)}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {/* Hidden input registered with RHF for validation */}
        <input
          type="text"
          id={name}
          defaultValue={controlledValue || ''}
          {...restOfRegister}
          style={{ display: 'none' }}
        />
        {/** Place picker component */}
        {(() => {
          const PlacePickerModule = getPlacePickerModule();
          return (
            <PlacePickerModule.PlacePicker
              data-testid="place-picker"
              placeholder={placeholder || 'Enter address'}
              country={['us', 'ca', 'mx']}
              type="address"
              style={{ width: '100%', height: 40 }}
              onPlaceChange={(event: any) => {
                const place = event?.target?.value;
                if (!place) return;
                const formattedAddress = place.formattedAddress || place.displayName || '';
                const partsArr = place.addressComponents || [];
                const parts: Record<string, string> = {};
                try {
                  partsArr.forEach((c: any) => {
                    const types = c.types || [];
                    if (types.includes('street_number')) parts.street_number = c.shortText || c.longText;
                    if (types.includes('route')) parts.route = c.shortText || c.longText;
                    if (types.includes('locality')) parts.city = c.shortText || c.longText;
                    if (types.includes('administrative_area_level_1')) parts.state = c.shortText || c.longText;
                    if (types.includes('postal_code')) parts.postal_code = c.shortText || c.longText;
                    if (types.includes('country')) parts.country = c.shortText || c.longText;
                  });
                } catch {}
                const parsedParts = {
                  street: `${parts.street_number || ''} ${parts.route || ''}`.trim(),
                  city: parts.city || '',
                  state: parts.state || '',
                  postalCode: parts.postal_code || '',
                  country: parts.country || '',
                };
                if (controlledOnChange) {
                  controlledOnChange(formattedAddress, parsedParts);
                } else {
                  rhfSetValue(name, formattedAddress);
                }
              }}
            />
          );
        })()}
        {(formErrors[name] || fieldErrorActual) && (
          <p className="text-xs text-destructive mt-1">{t(String(fieldErrorActual || 'required'))}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1">
        <Label
          htmlFor={name}
          className={cn(fieldErrorActual && 'text-destructive')}
        >
          {t(label)}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {tooltip && (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Help for ${t(label)}`}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              sideOffset={15}
              className="w-80 max-w-80 text-sm bg-blue-50 text-blue-900 border-blue-200 border shadow-xl rounded-lg p-4"
              style={{ zIndex: 10000, position: 'fixed' }}
              avoidCollisions={true}
            >
              <p className="leading-relaxed font-medium">{t(tooltip)}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {(() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const G = require('@/components/shared/GooglePlacesLoader').default;
          const Loader = G as React.ComponentType;
          return <Loader />;
        } catch {
          return null;
        }
      })()}
      <div className="relative">
        {/* Hidden input registered with RHF for validation */}
        <input
          type="text"
          id={name}
          defaultValue={controlledValue || ''}
          {...restOfRegister}
          style={{ display: 'none' }}
        />
        {(() => {
          const PlacePickerModule = getPlacePickerModule();
          return (
            <PlacePickerModule.PlacePicker
              data-testid="place-picker"
              placeholder={placeholder || 'Enter address'}
              country={['us', 'ca', 'mx']}
              type="address"
              style={{ width: '100%', height: 40 }}
              onPlaceChange={(event: any) => {
                try {
                  const place = event?.target?.value;
                  if (!place) return;
                  const formattedAddress = place.formattedAddress || place.displayName || '';

                  const partsArr = place.addressComponents || [];
                  const parts: Record<string, string> = {};
                  partsArr.forEach((c: any) => {
                    const types = c.types || [];
                    if (types.includes('street_number')) parts.street_number = c.shortText || c.longText;
                    if (types.includes('route')) parts.route = c.shortText || c.longText;
                    if (types.includes('locality')) parts.city = c.shortText || c.longText;
                    if (types.includes('administrative_area_level_1')) parts.state = c.shortText || c.longText;
                    if (types.includes('postal_code')) parts.postal_code = c.shortText || c.longText;
                    if (types.includes('country')) parts.country = c.shortText || c.longText;
                  });
                  const parsedParts = {
                    street: `${parts.street_number || ''} ${parts.route || ''}`.trim(),
                    city: parts.city || '',
                    state: parts.state || '',
                    postalCode: parts.postal_code || '',
                    country: parts.country || '',
                  };

                  if (controlledOnChange) {
                    controlledOnChange(formattedAddress, parsedParts);
                  } else {
                    rhfSetValue(name, formattedAddress);
                  }
                  setIsReady(true);
                  setIsLoading(false);
                } catch (_e) {
                  // ignore parse errors in tests
                }
              }}
            />
          );
        })()}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          ) : isReady ? (
            <MapPin className="h-4 w-4 text-green-500" />
          ) : (
            <MapPin className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      {(formErrors[name] || fieldErrorActual) && (
        <p className="text-xs text-destructive mt-1">
          {t(String(fieldErrorActual || 'required'))}
        </p>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
          <p>
            <strong>Debug:</strong> {debugInfo}
          </p>
          <p>
            <strong>API Key Status:</strong>{' '}
            {hasGoogleMapsApiKey ? 'Configured' : 'Missing'}
          </p>
          <p>
            <strong>Google Maps Loaded:</strong>{' '}
            {typeof window !== 'undefined' &&
            window.google?.maps?.places?.Autocomplete
              ? 'Yes'
              : 'No'}
          </p>
          <p>
            <strong>Autocomplete Ready:</strong>{' '}
            {autocompleteRef.current ? 'Yes' : 'No'}
          </p>
          {typeof window !== 'undefined' && window.location && (
            <p>
              <strong>Current Domain:</strong> {window.location.hostname}
            </p>
          )}
        </div>
      )}

      {isLoading && (
        <p className="text-xs text-muted-foreground">
          {t('Loading address suggestions...')}
        </p>
      )}

      {!isLoading && !isReady && hasGoogleMapsApiKey && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-medium">💡 Manual Address Entry</p>
          <p>
            Type your complete address (autocomplete unavailable due to API
            restrictions)
          </p>
          <p className="text-xs mt-1 text-blue-500">
            Example: 123 Main St, City, State 12345
          </p>
        </div>
      )}
    </div>
  );
});

export default AddressField;
