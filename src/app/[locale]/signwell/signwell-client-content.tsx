// src/app/[locale]/signwell/signwell-client-content.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSignWellDocument } from '@/services/signwell'
import { useTranslation } from 'react-i18next'

interface Props { locale: 'en' | 'es' }

export default function SignwellClientContent({ locale }: Props) {
  const { t } = useTranslation('common')
  const [file, setFile] = useState<File | null>(null)
  const [signUrl, setSignUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8 = new Uint8Array(arrayBuffer)
      const binary = Array.from(uint8).map(b => String.fromCharCode(b)).join('')
      const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64')
      const res = await createSignWellDocument(base64, file.name)
      setSignUrl(res.signingUrl || null)
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {t('signwell.title', 'Send & Sign Documents with SignWell')}
      </h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        {t('signwell.subtitle', 'Upload a contract or choose a template and get it signed in minutes.')}
      </p>
      <div className="flex flex-col gap-3 max-w-md">
        <Input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <Button onClick={handleUpload} disabled={!file || loading}>
          {loading ? t('pdfPreview.signingButton', 'Signing...') : t('upload', 'Upload')}
        </Button>
        {signUrl && (
          <a href={signUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
            {t('signwell.openLink', 'Open Signing Link')}
          </a>
        )}
      </div>
    </main>
  )
}
