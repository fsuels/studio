// src/app/[locale]/features/features-client-content.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { Bot, ListChecks, Building, Languages, FileText, Share2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import React from 'react';

// Feature sub-component
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// This is the main content component that uses client-side hooks
export default function FeaturesClientContent() {
  const { t } = useTranslation();

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">{t('features.title', 'Key Features')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">{t('features.subtitle', 'Powerful tools to simplify your legal document workflow.')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Feature icon={<Bot className="h-8 w-8 text-primary" />} title={t('features.items.ai.title', 'AI Document Inference')} desc={t('features.items.ai.desc', 'Smart suggestions based on your needs.')} />
        <Feature icon={<ListChecks className="h-8 w-8 text-primary" />} title={t('features.items.forms.title', 'Dynamic Questionnaires')} desc={t('features.items.forms.desc', 'Guided questions tailored to your chosen document.')} />
        <Feature icon={<Building className="h-8 w-8 text-primary" />} title={t('features.items.local.title', 'State-Specific Clauses')} desc={t('features.items.local.desc', 'Documents adapted for U.S. state laws.')} />
        <Feature icon={<Languages className="h-8 w-8 text-primary" />} title={t('features.items.bilingual.title', 'Bilingual Support (EN/ES)')} desc={t('features.items.bilingual.desc', 'Full interface and support in English & Spanish.')} />
        <Feature icon={<FileText className="h-8 w-8 text-primary" />} title={t('features.items.pdf.title', 'Instant PDF Generation')} desc={t('features.items.pdf.desc', 'Preview and download professional PDFs.')} />
        <Feature icon={<Share2 className="h-8 w-8 text-primary" />} title={t('features.items.sharing.title', 'Secure Sharing')} desc={t('features.items.sharing.desc', 'Share documents with time-limited links (coming soon).')} />
        <Feature icon={<LayoutDashboard className="h-8 w-8 text-primary" />} title={t('features.items.dashboard.title', 'User Dashboard')} desc={t('features.items.dashboard.desc', 'Manage your documents and settings easily.')} />
        <Feature icon={<ShieldCheck className="h-8 w-8 text-primary" />} title={t('features.items.security.title', 'Privacy & Security')} desc={t('features.items.security.desc', 'Encrypted data and compliant practices.')} />
      </div>
    </main>
  )
}
