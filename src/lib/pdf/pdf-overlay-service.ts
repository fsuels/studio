// src/lib/pdf/pdf-overlay-service.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { OverlayConfig } from '@/lib/config-loader';
import type { StateAbbr } from '@/lib/documents/us/vehicle-bill-of-sale/compliance';

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
/* Public API                                                          */
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

  // 2) JSON coordinates fallback
  if (overlay?.coordinates) {
    return await coordinateOverlay(doc, formData, overlay.coordinates);
  }

  // 3) Legacy TypeScript overlay
  const legacy = await loadLegacyOverlay(state);
  if (legacy) {
    return await legacyCoordinateOverlay(doc, formData, legacy.fieldMappings);
  }

  // 4) Nothing to do → return original bytes
  return normalized;
}

/* ------------------------------------------------------------------ */
/* AcroForm (priority #1)                                              */
/* ------------------------------------------------------------------ */
async function smartFieldMapping(
  doc: PDFDocument,
  data: Record<string, any>,
  cfg: OverlayConfig
): Promise<ArrayBuffer> {
  const form = doc.getForm();
  const pdfFields = new Map(form.getFields().map((f) => [f.getName(), f]));
  const mapping = cfg.fieldMapping ?? {};

  for (const [id, mapObj] of Object.entries(mapping)) {
    const fieldName = mapObj?.fieldName;
    if (!fieldName) continue;

    const value = data[id];
    const field = pdfFields.get(fieldName);
    if (value == null || !field) continue;

    try {
      if (isTextField(field)) {
        field.setText(String(value));
      } else if (isCheckBox(field)) {
        const truthy =
          value === true || value === 'true' || value === 1 || value === '1';
        truthy ? field.check() : field.uncheck();
      }
    } catch (e) {
      console.warn(`Failed to map "${id}" → "${fieldName}"`, e);
    }
  }

  const bytes = await doc.save(); // Uint8Array
  return toArrayBuffer(bytes);
}

/* ------------------------------------------------------------------ */
/* Coordinates (priority #2)                                           */
/* ------------------------------------------------------------------ */
async function coordinateOverlay(
  doc: PDFDocument,
  data: Record<string, any>,
  coords: NonNullable<OverlayConfig['coordinates']>
): Promise<ArrayBuffer> {
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const [id, c] of Object.entries(coords)) {
    if (!c) continue;
    const value = data[id] ?? data[id.replace(/_/g, '')];
    if (value == null) continue;

    const page = pages[c.page ?? 0];
    if (!page) continue;

    page.drawText(String(value), {
      x: c.x,
      y: c.y,
      size: c.fontSize ?? 10,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const bytes = await doc.save(); // Uint8Array
  return toArrayBuffer(bytes);
}

/* ------------------------------------------------------------------ */
/* Legacy overlay (priority #3)                                        */
/* ------------------------------------------------------------------ */
export interface FieldMapping {
  fieldId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  page?: number;
}

export interface StateFormOverlay {
  state: StateAbbr;
  formName: string;
  fieldMappings: FieldMapping[];
}

interface LegacyPoint {
  fieldId: string;
  x: number;
  y: number;
  page?: number;
  fontSize?: number;
}
interface LegacyOverlay {
  state: StateAbbr;
  formName: string;
  fieldMappings: LegacyPoint[];
}

async function loadLegacyOverlay(state: string): Promise<LegacyOverlay | null> {
  switch (state.toLowerCase()) {
    case 'fl':
      return (await import('@/lib/documents/us/vehicle-bill-of-sale/forms/florida/overlay'))
        .floridaOverlay;
    default:
      return null;
  }
}

async function legacyCoordinateOverlay(
  doc: PDFDocument,
  data: Record<string, any>,
  points: LegacyPoint[]
): Promise<ArrayBuffer> {
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const p of points) {
    const value = data[p.fieldId];
    if (value == null) continue;

    const page = pages[p.page ?? 0];
    if (!page) continue;

    page.drawText(String(value), {
      x: p.x,
      y: p.y,
      size: p.fontSize ?? 10,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const bytes = await doc.save(); // Uint8Array
  return toArrayBuffer(bytes);
}
