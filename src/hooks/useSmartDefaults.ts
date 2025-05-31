// src/hooks/useSmartDefaults.ts
'use client';

import { useEffect } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

interface VinDecodeResult {
  Variable: string;
  VariableId: number;
  Value: string | null;
}

/**
 * Hook for autocompleting city and state from a ZIP code.
 * @param watch react-hook-form's watch function.
 * @param setValue react-hook-form's setValue function.
 * @param zipFieldKey The name of the ZIP code field in the form (e.g., 'zip_code', 'seller_zip'). Defaults to 'zip_code'.
 * @param cityFieldKey The name of the city field to update (e.g., 'city', 'seller_city'). Defaults to 'city'.
 * @param stateFieldKey The name of the state field to update (e.g., 'stateCode', 'seller_state'). Defaults to 'stateCode'.
 */
export function useAddressAutocomplete<
  TFieldValues extends FieldValues = FieldValues,
>(
  watch: UseFormWatch<TFieldValues>,
  setValue: UseFormSetValue<TFieldValues>,
  zipFieldKey: Path<TFieldValues> | string = 'zip_code',
  cityFieldKey: Path<TFieldValues> | string = 'city',
  stateFieldKey: Path<TFieldValues> | string = 'stateCode',
) {
  const zip = watch(zipFieldKey as Path<TFieldValues>);

  useEffect(() => {
    if (zip && typeof zip === 'string' && zip.length === 5) {
      fetch(`https://api.zippopotam.us/us/${zip}`)
        .then((r) => {
          if (!r.ok) throw new Error(`ZIP API error: ${r.status}`);
          return r.json();
        })
        .then((d) => {
          if (d.places && d.places[0]) {
            const place = d.places[0];
            setValue(
              cityFieldKey as Path<TFieldValues>,
              place['place name'] as PathValue<
                TFieldValues,
                Path<TFieldValues>
              >,
              { shouldValidate: true },
            );
            setValue(
              stateFieldKey as Path<TFieldValues>,
              place['state abbreviation'] as PathValue<
                TFieldValues,
                Path<TFieldValues>
              >,
              { shouldValidate: true },
            );
          } else {
            console.warn(`No data found for ZIP: ${zip}`);
          }
        })
        .catch((err) =>
          console.error(`Failed to fetch ZIP data for ${zip}:`, err),
        );
    }
  }, [zip, setValue, zipFieldKey, cityFieldKey, stateFieldKey]); // watch is stable, not needed in deps
}

/**
 * Hook for decoding a VIN to get vehicle make, model, and year.
 * @param watch react-hook-form's watch function.
 * @param setValue react-hook-form's setValue function.
 * @param vinFieldKey The name of the VIN field in the form. Defaults to 'vehicle_vin'.
 * @param makeFieldKey The name of the vehicle make field. Defaults to 'vehicle_make'.
 * @param modelFieldKey The name of the vehicle model field. Defaults to 'vehicle_model'.
 * @param yearFieldKey The name of the vehicle year field. Defaults to 'vehicle_year'.
 */
export function useVinDecoder<TFieldValues extends FieldValues = FieldValues>(
  watch: UseFormWatch<TFieldValues>,
  setValue: UseFormSetValue<TFieldValues>,
  vinFieldKey: Path<TFieldValues> | string = 'vehicle_vin',
  makeFieldKey: Path<TFieldValues> | string = 'vehicle_make',
  modelFieldKey: Path<TFieldValues> | string = 'vehicle_model',
  yearFieldKey: Path<TFieldValues> | string = 'vehicle_year',
) {
  const vin = watch(vinFieldKey as Path<TFieldValues>);

  useEffect(() => {
    if (vin && typeof vin === 'string' && vin.length === 17) {
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
      )
        .then((r) => {
          if (!r.ok) throw new Error(`VIN API error: ${r.status}`);
          return r.json();
        })
        .then(({ Results }: { Results?: VinDecodeResult[] }) => {
          if (Results) {
            const make = Results.find(
              (r: VinDecodeResult) =>
                r.Variable === 'Make' || r.VariableId === 26,
            )?.Value;
            const model = Results.find(
              (r: VinDecodeResult) =>
                r.Variable === 'Model' || r.VariableId === 28,
            )?.Value;
            const year = Results.find(
              (r: VinDecodeResult) =>
                r.Variable === 'Model Year' || r.VariableId === 29,
            )?.Value;

            if (make)
              setValue(
                makeFieldKey as Path<TFieldValues>,
                make as PathValue<TFieldValues, Path<TFieldValues>>,
                { shouldValidate: true },
              );
            if (model)
              setValue(
                modelFieldKey as Path<TFieldValues>,
                model as PathValue<TFieldValues, Path<TFieldValues>>,
                { shouldValidate: true },
              );
            if (year)
              setValue(
                yearFieldKey as Path<TFieldValues>,
                year as PathValue<TFieldValues, Path<TFieldValues>>,
                { shouldValidate: true },
              );
          } else {
            console.warn(`No results found for VIN: ${vin}`);
          }
        })
        .catch((err) =>
          console.error(`Failed to fetch VIN data for ${vin}:`, err),
        );
    }
  }, [vin, setValue, vinFieldKey, makeFieldKey, modelFieldKey, yearFieldKey]); // watch is stable
}
