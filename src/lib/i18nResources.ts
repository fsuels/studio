import type { Resource } from 'i18next';

type Locale = 'en' | 'es';

/**
 * Dynamically import JSON resources for a given locale.
 * Only the namespaces requested will be imported to reduce JS and JSON payload.
 */
export async function loadLocaleResources(
  locale: Locale,
  namespaces?: string[],
): Promise<Resource[string]> {
  const ns = new Set(
    namespaces ?? [
      'common',
      'header',
      'footer',
      'support',
      'faq',
      'documents',
      'doc_bill_of_sale_vehicle',
      'doc_promissory_note',
      'online-notary',
      'electronic-signature',
    ],
  );

  const importTasks: Array<Promise<void>> = [];
  const out: Record<string, unknown> = {};

  if (ns.has('common')) {
    importTasks.push(
      import(`../../public/locales/${locale}/common.json`).then((m) => {
        out.common = m.default;
      }),
    );
  }
  if (ns.has('header')) {
    importTasks.push(
      import(`../../public/locales/${locale}/header.json`).then((m) => {
        out.header = m.default;
      }),
    );
  }
  if (ns.has('footer')) {
    importTasks.push(
      import(`../../public/locales/${locale}/footer.json`).then((m) => {
        out.footer = m.default;
      }),
    );
  }
  if (ns.has('support')) {
    importTasks.push(
      import(`../../public/locales/${locale}/support.json`).then((m) => {
        out.support = m.default;
      }),
    );
  }
  if (ns.has('faq')) {
    importTasks.push(
      import(`../../public/locales/${locale}/faq.json`).then((m) => {
        out.faq = m.default;
      }),
    );
  }
  if (ns.has('documents')) {
    // Historical: "documents" mapped to the bill-of-sale file
    importTasks.push(
      import(
        `../../public/locales/${locale}/documents/bill-of-sale-vehicle.json`
      ).then((m) => {
        (out as any).documents = m.default;
      }),
    );
  }
  if (ns.has('doc_bill_of_sale_vehicle')) {
    importTasks.push(
      import(
        `../../public/locales/${locale}/doc_bill_of_sale_vehicle.json`
      ).then((m) => {
        (out as any).doc_bill_of_sale_vehicle = m.default;
      }),
    );
  }
  if (ns.has('doc_promissory_note')) {
    importTasks.push(
      import(
        `../../public/locales/${locale}/doc_promissory_note.json`
      ).then((m) => {
        (out as any).doc_promissory_note = m.default;
      }),
    );
  }
  if (ns.has('online-notary')) {
    importTasks.push(
      import(`../../public/locales/${locale}/online-notary.json`).then((m) => {
        (out as any)['online-notary'] = m.default;
      }),
    );
  }
  if (ns.has('electronic-signature')) {
    importTasks.push(
      import(
        `../../public/locales/${locale}/electronic-signature.json`
      ).then((m) => {
        (out as any)['electronic-signature'] = m.default;
      }),
    );
  }

  await Promise.all(importTasks);
  return out as Resource[string];
}

/**
 * Load resources for all supported locales (full set of namespaces).
 */
export async function loadAllResources(): Promise<Resource> {
  const locales: Locale[] = ['en', 'es'];
  const resources: Resource = {} as Resource;
  for (const locale of locales) {
    resources[locale] = await loadLocaleResources(locale);
  }
  return resources;
}
