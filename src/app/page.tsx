import React from 'react'
import DocumentFlow from '@/components/DocumentFlow'
import RecentDocs    from '@/components/RecentDocs'
import BundlesCarousel from '@/components/BundlesCarousel';
import BundleSlider from '@/components/BundleSlider';

export default function Page() {
  // 🔐 swap with your real auth hook / context
  const user = { uid: 'user_id' }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create&nbsp;Your&nbsp;Legal&nbsp;Document
      </h1>

      {/* New bundle slider */}
      <BundleSlider/>

      {/* 1️⃣  Recently used */}
      <RecentDocs userId={user?.uid} />

      {/* 2️⃣  Bundle / upsell carousel */}
      <BundlesCarousel />

      {/* 3️⃣  Main flow */}
      <DocumentFlow />
    </main>
  )
}
