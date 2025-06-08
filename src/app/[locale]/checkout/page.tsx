// src/app/[locale]/checkout/page.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createCheckoutSession } from '@/services/stripe' // your own helper

export default function CheckoutPage() {
  const searchParams = useSearchParams()            // ← may be null
  const docId = searchParams?.get('docId') ?? ''    // ← safe default to empty string
  const router = useRouter()

  useEffect(() => {
    // if there's no docId, send them home
    if (!docId) {
      router.push(`/${router.locale}`)
      return
    }

    // otherwise kick off payment
    ;(async () => {
      try {
        const { url } = await createCheckoutSession(docId)
        window.location.href = url
      } catch (err) {
        console.error('Checkout session failed', err)
        router.push(`/${router.locale}`)
      }
    })()
  }, [docId, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to payment…</p>
    </div>
  )
}
