# Demand Letter for Payment

---

**DEMAND FOR PAYMENT**

**Date:** {{letter_date}}

**TO:** {{debtor_name}}  
**Address:** {{debtor_address}}

**FROM:** {{creditor_name}}  
**Address:** {{creditor_address}}  
**Phone:** {{creditor_phone}}  
**Email:** {{creditor_email}}

---

## 1. Account Information

**Account/Reference Number:** {{account_number}}  
**Original Agreement Date:** {{original_agreement_date}}  
**Nature of Debt:** {{debt_description}}

---

## 2. Outstanding Balance

### 2.1 Current Balance Due

**Total Amount Owed:** ${{total_amount_due}}

### 2.2 Breakdown of Charges

**Original Amount:** ${{original_amount}}  
**Interest:** ${{interest_amount}}  
**Late Fees:** ${{late_fees}}  
**Other Charges:** ${{other_charges}}

### 2.3 Payment History

{{#if payment_history}}
**Last Payment:** ${{last_payment_amount}} on {{last_payment_date}}  
**Previous Payments:** {{previous_payments}}
{{else}}
**Payment Status:** No payments received to date
{{/if}}

---

## 3. Demand for Payment

### 3.1 Payment Demand

YOU ARE HEREBY DEMANDED to pay the sum of **${{total_amount_due}}** immediately. This amount represents the total outstanding balance on your account as of {{letter_date}}.

### 3.2 Payment Deadline

**FINAL PAYMENT DEADLINE:** {{payment_deadline}}

You must pay this amount in full by {{payment_deadline}} to avoid further collection action.

### 3.3 Payment Instructions

**Payment Methods Accepted:**
{{payment_methods}}

**Make Payment To:**
{{payment_address}}

**Online Payment:** {{online_payment_url}}  
**Phone Payment:** {{payment_phone}}

---

## 4. Original Agreement Details

### 4.1 Contract Information

{{#if written_agreement}}
**Written Agreement:** {{agreement_type}} dated {{original_agreement_date}}  
**Agreement Terms:** {{agreement_terms}}
{{else}}
**Oral Agreement:** Agreement made on {{original_agreement_date}}  
**Agreement Details:** {{oral_agreement_details}}
{{/if}}

### 4.2 Services/Goods Provided

**Description:** {{services_goods_description}}  
**Date Provided:** {{service_date}}  
**Invoice/Receipt Number:** {{invoice_number}}

---

## 5. Previous Collection Efforts

### 5.1 Prior Notices

{{#if previous_notices}}
**Previous Notices Sent:**

- {{notice_1_date}}: {{notice_1_type}}
- {{notice_2_date}}: {{notice_2_type}}
- {{notice_3_date}}: {{notice_3_type}}
  {{additional_notices}}
  {{else}}
  This is the first formal demand for payment.
  {{/if}}

### 5.2 Contact Attempts

{{#if contact_attempts}}
**Previous Contact Attempts:**
{{contact_attempt_history}}
{{else}}
No previous contact attempts made.
{{/if}}

---

## 6. Legal Consequences of Non-Payment

### 6.1 Legal Action Warning

**NOTICE:** If payment is not received by {{payment_deadline}}, we may pursue legal action against you, which could result in:

- Filing a lawsuit for the full amount owed plus interest
- Court costs and attorney fees
- Judgment against you
- Wage garnishment
- Bank account levy
- Lien on your property
- Damage to your credit rating

### 6.2 Additional Costs

If legal action becomes necessary, you may be liable for:

- Attorney fees: {{attorney_fees_clause}}
- Court costs and filing fees
- Additional interest and penalties
- Collection agency fees

### 6.3 Credit Reporting

{{#if credit_reporting_threat}}
**Credit Reporting:** This debt may be reported to credit reporting agencies, which could negatively impact your credit score and ability to obtain credit in the future.
{{/if}}

---

## 7. Dispute Rights

### 7.1 Right to Dispute

If you believe this debt is not valid or the amount is incorrect, you have the right to dispute it within {{dispute_period}} days of receiving this notice.

### 7.2 Dispute Process

To dispute this debt:

1. Send written notice of dispute to: {{dispute_address}}
2. Include specific reasons for dispute
3. Provide supporting documentation
4. Send via certified mail for proof of delivery

### 7.3 Verification of Debt

{{#if debt_validation_required}}
If you dispute this debt in writing within {{dispute_period}} days, we will provide verification of the debt including:

- Name and address of original creditor
- Copy of original agreement or invoice
- Detailed accounting of charges
  {{/if}}

---

## 8. Payment Arrangements

### 8.1 Payment Plan Option

{{#if payment_plan_available}}
**Payment Plan Available:** If you cannot pay the full amount immediately, contact us at {{contact_phone}} to discuss a payment arrangement. Any payment plan must be agreed to in writing.

**Minimum Acceptable Payment:** ${{minimum_payment}} per month  
**Required Down Payment:** ${{down_payment_required}}
{{else}}
**Full Payment Required:** We are not accepting partial payments or payment plans at this time. Full payment is required by the deadline stated above.
{{/if}}

### 8.2 Settlement Option

{{#if settlement_available}}
**Settlement Offer:** We may be willing to accept ${{settlement_amount}} as payment in full if received by {{settlement_deadline}}. This offer expires on {{settlement_expiration}}.
{{/if}}

---

## 9. Contact Information

### 9.1 Questions or Concerns

If you have questions about this debt or wish to make payment arrangements, contact:

**{{contact_person_name}}**  
**Title:** {{contact_person_title}}  
**Phone:** {{contact_phone}}  
**Email:** {{contact_email}}  
**Hours:** {{contact_hours}}

### 9.2 Mailing Address

**Mail Payments To:**
{{payment_mailing_address}}

---

## 10. Legal Notices

### 10.1 Collection Agency Notice

{{#if collection_agency}}
**Collection Agency:** This debt is being collected by {{collection_agency_name}}, a debt collection agency, on behalf of {{original_creditor}}.
{{/if}}

### 10.2 State Law Notices

{{state_specific_notices}}

### 10.3 Fair Debt Collection Practices Act

{{#if fdcpa_applies}}
**FDCPA Notice:** This is an attempt to collect a debt. Any information obtained will be used for that purpose. This communication is from a debt collector.
{{/if}}

---

## 11. Important Deadlines

**CRITICAL DEADLINES:**

| Action                                               | Deadline                         |
| ---------------------------------------------------- | -------------------------------- |
| Full Payment Due                                     | {{payment_deadline}}             |
| {{#if settlement_available}}Settlement Offer Expires | {{settlement_expiration}}{{/if}} |
| Dispute Deadline                                     | {{dispute_deadline}}             |
| {{#if payment_plan_available}}Payment Plan Request   | {{payment_plan_deadline}}{{/if}} |

---

## 12. Preservation of Rights

### 12.1 Rights Reserved

This demand letter does not waive any rights we may have under the law or any agreement. We reserve all rights to pursue any and all legal remedies available.

### 12.2 Continued Accrual

Interest and other charges may continue to accrue until the debt is paid in full, unless prohibited by law.

### 12.3 Additional Actions

We reserve the right to pursue collection through other means, including but not limited to:

- Collection agencies
- Credit reporting
- Legal action
- Asset investigation

---

## 13. Certificate of Service

{{#if service_method}}
**Method of Service:** {{service_method}}  
**Date Sent:** {{service_date}}  
**Sent By:** {{sent_by_name}}  
**Tracking Number:** {{tracking_number}}
{{/if}}

---

## 14. Response Required

**IMMEDIATE ACTION REQUIRED**

To avoid further collection action and potential legal consequences:

☐ **Pay the full amount of ${{total_amount_due}} by {{payment_deadline}}**

☐ **Contact us immediately at {{contact_phone}} to discuss payment arrangements**

☐ **Send written dispute if you believe this debt is not valid**

**DO NOT IGNORE THIS NOTICE**

---

**{{creditor_name}}**

**By:** ******\*\*\*\*******\_******\*\*\*\*******  
**Name:** {{sender_name}}  
**Title:** {{sender_title}}  
**Date:** {{letter_date}}

---

**IMPORTANT LEGAL NOTICE:** This demand letter should be reviewed by qualified legal counsel to ensure compliance with applicable debt collection laws, including the Fair Debt Collection Practices Act and state collection laws. Requirements for demand letters vary by state and type of debt. Debtors have certain rights under federal and state law that must be respected.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
