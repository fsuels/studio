// src/app/en/support/page.tsx
'use client'

import SupportContent from '@/components/SupportContent' 
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function EnSupportPage() {
  const { i18n } = useTranslation()

  // ensure language is set
  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en')
    }
  }, [i18n])

  return (
    // The container and main tag are now part of SupportContent
    // Pass the locale explicitly to SupportContent
    <SupportContent locale="en" />
  )
}
