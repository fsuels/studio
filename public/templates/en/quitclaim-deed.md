# Quitclaim Deed

---

**QUITCLAIM DEED**

**State of {{state}}**  
**County of {{county}}**

---

## 1. Property Transfer Information

**Document Date:** {{deed_date}}  
**Recording Information:** {{recording_info}} (to be completed by recorder)

### 1.1 Parties

**Grantor (Current Owner):** {{grantor_name}}  
**Grantor Address:** {{grantor_address}}  
**Grantor Status:** {{grantor_marital_status}}

{{#if multiple_grantors}}
**Additional Grantor:** {{grantor_2_name}}  
**Additional Grantor Address:** {{grantor_2_address}}
{{/if}}

**Grantee (New Owner):** {{grantee_name}}  
**Grantee Address:** {{grantee_address}}  
**Grantee Status:** {{grantee_marital_status}}

{{#if multiple_grantees}}
**Additional Grantee:** {{grantee_2_name}}  
**Additional Grantee Address:** {{grantee_2_address}}  
**Ownership Type:** {{ownership_type}} (Joint Tenants/Tenants in Common/Community Property)
{{/if}}

---

## 2. Property Description

### 2.1 Property Address

**Property Address:** {{property_address}}  
**City:** {{city}}, **State:** {{state}}, **ZIP:** {{zip_code}}  
**County:** {{county}}

### 2.2 Legal Description

{{legal_description}}

**Assessor's Parcel Number (APN):** {{assessors_parcel_number}}

### 2.3 Property Details

**Property Type:** {{property_type}} (Residential/Commercial/Vacant Land)  
**Approximate Size:** {{property_size}}  
**Zoning:** {{zoning_designation}}

---

## 3. Consideration and Transfer

### 3.1 Consideration

{{#if nominal_consideration}}
**Consideration:** For the sum of Ten Dollars ($10.00) and other good and valuable consideration, receipt of which is hereby acknowledged.
{{else}}
**Consideration:** For the sum of **${{consideration_amount}}\*\* and other good and valuable consideration, receipt of which is hereby acknowledged.
{{/if}}

### 3.2 Transfer Statement

The Grantor(s) hereby remise, release, and forever quitclaim to the Grantee(s), their heirs and assigns, all right, title, interest, claim, and demand which the Grantor(s) have in and to the above-described property.

---

## 4. Quitclaim Language and Warranties

### 4.1 Nature of Quitclaim Deed

**IMPORTANT:** This is a Quitclaim Deed. The Grantor makes NO WARRANTIES regarding title to the property. The Grantor conveys only whatever interest, if any, the Grantor may have in the property. The Grantee receives no guarantees about the quality or extent of the title being transferred.

### 4.2 No Title Warranties

The Grantor does NOT warrant or guarantee:

- That the Grantor owns the property
- That the title is clear and marketable
- That there are no liens or encumbrances
- That the property description is accurate
- Protection against title defects

### 4.3 "As-Is" Transfer

The property is transferred in its current condition, "AS-IS," without any warranties or representations regarding:

- Physical condition of the property
- Compliance with building codes or zoning laws
- Environmental conditions
- Boundary disputes
- Access rights

---

## 5. Subject to Existing Conditions

### 5.1 Existing Encumbrances

This transfer is subject to:

- All existing liens, mortgages, and encumbrances of record
- Easements, restrictions, and covenants of record
- Property taxes and assessments
- {{existing_encumbrances}}

### 5.2 Specific Reservations

{{#if has_reservations}}
The Grantor reserves the following rights:
{{reserved_rights}}
{{else}}
The Grantor makes no reservations of rights in the property.
{{/if}}

---

## 6. Common Uses for Quitclaim Deeds

**Note:** This quitclaim deed is being used for the following purpose:
{{quitclaim_purpose}}

**Common Uses Include:**

- Transfer between family members
- Adding/removing spouse from title
- Clearing title defects
- Transfer to trust or LLC
- Divorce property transfers
- Correcting deed errors

---

## 7. Tax Information

### 7.1 Property Tax Information

**Current Year Taxes:** {{current_tax_amount}}  
**Tax Year:** {{tax_year}}  
**Tax Responsibility:** {{tax_responsibility}}

### 7.2 Transfer Tax

{{#if transfer_tax_applicable}}
**Transfer Tax Due:** ${{transfer_tax_amount}}  
**Transfer Tax Paid By:** {{transfer_tax_paid_by}}
{{else}}
**Transfer Tax:** Not applicable or exempt
{{/if}}

---

## 8. Additional Provisions

### 8.1 Special Conditions

{{#if special_conditions}}
{{special_conditions}}
{{else}}
No special conditions apply to this transfer.
{{/if}}

### 8.2 Effective Date

This deed shall be effective as of {{effective_date}}.

### 8.3 Governing Law

This deed shall be governed by the laws of {{state}}.

---

## 9. Grantor Acknowledgment

The Grantor(s) acknowledge that:

- They understand the nature of a quitclaim deed
- They are making no warranties regarding title
- They have read and understand this document
- They are executing this deed voluntarily

---

## 10. Execution and Signatures

**IN WITNESS WHEREOF**, the Grantor(s) have executed this Quitclaim Deed on **{{deed_date}}**.

**GRANTOR:**

| Signature                                  | Date          |
| ------------------------------------------ | ------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{deed_date}} |
| {{grantor_name}}                           |               |
| Print Name: {{grantor_name}}               |               |

{{#if multiple_grantors}}
**ADDITIONAL GRANTOR:**

| Signature                                  | Date          |
| ------------------------------------------ | ------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{deed_date}} |
| {{grantor_2_name}}                         |               |
| Print Name: {{grantor_2_name}}             |               |

{{/if}}

---

## 11. Acknowledgment/Notarization

**State of {{state}}**  
**County of {{county}}**

On this **{{deed_date}}**, before me personally appeared **{{grantor_name}}**{{#if multiple_grantors}} and **{{grantor_2_name}}**{{/if}}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** ******\*\*\*\*******\_******\*\*\*\*******  
**My Commission Expires:** ****\*\*\*\*****\_****\*\*\*\*****

**[Notary Seal]**

---

## 12. Recording Information

**For Recorder's Use Only:**

**Document Number:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Recording Date:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Recording Time:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Recorded By:** **\*\*\*\***\_\_\_**\*\*\*\***

**Recording Fees:**

- Recording Fee: $\***\*\_\_\_\*\***
- Transfer Tax: $\***\*\_\_\_\*\***
- Other Fees: $\***\*\_\_\_\*\***
- **Total:** $\***\*\_\_\_\*\***

---

## 13. Return Document To

After recording, return this document to:

**{{return_to_name}}**  
{{return_to_address}}

**Phone:** {{return_to_phone}}

---

## 14. Important Notices

### 14.1 Title Insurance Recommendation

**STRONGLY RECOMMENDED:** The Grantee should obtain title insurance to protect against title defects, liens, or other issues not revealed by this quitclaim deed.

### 14.2 Professional Advice

This deed should be reviewed by qualified legal and tax professionals before execution, especially for:

- Tax implications of the transfer
- Estate planning considerations
- Potential liability issues
- Recording requirements

### 14.3 Recording Requirement

This deed must be recorded in the county recorder's office where the property is located to provide public notice of the transfer.

---

**IMPORTANT LEGAL NOTICE:** This quitclaim deed should be reviewed by a qualified real estate attorney to ensure compliance with state and local laws. Quitclaim deeds provide no title warranties and should be used only when the parties understand the risks involved. Always obtain title insurance and professional legal advice before completing real estate transfers.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
