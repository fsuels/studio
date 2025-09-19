# Georgia T-7 Overlay QA Checklist

## Inputs
- PDF: `public/forms/vehicle-bill-of-sale/georgia/T-7.pdf`
- Sample data: `ops/artifacts/document-intel-cycle-0007/georgia-overlay-sample.json`

## Steps
1. Convert the JSON payload into form data when exercising the wizard or overlay renderer. The keys match the Georgia questions (`vin`, `year`, `make`, etc.).
2. Trigger PDF generation (e.g., `npm run overlay:preview -- --doc vehicle-bill-of-sale --state ga --payload ops/artifacts/document-intel-cycle-0007/georgia-overlay-sample.json`). Ensure the command emits a filled PDF using the latest overlay.
3. Open the generated PDF and verify:
   - VIN string sits entirely on the first vehicle row baseline.
   - Year, make, and model values align with their column headers.
   - Odometer value occupies the left-most odometer cell without bleeding into the “Date of Sale” grid.
   - Sale date renders inside the three sub-cells (month/day/year) beginning in the left-most box (look for any overlap or truncation).
   - Price appears in the purchase price cell to the right of the date boxes.
   - Seller primary name and address text align with the left column; secondary column remains blank.
   - Buyer name row (Section C) sits on the long horizontal rule at y≈283, and the buyer address row at y≈224.
4. Spot-check lienholder name/address rows to ensure they remain untouched.
5. If any placements drift, note the measurement deltas and update `public/configs/us/georgia/vehicle-bill-of-sale.json` accordingly.

## Reporting
- Capture annotated screenshots of the filled PDF highlighting any misalignment.
- Record findings in the next Document Intelligence cycle summary.
