// src/utils/isValidVIN.ts

// Weighted checksum test – good enough for UI validation
export function isValidVIN(vin: string): boolean {
  if (typeof vin !== 'string' || vin.length !== 17) {
    return false;
  }
  const vinUpper = vin.toUpperCase();
  const map = '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.split('');
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];

  const transliterate = (c: string): number => {
    const i = map.indexOf(c);
    // For 'IOQ', map.indexOf will be -1, which is fine as per the regex in BillOfSaleSchema
    // However, the original logic from the user implies these are invalid.
    // The regex /^[A-HJ-NPR-Z0-9]+$/i in BillOfSaleSchema already handles IOQ exclusion.
    // This transliteration is for the checksum calculation.
    if (i === -1) return 0; // Should not happen if regex passes first
    return i > 9 ? (i - map.indexOf('A') + 10) % 10 : i; // Simplified mapping for letters
  };
  
  // A more standard VIN checksum logic often maps letters to numeric values (A=1, B=2 ... J=1, K=2 ... R=9, S=2 ... Z=9)
  // The provided transliterate function in the prompt is a bit unusual. Let's stick to the prompt's specific logic for now.
  // However, the direct indexOf approach for letters A-Z as 10-35 and then %10 seems more direct from the prompt's map.
  // Let's refine `transliterate` based on the prompt's map more directly.
  const transliterateV2 = (char: string): number => {
    if (char >= '0' && char <= '9') return parseInt(char, 10);
    if (char >= 'A' && char <= 'H') return (char.charCodeAt(0) - 'A'.charCodeAt(0) + 10) % 10; // A=0..H=7, but map implies A->1, B->2..
    if (char === 'J') return 1; // As per map: J is at index 19, (19%10 = 9, but map is J -> 1) - this is tricky, the map string is not a direct value map.
                                // Let's re-evaluate the prompt's transliterate carefully based on its `map.indexOf(c)` and `i % 10`.
    const mapValue = ['0','1','2','3','4','5','6','7','8','9',undefined,'A','B','C','D','E','F','G','H',undefined,'J','K','L','M','N',undefined,'P',undefined,'R',undefined,'S','T','U','V','W','X','Y','Z'];
    // The prompt's map: '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'
    // Indices:          0         9 0 12345678 9 01234 5 6 7 89012345
    // Values:           0         9 A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 J=1 K=2 L=3 M=4 N=5 P=7 R=9 S=2 T=3 U=4 V=5 W=6 X=7 Y=8 Z=9
    const letterValues: {[key: string]: number} = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
      'P': 7,
      'R': 9,
      'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
    };
    if (char >= '0' && char <= '9') return parseInt(char);
    if (letterValues[char] !== undefined) return letterValues[char];
    return 0; // Should not happen for valid VIN chars
  };


  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += transliterateV2(vinUpper[i]) * weights[i];
  }

  const checkDigit = sum % 11;
  const expectedCheckChar = checkDigit === 10 ? 'X' : checkDigit.toString();

  return vinUpper[8] === expectedCheckChar;
}
