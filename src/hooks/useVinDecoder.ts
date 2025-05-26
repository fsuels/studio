// src/hooks/useVinDecoder.ts
import { useState, useCallback } from 'react';
import axios from 'axios';

interface DecodedVIN {
  make: string;
  model: string;
  year: number;
  bodyClass?: string;
}

export function useVinDecoder() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DecodedVIN | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decode = useCallback(async (vin: string) => {
    if (vin.length !== 17) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`,
      );

      const out = res.data.Results.reduce(
        (acc: Record<string, string>, r: { Variable: string; Value: string }) => {
          acc[r.Variable] = r.Value;
          return acc;
        },
        {},
      );

      setData({
        make: out.Make,
        model: out.Model,
        year: parseInt(out.ModelYear, 10),
        bodyClass: out.BodyClass,
      });
    } catch {
      setError('Unable to decode VIN');
    } finally {
      setLoading(false);
    }
  }, []);

  return { decode, loading, data, error };
}
