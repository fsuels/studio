// components/Nav.tsx
'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Nav() {
  const { t } = useTranslation()

  return (
    <nav className="flex gap-6 text-sm font-medium text-gray-700">
      <Link href="/pricing" className="hover:text-primary">{t('nav.pricing')}</Link>
      <Link href="/features" className="hover:text-primary">{t('nav.features')}</Link>
      {/* <Link href="/resources" className="hover:text-primary">{t('nav.resources')}</Link> */} {/* Resources page doesn't exist yet */}
      {/* <Link href="/blog" className="hover:text-primary">{t('nav.blog')}</Link> */} {/* Blog page doesn't exist yet */}
      <Link href="/faq" className="hover:text-primary">{t('nav.faq')}</Link>
      <Link href="/support" className="hover:text-primary">{t('nav.support')}</Link>
    </nav>
  )
}
