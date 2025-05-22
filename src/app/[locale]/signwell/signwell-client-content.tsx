// src/app/[locale]/signwell/signwell-client-content.tsx
'use client'
import React, { useState } from 'react';
import { createSignWellDocument } from '@/services/signwell';
import { Button } from '@/components/ui/button';

interface SignWellClientContentProps {
  params: { locale: 'en' | 'es' };
}

export default function SignWellClientContent({ params }: SignWellClientContentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const binary = Array.from(new Uint8Array(buffer))
      .map((b) => String.fromCharCode(b))
      .join('');
    const base64 = btoa(binary); // btoa is browser-only, correct here
    setLoading(true);
    try {
      const res = await createSignWellDocument(base64, file.name);
      setSignUrl(res.signingUrl || null);
    } catch (err) {
      console.error(err);
      // Optionally, inform the user about the error via a toast or message
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">SignWell Demo</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <Button onClick={upload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload to SignWell'}
      </Button>
      {signUrl && (
        <p>
          Signing Link: <a href={signUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">Open</a>
        </p>
      )}
    </main>
  );
}
