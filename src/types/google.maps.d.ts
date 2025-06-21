declare global {
  namespace google {
    namespace maps {
      namespace places {
        // Enums
        enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          INVALID_REQUEST = 'INVALID_REQUEST',
          NOT_FOUND = 'NOT_FOUND',
          UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        }

        // Interfaces
        interface AutocompleteOptions {
          types?: string[];
          fields?: string[];
          componentRestrictions?: Record<string, unknown>;
        }

        interface AutocompletePrediction {
          description: string;
          place_id: string;
          structured_formatting: {
            main_text: string;
            secondary_text: string;
          };
          types: string[];
        }

        interface PlaceDetailsRequest {
          placeId: string;
          fields?: string[];
        }

        interface PlaceResult {
          formatted_address?: string;
          address_components?: AddressComponent[];
          place_id?: string;
        }

        interface AddressComponent {
          short_name: string;
          long_name: string;
          types: string[];
        }

        interface AutocompleteRequest {
          input: string;
          types?: string[];
          componentRestrictions?: {
            country?: string[];
          };
        }

        // Classes
        class Autocomplete {
          constructor(_input: HTMLInputElement, _opts?: AutocompleteOptions);
          getPlace(): PlaceResult;
          addListener(_event: string, _handler: () => void): void;
        }

        class AutocompleteService {
          constructor();
          getPlacePredictions(
            request: AutocompleteRequest,
            callback: (
              predictions: AutocompletePrediction[] | null,
              status: PlacesServiceStatus,
            ) => void,
          ): void;
        }

        class PlacesService {
          constructor(attrContainer: HTMLElement);
          getDetails(
            request: PlaceDetailsRequest,
            callback: (
              place: PlaceResult | null,
              status: PlacesServiceStatus,
            ) => void,
          ): void;
        }
      }
    }
  }

  interface Window {
    google?: typeof google;
  }
}

export {};
