'use client';

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('@/components/shared/SearchBar'));
import { CATEGORY_LIST } from '@/components/workflow/Step1DocumentSelector';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';
const TopDocsChips = dynamic(() => import('@/components/shared/TopDocsChips'), {
  loading: () => null,
});
import { TrustBadges } from '@/components/shared';
import { FileText } from 'lucide-react';
import { AutoImage } from '@/components/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  locale: 'en' | 'es';
}

export default function TemplatesClientContent({ locale }: Props) {
  const { t } = useTranslation('common');
  const _router = useRouter();

  const categoryHref = (key: string) =>
    `/${locale}/marketplace?category=${encodeURIComponent(key)}`;

  const handleTemplatesQuizClick = useCallback(() => {
    track('templates_cta_click', {
      locale,
      surface: 'templates_quiz',
      destination: `/${locale}/generate`,
    });
  }, [locale]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">
        {t('browseTemplates.title', 'Browse Templates')}
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <SearchBar />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground text-sm mb-8 list-none">
        <li>
          ⚖️{' '}
          {t(
            'browseTemplates.point1',
            'Choose from 150+ attorney-drafted templates',
          )}
        </li>
        <li>
          🧩{' '}
          {t(
            'browseTemplates.point2',
            'Fill quickly and reduce errors with guided questions',
          )}
        </li>
        <li>
          ✍️ {t('browseTemplates.point3', 'Customize with a rich editor')}
        </li>
        <li>
          🔒{' '}
          {t(
            'browseTemplates.point4',
            'Sign and manage documents securely online',
          )}
        </li>
      </ul>

      <div className="flex justify-center mb-10">
        <AutoImage
          src="/images/hero-homepage.png"
          alt="Happy customer"
          width={400}
          height={240}
          priority
          className="rounded-lg"
        />
      </div>

      <TrustBadges className="mb-12" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          {t('browseTemplates.whatDo', 'What do you want to accomplish?')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORY_LIST.map((cat) => (
            <Button
              asChild
              key={cat.key}
              variant="outline"
              className="flex flex-col items-center gap-2 py-6"
            >
              <Link href={categoryHref(cat.key)} prefetch>
                {React.createElement(cat.icon || FileText, {
                  className: 'h-5 w-5 text-primary',
                })}
                <span className="text-sm text-card-foreground">
                  {t(cat.labelKey, cat.key)}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-4 text-foreground">
          {t('browseTemplates.featured', 'Featured Templates')}
        </h2>
        <TopDocsChips />
      </section>

      <section className="text-center">
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {t('browseTemplates.quizTitle', 'Not sure where to start?')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t(
            'browseTemplates.quizDesc',
            'Answer a few quick questions to get a recommendation.',
          )}
        </p>
        <Button asChild size="lg">
          <Link href={`/${locale}/generate`} onClick={handleTemplatesQuizClick}>
            {t('browseTemplates.takeQuiz', 'Take the Quiz →')}
          </Link>
        </Button>
      </section>
    </main>
  );
}
