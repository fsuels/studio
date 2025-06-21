import type { Resource } from 'i18next';

type Locale = 'en' | 'es';

/**
 * Dynamically import all JSON resources for a given locale.
 */
export async function loadLocaleResources(
  locale: Locale,
): Promise<Resource[string]> {
  const [
    common,
    header,
    footer,
    support,
    faq,
    documents,
    docBillOfSaleVehicle,
    docPromissoryNote,
    onlineNotary,
    electronicSignature,
  ] = await Promise.all([
    import(`../../public/locales/${locale}/common.json`).then((m) => m.default),
    import(`../../public/locales/${locale}/header.json`).then((m) => m.default),
    import(`../../public/locales/${locale}/footer.json`).then((m) => m.default),
    import(`../../public/locales/${locale}/support.json`).then(
      (m) => m.default,
    ),
    import(`../../public/locales/${locale}/faq.json`).then((m) => m.default),
    import(
      `../../public/locales/${locale}/documents/bill-of-sale-vehicle.json`
    ).then((m) => m.default),
    import(`../../public/locales/${locale}/doc_bill_of_sale_vehicle.json`).then(
      (m) => m.default,
    ),
    import(`../../public/locales/${locale}/doc_promissory_note.json`).then(
      (m) => m.default,
    ),
    import(`../../public/locales/${locale}/online-notary.json`).then(
      (m) => m.default,
    ),
    import(`../../public/locales/${locale}/electronic-signature.json`).then(
      (m) => m.default,
    ),
  ]);

  return {
    common,
    header,
    footer,
    support,
    faq,
    documents,
    doc_bill_of_sale_vehicle: docBillOfSaleVehicle,
    doc_promissory_note: docPromissoryNote,
    'online-notary': onlineNotary,
    'electronic-signature': electronicSignature,
  } as Resource[string];
}

/**
 * Load resources for all supported locales.
 */
export async function loadAllResources(): Promise<Resource> {
  const locales: Locale[] = ['en', 'es'];
  const resources: Resource = {} as Resource;
  for (const locale of locales) {
    resources[locale] = await loadLocaleResources(locale);
  }
  return resources;
}
