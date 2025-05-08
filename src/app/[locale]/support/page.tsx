// src/app/es/support/page.tsx
'use client'

import SupportContent from '@/components/SupportContent' 
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function EsSupportPage() {
  const { i18n } = useTranslation()

  // ensure language is set
  useEffect(() => {
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es')
    }
  }, [i18n])

  return (
    // The container and main tag are now part of SupportContent
    // Pass the locale explicitly to SupportContent
    <SupportContent locale="es" />
  )
}
