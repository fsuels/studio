tsx
import React, { useState, useEffect } from 'react';
import { documentLibrary, LegalDocument } from '@/lib/document-library';
import { PDFPreview } from '@/components/pdf-preview';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';

interface StepThreeFormProps {
  state: string;
  category: string;
  templateId: string;
}

export const StepThreeForm: React.FC<StepThreeFormProps> = ({
  state,
  category,
  templateId,
}) => {
  // Find the chosen template
  const doc = documentLibrary.find(d => d.id === templateId) as LegalDocument;

  // Local form state
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [upsells, setUpsells] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        doc.upsellClauses.map(c => [c.id, false])
      )
  );
  const [includeNotarization, setIncludeNotarization] = useState(false);
  const [includeRecording, setIncludeRecording] = useState(false);

  // Update preview when answers or upsells change
  useEffect(() => {
    // trigger PDF regen in PDFPreview via props
  }, [answers, upsells, includeNotarization, includeRecording]);

  const handleChange = (id: string, value: any) => {
    setAnswers(a => ({ ...a, [id]: value }));
  };

  const totalPrice = [
    doc.basePrice,
    includeNotarization && doc.offerNotarization ? doc.basePrice * 0.5 : 0,
    includeRecording && doc.offerRecordingHelp ? doc.basePrice * 0.5 : 0,
    ...doc.upsellClauses
      .filter(c => upsells[c.id])
      .map(c => c.price),
  ].reduce((sum, p) => sum + (p as number), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: form */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Step 3 of 3 — Customize & Download
        </h2>

        <form className="space-y-6">
          {/* Placeholder fields */}
          {doc.questions.map(q => (
            <div key={q.id}>
              <label className="block mb-1 font-medium">{q.label}</label>
              {q.type === 'textarea' ? (
                <textarea
                  placeholder={q.placeholder}
                  required={q.required}
                  value={answers[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  className="w-full border rounded p-2 focus:ring"
                />
              ) : (
                <input
                  type="text"
                  placeholder={q.placeholder}
                  required={q.required}
                  value={answers[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  className="w-full border rounded p-2 focus:ring"
                />
              )}
            </div>
          ))}

          {/* Upsells */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Optional Add-Ons</h3>
            {doc.offerNotarization && (
              <Toggle
                label="Add Notarization"
                checked={includeNotarization}
                onCheckedChange={setIncludeNotarization}
                helperText="+50% base price"
              />
            )}
            {doc.offerRecordingHelp && (
              <Toggle
                label="Recording Assistance"
                checked={includeRecording}
                onCheckedChange={setIncludeRecording}
                helperText="+50% base price"
              />
            )}
            {doc.upsellClauses.map(c => (
              <Toggle
                key={c.id}
                label={c.description}
                checked={upsells[c.id]}
                onCheckedChange={on => setUpsells(u => ({ ...u, [c.id]: on }))}
                helperText={`+\$${c.price.toFixed(2)}`}
              />
            ))}
          </div>

          {/* Price & Next */}
          <div className="pt-4 border-t flex items-center justify-between">
            <span className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </span>
            <Button onClick={() => {/* trigger payment flow */}}>
              Review & Pay
            </Button>
          </div>
        </form>
      </div>

      {/* Right: live PDF preview */}
      <div>
        <PDFPreview
          templateId={templateId}
          answers={answers}
          upsells={{
            includeNotarization,
            includeRecording,
            clauses: Object.keys(upsells).filter(k => upsells[k]),
          }}
          className="border rounded shadow p-2 h-full"
        />
      </div>
    </div>
  );
};