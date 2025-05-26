declare global {
  namespace google.maps.places {
    interface AutocompleteOptions {
      types?: string[];
      fields?: string[];
      componentRestrictions?: Record<string, unknown>;
    }

    class Autocomplete {
      constructor(_input: HTMLInputElement, _opts?: AutocompleteOptions);
      getPlace(): unknown;
      addListener(_event: string, _handler: () => void): void;
    }
  }
}

export {};
