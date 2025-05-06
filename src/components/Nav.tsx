// components/Nav.tsx
'use client'

import { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import CartDrawer from '@/components/CartDrawer'

export default function Nav() {
  const { t } = useTranslation()
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  // Placeholder text while hydrating
  const placeholderText = '...';

  return (    
    <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
        <Link href="/pricing" className="hover:text-primary">{isHydrated ? t('nav.pricing') : placeholderText}</Link>
        <Link href="/features" className="hover:text-primary">{isHydrated ? t('nav.features') : placeholderText}</Link>
        {/* <Link href="/resources" className="hover:text-primary">{t('nav.resources')}</Link> */} {/* Resources page doesn't exist yet */}
        {/* <Link href="/blog" className="hover:text-primary">{t('nav.blog')}</Link> */} {/* Blog page doesn't exist yet */}
        <Link href="/faq" className="hover:text-primary">{isHydrated ? t('nav.faq') : placeholderText}</Link>
        <Link href="/support" className="hover:text-primary">{isHydrated ? t('nav.support') : placeholderText}</Link>
        <CartDrawer />
    </nav>
  )
}
