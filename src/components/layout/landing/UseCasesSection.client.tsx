'use client';
import React from 'react';
import Link from 'next/link';
import { Briefcase, Home, Building2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const cases = [
  {
    icon: Briefcase,
    titleKey: 'useCases.freelancers.title',
    docsKey: 'useCases.freelancers.docs',
    defaultTitle: 'For Freelancers',
    defaultDocs: 'NDAs, Client Contracts',
    href: (locale: string) => `/${locale}/docs/nda`,
  },
  {
    icon: Home,
    titleKey: 'useCases.landlords.title',
    docsKey: 'useCases.landlords.docs',
    defaultTitle: 'For Landlords',
    defaultDocs: 'Leases, Eviction Notices',
    href: (locale: string) => `/${locale}/docs/leaseAgreement`,
  },
  {
    icon: Building2,
    titleKey: 'useCases.smallBusiness.title',
    docsKey: 'useCases.smallBusiness.docs',
    defaultTitle: 'For Small Businesses',
    defaultDocs: 'Operating Agreements, Invoices',
    href: (locale: string) => `/${locale}/docs/operating-agreement`,
  },
  {
    icon: Users,
    titleKey: 'useCases.families.title',
    docsKey: 'useCases.families.docs',
    defaultTitle: 'For Families',
    defaultDocs: 'Wills, Power of Attorney',
    href: (locale: string) => `/${locale}/docs/last-will-testament`,
  },
];

export const UseCasesSection = React.memo(function UseCasesSection() {
  const { t } = useTranslation('common');
  const params = useParams<{ locale?: string }>();
  const locale = (params?.locale as 'en' | 'es') || 'en';

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cases.map((c) => {
          const Icon = c.icon;
          return (
            <Link href={c.href(locale)} key={c.titleKey} className="group">
              <div className="p-6 bg-card rounded-xl border border-border shadow-sm transition-transform group-hover:scale-105">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  {t(c.titleKey, { defaultValue: c.defaultTitle })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(c.docsKey, { defaultValue: c.defaultDocs })}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
