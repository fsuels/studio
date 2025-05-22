'use client'
import React, { useState } from 'react';
import { createSignWellDocument } from '@/services/signwell';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function SignWellPage({ params }: { params: { locale: 'en' | 'es' } }) {
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
    const base64 = btoa(binary);
    setLoading(true);
    try {
      const res = await createSignWellDocument(base64, file.name);
      setSignUrl(res.signingUrl || null);
    } catch (err) {
      console.error(err);
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
          Signing Link: <a href={signUrl} target="_blank" className="underline text-primary">Open</a>
        </p>
      )}
    </main>
  );
}
