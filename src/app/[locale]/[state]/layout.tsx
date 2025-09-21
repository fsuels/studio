import { Suspense, type ReactNode } from "react";
import { ClientProviders } from "@/components/providers/ClientProviders";
import LanguageSwitch from "@/components/global/LanguageSwitch";
import { Layout } from "@/components/layout/Layout";

interface StateLayoutProps {
  children: ReactNode;
  params: { locale?: string };
}

export default function StateLayout({ children, params }: StateLayoutProps) {
  const detectedLocale = params.locale === "es" ? "es" : "en";

  return (
    <ClientProviders locale={detectedLocale}>
      <Suspense fallback={null}>
        <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
      </Suspense>
      <Suspense fallback={null}>
        <Layout>{children}</Layout>
      </Suspense>
    </ClientProviders>
  );
}