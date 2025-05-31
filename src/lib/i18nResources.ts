import type { Resource } from 'i18next';

import enCommon from '../../public/locales/en/common.json';
import enHeader from '../../public/locales/en/header.json';
import enFooter from '../../public/locales/en/footer.json';
import enSupport from '../../public/locales/en/support.json';
import enFaq from '../../public/locales/en/faq.json';
import enDocuments from '../../public/locales/en/documents/bill-of-sale-vehicle.json';
import enDocBillOfSaleVehicle from '../../public/locales/en/doc_bill_of_sale_vehicle.json';
import enDocPromissoryNote from '../../public/locales/en/doc_promissory_note.json';
import enOnlineNotary from '../../public/locales/en/online-notary.json';
import enElectronicSignature from '../../public/locales/en/electronic-signature.json';

import esCommon from '../../public/locales/es/common.json';
import esHeader from '../../public/locales/es/header.json';
import esFooter from '../../public/locales/es/footer.json';
import esSupport from '../../public/locales/es/support.json';
import esFaq from '../../public/locales/es/faq.json';
import esDocuments from '../../public/locales/es/documents/bill-of-sale-vehicle.json';
import esDocBillOfSaleVehicle from '../../public/locales/es/doc_bill_of_sale_vehicle.json';
import esDocPromissoryNote from '../../public/locales/es/doc_promissory_note.json';
import esOnlineNotary from '../../public/locales/es/online-notary.json';
import esElectronicSignature from '../../public/locales/es/electronic-signature.json';

export const resources: Resource = {
  en: {
    common: enCommon,
    header: enHeader,
    footer: enFooter,
    support: enSupport,
    faq: enFaq,
    documents: enDocuments,
    doc_bill_of_sale_vehicle: enDocBillOfSaleVehicle,
    doc_promissory_note: enDocPromissoryNote,
    online_notary: enOnlineNotary,
    'electronic-signature': enElectronicSignature,
  },
  es: {
    common: esCommon,
    header: esHeader,
    footer: esFooter,
    support: esSupport,
    faq: esFaq,
    documents: esDocuments,
    doc_bill_of_sale_vehicle: esDocBillOfSaleVehicle,
    doc_promissory_note: esDocPromissoryNote,
    online_notary: esOnlineNotary,
    'electronic-signature': esElectronicSignature,
  },
};

export default resources;
