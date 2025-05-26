/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace google.maps.places {
    interface AutocompleteOptions {
      types?: string[];
      fields?: string[];
      componentRestrictions?: Record<string, unknown>;
    }

    class Autocomplete {
      constructor(input: HTMLInputElement, opts?: AutocompleteOptions);
      getPlace(): unknown;
      addListener(event: string, handler: () => void): void;
    }
  }
}

export {};
