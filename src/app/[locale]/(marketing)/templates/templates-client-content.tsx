"use client";

import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FileText, FileCheck, Mail, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import AutoImage from "@/components/shared/media/AutoImage";

const SearchBar = dynamic(() => import("@/components/shared/SearchBar"));
const TopDocsChips = dynamic(() => import("@/components/shared/TopDocsChips"), {
  loading: () => null,
});
const TrustBadges = dynamic(() => import("@/components/shared/TrustBadges"), {
  ssr: false,
  loading: () => null,
});

const TEMPLATE_CATEGORIES = [
  {
    id: "agreements-contracts",
    labelKey: "agreements",
    icon: FileText,
  },
  {
    id: "letters-notices",
    labelKey: "letters",
    icon: Mail,
  },
  {
    id: "forms-authorizations",
    labelKey: "forms",
    icon: FileCheck,
  },
  {
    id: "family-personal",
    labelKey: "family",
    icon: Users,
  },
  {
    id: "business-commercial",
    labelKey: "business",
    icon: Building,
  },
] as const;

const HIGHLIGHT_POINTS: Array<{ key: string; fallback: string }> = [
  {
    key: "browseTemplates.point1",
    fallback: "Choose from 150+ attorney-drafted templates",
  },
  {
    key: "browseTemplates.point2",
    fallback: "Fill quickly and reduce errors with guided questions",
  },
  {
    key: "browseTemplates.point3",
    fallback: "Customize with a rich editor",
  },
  {
    key: "browseTemplates.point4",
    fallback: "Sign and manage documents securely online",
  },
];

interface TemplatesClientContentProps {
  locale: "en" | "es";
}

export default function TemplatesClientContent({
  locale,
}: TemplatesClientContentProps) {
  const { t } = useTranslation("common");

  const categoryHref = (categoryId: string) =>
    `/${locale}/category/${encodeURIComponent(categoryId)}`;

  const handleTemplatesQuizClick = useCallback(() => {
    track("templates_cta_click", {
      locale,
      surface: "templates_quiz",
      destination: `/${locale}/generate`,
    });
  }, [locale]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">
        {t("browseTemplates.title", "Browse Templates")}
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <SearchBar />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground text-sm mb-8 list-disc list-inside">
        {HIGHLIGHT_POINTS.map((point) => (
          <li key={point.key}>{t(point.key, point.fallback)}</li>
        ))}
      </ul>

      <div className="flex justify-center mb-10">
        <AutoImage
          src="/images/hero-homepage.png"
          alt={t(
            "browseTemplates.heroAlt",
            "Team collaborating on legal documents",
          )}
          width={400}
          height={240}
          priority
          className="rounded-lg"
        />
      </div>

      <TrustBadges className="mb-12" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          {t("browseTemplates.whatDo", "What do you want to accomplish?")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              asChild
              key={category.id}
              variant="outline"
              className="flex flex-col items-center gap-2 py-6"
            >
              <Link href={categoryHref(category.id)} prefetch>
                {React.createElement(category.icon ?? FileText, {
                  className: "h-5 w-5 text-primary",
                })}
                <span className="text-sm text-card-foreground">
                  {t(category.labelKey, category.id)}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-4 text-foreground">
          {t("browseTemplates.featured", "Featured Templates")}
        </h2>
        <TopDocsChips locale={locale} />
      </section>

      <section className="text-center">
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {t("browseTemplates.quizTitle", "Not sure where to start?")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t(
            "browseTemplates.quizDesc",
            "Answer a few quick questions to get a recommendation.",
          )}
        </p>
        <Button asChild size="lg">
          <Link href={`/${locale}/generate`} onClick={handleTemplatesQuizClick}>
            {t("browseTemplates.takeQuiz", "Take the Quiz")}
          </Link>
        </Button>
      </section>
    </main>
  );
}
