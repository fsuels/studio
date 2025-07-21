import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { OverlayConfig } from '@/lib/config-loader';
import type { StateAbbr }    from '@/lib/documents/us/vehicle-bill-of-sale/compliance';

/* ------------------------------------------------------------------ */
/*  Public entry point                                                */
/* ------------------------------------------------------------------ */
export async function overlayFormData(
  pdfBytes: ArrayBuffer,
  formData: Record<string, any>,
  state: string,
  overlay?: OverlayConfig
): Promise<ArrayBuffer> {
  const doc = await PDFDocument.load(pdfBytes);

  // 1️⃣  Smart mode – the PDF actually has form fields
  if (doc.getForm().getFields().length) {
    return smartFieldMapping(doc, formData, overlay);
  }

  // 2️⃣  JSON coordinates fallback
  if (overlay?.coordinates) {
    return coordinateOverlay(doc, formData, overlay.coordinates);
  }

  // 3️⃣  Legacy TypeScript overlay (only if JSON fails)
  const legacy = await loadLegacyOverlay(state);
  if (legacy) {
    return legacyCoordinateOverlay(doc, formData, legacy.fieldMappings);
  }

  // 4️⃣  Give up – return original PDF
  return pdfBytes;
}

/* ------------------------------------------------------------------ */
/*  Smart AcroForm mapping (priority #1)                              */
/* ------------------------------------------------------------------ */
async function smartFieldMapping(
  doc: PDFDocument,
  data: Record<string, any>,
  cfg?: OverlayConfig
): Promise<ArrayBuffer> {
  const form      = doc.getForm();
  const pdfFields = new Map(form.getFields().map(f => [f.getName(), f]));
  const mapping   = cfg?.fieldMapping ?? {};        // { seller_name: {fieldName:"…"} }

  let matched = 0;
  for (const [id, { fieldName }] of Object.entries(mapping)) {
    const val = data[id];
    const pdf = pdfFields.get(fieldName);
    if (!val || !pdf) continue;

    if (pdf.constructor.name === 'PDFTextField') pdf.setText(String(val));
    if (pdf.constructor.name === 'PDFCheckBox')  (val ? pdf.check() : pdf.uncheck());
    matched++;
  }
  console.log(`SMART‑MAPPING: ${matched}/${Object.keys(mapping).length} fields set`);
  return (await doc.save()).buffer;
}

/* ------------------------------------------------------------------ */
/*  JSON coordinate overlay (priority #2)                             */
/* ------------------------------------------------------------------ */
async function coordinateOverlay(
  doc: PDFDocument,
  data: Record<string, any>,
  coords: NonNullable<OverlayConfig['coordinates']>
): Promise<ArrayBuffer> {
  const font  = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const [id, c] of Object.entries(coords)) {
    const val = data[id] ?? data[id.replace(/_/g, '')];
    if (!val) continue;
    const page = pages[c.page ?? 0];
    page.drawText(String(val), { x: c.x, y: c.y, size: c.fontSize ?? 10, font, color: rgb(0,0,0) });
  }
  return (await doc.save()).buffer;
}

/* ------------------------------------------------------------------ */
/*  Legacy TS overlay (priority #3)                                   */
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

interface LegacyPoint { fieldId: string; x: number; y: number; page?: number; fontSize?: number; }
interface LegacyOverlay { state: StateAbbr; formName: string; fieldMappings: LegacyPoint[]; }

async function loadLegacyOverlay(state: string): Promise<LegacyOverlay | null> {
  switch (state.toLowerCase()) {
    case 'fl': return (await import('@/lib/documents/us/vehicle-bill-of-sale/forms/florida/overlay')).floridaOverlay;
    // … other states
    default:   return null;
  }
}

async function legacyCoordinateOverlay(
  doc: PDFDocument,
  data: Record<string, any>,
  points: LegacyPoint[]
): Promise<ArrayBuffer> {
  const font  = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const p of points) {
    const val = data[p.fieldId];
    if (!val) continue;
    pages[p.page ?? 0].drawText(String(val), {
      x: p.x, y: p.y, size: p.fontSize ?? 10, font, color: rgb(0,0,0)
    });
  }
  return (await doc.save()).buffer;
}