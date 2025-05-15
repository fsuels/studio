// -----------------------------------------------------------------------------
// Barrel of U.S. LegalDocument **objects**.
// ONLY re-export the LegalDocument instances – never schemas/questions –
// so `import * as us from "@/lib/documents/us"` returns pure data.
// -----------------------------------------------------------------------------

export { vehicleBillOfSale } from './vehicle-bill-of-sale'; // Changed to export the aliased object
export { promissoryNote }    from './promissory-note';    // Changed to export the aliased object

export { demandLetterPayment }            from '../demand-letter-payment';
export { independentContractorAgreement } from '../independent-contractor-agreement';
export { serviceAgreement }               from '../service-agreement';
export { nda }                            from '../nda';
export { nonCompeteAgreement }            from '../non-compete-agreement';
export { partnershipAgreement }           from '../partnership-agreement';
export { operatingAgreement }             from '../operating-agreement';
export { articlesOfIncorporationBiz }     from '../articles-of-incorporation-biz';
export { employmentOfferLetter }          from '../employment-offer-letter';
export { employmentTerminationLetter }    from '../employment-termination-letter';
export { leaseAgreement }                 from '../lease-agreement';
export { commercialLeaseAgreement }       from '../commercial-lease-agreement';
export { evictionNotice }                 from '../eviction-notice';
export { quitclaimDeed }                  from '../quitclaim-deed';
export { divorceSettlementAgreement }     from '../divorce-settlement-agreement';
export { childCustodyAgreement }          from '../child-custody-agreement';
export { prenuptialAgreement }            from '../prenuptial-agreement';
export { childMedicalConsent }            from '../child-medical-consent';
export { powerOfAttorney }                from '../power-of-attorney';
export { healthcarePowerOfAttorney }      from '../healthcare-power-of-attorney';
export { livingWill }                     from '../living-will';
export { affidavitGeneral }               from '../affidavit-general';
export { lastWillTestament }              from '../last-will-testament';
export { livingTrust }                    from '../living-trust';
export { generalInquiry }                 from '../general-inquiry';
