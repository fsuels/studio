// src/lib/pdf/pdf-overlay-service.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { OverlayConfig } from '@/lib/config-loader';

/**
 * Only accept ArrayBuffer | Uint8Array, never ArrayBufferLike.
 * That guarantees SharedArrayBuffer cannot flow into our types.
 */
type BinaryInput = ArrayBuffer | Uint8Array;

/* ------------------------------------------------------------------ */
/* Small, *typed* helpers                                              */
/* ------------------------------------------------------------------ */

function normalizeToArrayBuffer(bytes: BinaryInput): ArrayBuffer {
  // Both branches explicitly return ArrayBuffer, so TS cannot infer a union.
  return bytes instanceof ArrayBuffer
    ? bytes
    : bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function isTextField(field: any): field is { setText: (v: string) => void } {
  return typeof field?.setText === 'function';
}
function isCheckBox(field: any): field is { check: () => void; uncheck: () => void } {
  return typeof field?.check === 'function' && typeof field?.uncheck === 'function';
}

/* ------------------------------------------------------------------ */
/* Main overlay function                                               */
/* ------------------------------------------------------------------ */

export async function overlayFormData(
  pdfBytes: BinaryInput,
  formData: Record<string, any>,
  state: string,
  overlay?: OverlayConfig
): Promise<ArrayBuffer> {
  // Force the compiler to see a plain ArrayBuffer
  const normalized: ArrayBuffer = normalizeToArrayBuffer(pdfBytes);

  const doc = await PDFDocument.load(normalized, { ignoreEncryption: true });
  const hasFormFields = doc.getForm().getFields().length > 0;

  // 1) Prefer AcroForm fieldMapping when both exist
  if (hasFormFields && overlay?.fieldMapping) {
    return await smartFieldMapping(doc, formData, overlay);
  }

  // 2) Coordinate overlay (manual positioning)
  if (overlay?.coordinates) {
    return await coordinateOverlay(doc, formData, overlay.coordinates);
  }

  // 3) Nothing to do → return original bytes
  return normalized;
}

/* ------------------------------------------------------------------ */
/* Strategy 1: Smart AcroForm field mapping                           */
/* ------------------------------------------------------------------ */

async function smartFieldMapping(
  doc: PDFDocument,
  formData: Record<string, any>,
  overlay: OverlayConfig
): Promise<ArrayBuffer> {
  const form = doc.getForm();
  const allFields = form.getFields();

  console.log(`🔍 PDF has ${allFields.length} form fields`);

  if (!overlay.fieldMapping) {
    console.warn('⚠️ No fieldMapping provided for AcroForm overlay');
    return toArrayBuffer(await doc.save());
  }

  for (const [fieldId, mapping] of Object.entries(overlay.fieldMapping)) {
    const value = formData[fieldId];
    if (value == null) continue;

    const fieldName = mapping.fieldName;
    if (!fieldName) continue;

    try {
      const field = form.getField(fieldName);

      if (isTextField(field)) {
        let text = String(value ?? '');
        const lowerId = fieldId.toLowerCase();
        // Heuristic formatting for common fields
        if (lowerId.includes('price') || lowerId.includes('amount')) {
          const n = Number(value);
          if (!Number.isNaN(n)) text = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
        } else if (lowerId.includes('date')) {
          try {
            const d = new Date(value);
            if (!Number.isNaN(d.getTime())) text = d.toLocaleDateString('en-US');
          } catch {}
        } else if (lowerId === 'vin') {
          text = text.toUpperCase();
        }
        field.setText(text);
      } else if (isCheckBox(field)) {
        if (value === true || value === 'true' || value === 1) {
          field.check();
        } else {
          field.uncheck();
        }
      }

      console.log(`✅ Filled field "${fieldName}" with "${value}"`);
    } catch (error) {
      console.warn(`⚠️ Could not find/fill field "${fieldName}":`, error);
    }
  }

  const bytes = await doc.save();
  return toArrayBuffer(bytes);
}

/* ------------------------------------------------------------------ */
/* Strategy 2: Coordinate overlay (manual positioning)                */
/* ------------------------------------------------------------------ */

async function coordinateOverlay(
  doc: PDFDocument,
  formData: Record<string, any>,
  coordinates: Record<string, any>
): Promise<ArrayBuffer> {
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const [fieldId, coord] of Object.entries(coordinates)) {
    const value = formData[fieldId];
    if (value == null) continue;

    if (!coord || typeof coord !== 'object') continue;

    const page = pages[coord.page ?? 0];
    if (!page) continue;

    let text = String(value ?? '');
    const lowerId = fieldId.toLowerCase();
    if (lowerId.includes('price') || lowerId.includes('amount')) {
      const n = Number(value);
      if (!Number.isNaN(n)) text = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    } else if (lowerId.includes('date')) {
      try {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) text = d.toLocaleDateString('en-US');
      } catch {}
    } else if (lowerId === 'vin') {
      text = text.toUpperCase();
    }

    page.drawText(text, {
      x: coord.x,
      y: coord.y,
      size: coord.fontSize ?? 10,
      font,
      color: rgb(0, 0, 0),
    });

    console.log(`✅ Drew "${value}" at (${coord.x}, ${coord.y}) on page ${coord.page ?? 0}`);
  }

  const bytes = await doc.save();
  return toArrayBuffer(bytes);
}
