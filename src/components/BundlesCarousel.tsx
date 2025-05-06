'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react'
import type { Bundle } from '@/data/bundles'

interface Props {
  max?: number
}

export default function BundlesCarousel({ max = 6 }: Props) {
  const [bundles, setBundles] = useState<Bundle[] | null>(null)

  useEffect(() => {
    const load = async () => {
      // ① Try Firestore, fallback to local static list
      const { loadBundles } = await import('@/lib/firestore/bundles')
        .catch(() => ({ loadBundles: null }))

      if (loadBundles) {
        setBundles(await loadBundles(max))
      } else {
        const { bundles } = await import('@/data/bundles')
        setBundles(bundles.slice(0, max))
      }
    }
    load().catch(console.error)
  }, [max])

  /* ---------- UI states ----------------------------------- */
  if (bundles === null) {
    return (
      <div className="flex items-center gap-2 py-10 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading bundles…</span>
      </div>
    )
  }

  if (!bundles.length) return null

  /* ---------- Carousel ------------------------------------ */
  return (
    <section className="w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 px-1">Popular bundles</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {bundles.map(b => (
          <motion.div key={b.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.1}}>
            <Card
              className="card-hover min-w-[260px] w-64 shrink-0 border border-border shadow-sm"
            >
              {b.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.imageUrl} alt={b.name} className="h-32 w-full object-cover rounded-t" data-ai-hint="legal document bundle" />
              )}

              <CardHeader className="pb-1">
                <CardTitle className="text-base">{b.name}</CardTitle>
                <CardDescription>{b.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-1 pb-4">
              <p className="text-sm font-medium mb-3">
                <span className="text-primary">${(b.priceCents / 100).toFixed(2)}</span>{' '}
                <span className="text-muted-foreground"> · {b.docIds.length} docs</span>
              </p>

              <Link href={`/bundle/${b.id}`} prefetch={false}>
                <Button size="sm" className="w-full">View bundle</Button>
              </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
