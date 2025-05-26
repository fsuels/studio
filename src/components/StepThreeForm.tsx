"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { LegalDocument } from "@/lib/document-library";
import dynamic from "next/dynamic";

const PDFPreview = dynamic(
  () => import("@/components/PDFPreview").then(mod => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 border rounded shadow bg-white flex items-center justify-center">
        <p className="text-gray-400">PDF Preview loading…</p>
      </div>
    ),
  }
);
import { Toggle } from "@/components/ui/toggle";

interface StepThreeFormProps {
  selectedDocument: LegalDocument;
  formData: Record<string,string>;
}

export function StepThreeForm({
  selectedDocument,
  formData,
}: StepThreeFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [notarize, setNotarize] = useState(false);

  useEffect(() => {
    // TODO: call PDF generation API passing selectedDocument, formData, notarize
    // and setPreviewUrl(resultingUrl)
    setPreviewUrl("");
  }, [selectedDocument, formData, notarize]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">
        Step 3: Preview & Download
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Live PDF preview */}
        <PDFPreview url={previewUrl} className="flex-1 border rounded shadow" />

        <div className="flex-1 space-y-4">
          <label className="flex items-center">
            <Toggle pressed={notarize} onPressedChange={setNotarize} />
            <span className="ml-2">Add Notarization (+$5)</span>
          </label>

          <button
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            // TODO: handle download
          >
            Download <Check className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
