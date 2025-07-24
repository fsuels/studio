# Runtime Audit - DEBUG-A Implementation

## Purpose
Prove whether the wizard's question IDs match the overlay keys and whether onOverlay is actually invoked.

## Debug Changes Made

### 1. StatePDFPreview.tsx (Line 44-51)
Added runtime audit console group that shows:
- `docConfig.questions` - Array of question IDs from the dynamically loaded config
- `overlay.fieldMapping keys` - Keys from the overlay fieldMapping configuration  
- `overlay.coordinates keys` - Keys from the overlay coordinates configuration
- `formData live` - Current form data values

### 2. pdf-overlay-service.ts (Line 48)
Added debug log in `smartFieldMapping` function:
- `▶️ applying fieldMapping with keys` - Shows which fieldMapping keys are being processed

## Manual Testing Instructions

1. **Open browser and navigate to**: `/en/docs/vehicle-bill-of-sale/start`

2. **Open DevTools** (F12) and go to Console tab

3. **Select FL (Florida)** as the state

4. **Fill the first field** (e.g., type "Jane Seller" in the seller name field)

5. **Look for console output**:
   - **🚑 Runtime audit** (collapsed group) - Contains the key alignment data
   - **▶️ applying fieldMapping with keys** - Shows overlay function is being called

## Expected Results

If everything is working correctly, you should see:

### Question IDs vs Overlay Keys Match:
```javascript
docConfig.questions: ['seller_name', 'buyer_name', 'year', 'make', 'vin', ...]
overlay.fieldMapping keys: ['seller_name', 'buyer_name', 'year', 'make', 'vin', ...]
```

### Overlay Function Called:
```javascript
▶️ applying fieldMapping with keys ['seller_name', 'buyer_name', 'year', 'make', 'vin', ...]
```

### Form Data Populated:
```javascript
formData live: { seller_name: "Jane Seller", state: "FL" }
```

## Troubleshooting

- **If 🚑 Runtime audit shows empty arrays**: Dynamic question loading failed
- **If ▶️ applying fieldMapping never logs**: onOverlay callback not being invoked
- **If keys don't match**: Question generator and overlay have different field IDs

## Cleanup
These are temporary debugging additions - remove before production deployment.