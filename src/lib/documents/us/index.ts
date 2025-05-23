// src/lib/documents/us/index.ts
// This file should export all US-specific documents.

export { vehicleBillOfSale } from './vehicle-bill-of-sale';
// Explicitly reference the folder index to avoid picking up the legacy
// promissory-note.ts file which lacks the full schema and question set.
export { promissoryNote } from './promissory-note/index';

// Assuming these documents are now or will be structured similarly under ./us/
export { affidavitGeneral } from './affidavit-general';
export { articlesOfIncorporationBiz } from './articles-of-incorporation-biz';
export { childCustodyAgreement } from './child-custody-agreement';
export { childMedicalConsent } from './child-medical-consent';
export { commercialLeaseAgreement } from './commercial-lease-agreement';
export { demandLetterPayment } from './demand-letter-payment';
export { divorceSettlementAgreement } from './divorce-settlement-agreement';
export { employmentOfferLetter } from './employment-offer-letter';
export { employmentTerminationLetter } from './employment-termination-letter';
export { evictionNotice } from './eviction-notice';
export { generalInquiry } from './general-inquiry';
export { healthcarePowerOfAttorney } from './healthcare-power-of-attorney';
export { independentContractorAgreement } from './independent-contractor-agreement';
export { invoice } from './invoice';
export { lastWillTestament } from './last-will-testament';
export { leaseAgreement } from './lease-agreement';
export { livingTrust } from './living-trust';
export { livingWill } from './living-will';
export { nda } from './nda';
export { nonCompeteAgreement } from './non-compete-agreement';
export { operatingAgreement } from './operating-agreement';
export { partnershipAgreement } from './partnership-agreement';
export { powerOfAttorney } from './power-of-attorney';
export { prenuptialAgreement } from './prenuptial-agreement';
export { quitclaimDeed } from './quitclaim-deed';
export { serviceAgreement } from './service-agreement';
// Add any other US-specific documents here following the same export pattern
// e.g., export { yourNewUsDoc } from './your-new-us-doc-slug';
