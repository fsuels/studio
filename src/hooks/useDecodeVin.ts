// src/hooks/useDecodeVin.ts
'use client';

import { useState, useEffect } from 'react';

export default function useDecodeVin(vin?: string) {
  const [state,set] = useState<{decoded?: any; loading:boolean; error?:string}>({loading:false})
  useEffect(() => {
    if (vin && vin.length===17) {
      set({loading:true})
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`)
        .then(r=>r.json())
        .then(j=>set({decoded:j.Results[0],loading:false}))
        .catch(e=>set({error:e.message,loading:false}))
    }
  },[vin])
  return state
}
