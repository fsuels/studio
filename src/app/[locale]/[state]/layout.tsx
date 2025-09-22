import { Suspense, type ReactNode } from "react";
import { ClientProviders } from "@/components/providers/ClientProviders";
import LanguageSwitch from "@/components/global/LanguageSwitch";
import { Layout } from "@/components/layout/Layout";

interface StateLayoutProps {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}

export default async function StateLayout({ children, params }: StateLayoutProps) {
  const resolvedParams = await params;
  const detectedLocale = resolvedParams?.locale === "es" ? "es" : "en";

  return (
    <Suspense fallback={null}>
      <ClientProviders locale={detectedLocale}>
        <Suspense fallback={null}>
          <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
        </Suspense>
        <Suspense fallback={null}>
          <Layout>{children}</Layout>
        </Suspense>
      </ClientProviders>
    </Suspense>
  );
}