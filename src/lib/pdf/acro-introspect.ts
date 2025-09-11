// src/lib/pdf/acro-introspect.ts
// Build an OverlayConfig dynamically by introspecting a PDF's AcroForm fields.

import { PDFDocument } from 'pdf-lib';
import type { OverlayConfig } from '@/lib/config-loader/schemas';

export interface AcroFieldInfo {
  name: string;
  kind: 'text' | 'checkbox' | 'radio' | 'button' | 'combo' | 'list' | 'unknown';
}

function detectKind(field: any): AcroFieldInfo['kind'] {
  const ctor = (field as any)?.constructor?.name || '';
  switch (ctor) {
    case 'PDFTextField':
      return 'text';
    case 'PDFCheckBox':
      return 'checkbox';
    case 'PDFRadioGroup':
      return 'radio';
    case 'PDFButton':
      return 'button';
    case 'PDFDropdown':
      return 'combo';
    case 'PDFOptionList':
      return 'list';
    default:
      return 'unknown';
  }
}

export async function introspectAcroFieldsFromUrl(pdfUrl: string): Promise<AcroFieldInfo[]> {
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`Failed to fetch PDF at ${pdfUrl}`);
  const bytes = await res.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const fields = form.getFields();
  return fields.map((f: any) => ({ name: f.getName(), kind: detectKind(f) }));
}

/**
 * Create a minimal overlay config from a PDF with AcroForm fields.
 * Uses identity mapping (question id === PDF field name) so overlay filling is trivial.
 */
export async function buildOverlayFromAcro(pdfUrl: string): Promise<OverlayConfig> {
  const fields = await introspectAcroFieldsFromUrl(pdfUrl);
  const mapping: Record<string, { fieldName: string }> = {};
  for (const f of fields) {
    // normalize id: keep as PDF field name to match form exactly
    mapping[f.name] = { fieldName: f.name };
  }
  return {
    pdfPath: pdfUrl,
    fieldMapping: mapping,
  } as OverlayConfig;
}

