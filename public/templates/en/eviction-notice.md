# Eviction Notice

---

**NOTICE TO QUIT AND DELIVER UP POSSESSION OF PREMISES**

**TO:** {{tenant_names}} and all other occupants of the premises described below:

**PREMISES ADDRESS:** {{property_address}}  
**CITY:** {{city}}, **STATE:** {{state}}, **ZIP:** {{zip_code}}

---

## 1. Notice Information

**Date of Notice:** {{notice_date}}  
**Landlord/Owner:** {{landlord_name}}  
**Landlord Address:** {{landlord_address}}  
**Property Manager:** {{#if property_manager}}{{property_manager_name}}{{else}}N/A{{/if}}

**Type of Notice:** {{notice_type}}
- [ ] Pay Rent or Quit
- [ ] Cure or Quit  
- [ ] Unconditional Quit
- [ ] Notice to Quit (End of Tenancy)

---

## 2. Reason for Notice

{{#if pay_rent_or_quit}}
### PAY RENT OR QUIT NOTICE

You are hereby notified that you are in default in the payment of rent for the above-described premises. The rental period and amount due are as follows:

**Rental Period:** {{rental_period_start}} through {{rental_period_end}}  
**Monthly Rent:** ${{monthly_rent}}  
**Amount Due:** ${{amount_due}}  
**Late Fees:** ${{late_fees}}  
**Other Charges:** ${{other_charges}}  
**TOTAL AMOUNT DUE:** ${{total_amount_due}}

You are required to pay the total amount due within **{{pay_or_quit_days}}** days after service of this notice or to deliver up possession of the above-described premises to the landlord.
{{/if}}

{{#if cure_or_quit}}
### CURE OR QUIT NOTICE

You are hereby notified that you are in violation of the terms of your lease agreement in the following manner:

**Lease Violations:**
{{lease_violations}}

You are required to cure the above-mentioned violations within **{{cure_period_days}}** days after service of this notice or to deliver up possession of the premises to the landlord.
{{/if}}

{{#if unconditional_quit}}
### UNCONDITIONAL QUIT NOTICE

You are hereby required to quit and deliver up possession of the above-described premises to the landlord within **{{quit_days}}** days after service of this notice.

**Reason for Unconditional Notice:**
{{unconditional_reason}}
{{/if}}

{{#if end_tenancy}}
### NOTICE TO QUIT (END OF TENANCY)

You are hereby notified that your tenancy of the above-described premises will terminate on **{{termination_date}}**. You are required to quit and deliver up possession of the premises to the landlord on or before that date.

**Reason for Termination:**
{{termination_reason}}
{{/if}}

---

## 3. Legal Consequences

**PLEASE TAKE NOTICE** that if you fail to comply with this notice within the time specified, legal proceedings will be instituted against you to:

1. Recover possession of the premises
2. Recover damages and costs
3. Recover reasonable attorney fees (if provided by lease or law)
4. Forfeit your right to possession of the premises

**UNLAWFUL DETAINER ACTION:** Failure to comply may result in unlawful detainer action being filed against you in court.

---

## 4. Right to Possession

The undersigned landlord declares under penalty of perjury that the facts stated in this notice are true and that the landlord is entitled to possession of the premises for the reasons stated above.

---

## 5. Important Information for Tenants

### 5.1 Tenant Rights
You may have certain rights under federal, state, and local law. Contact a tenant's rights organization or attorney if you have questions about your rights.

### 5.2 COVID-19 Protections
{{#if covid_protections}}
Special protections may apply due to COVID-19. Check with local authorities about current tenant protections and eviction moratoriums.
{{/if}}

### 5.3 Payment Options
{{#if payment_options}}
**Payment can be made to:**
- **Address:** {{payment_address}}
- **Online:** {{online_payment_info}}
- **Phone:** {{payment_phone}}
- **Hours:** {{payment_hours}}
{{/if}}

### 5.4 Contact Information
For questions about this notice, contact:
**Name:** {{contact_name}}  
**Phone:** {{contact_phone}}  
**Email:** {{contact_email}}

---

## 6. Service of Notice

This notice is served upon you in the following manner:

**Method of Service:**
- [ ] Personal service upon the tenant
- [ ] Substituted service (left with person of suitable age at residence)
- [ ] Posted conspicuously on the premises after attempted personal service
- [ ] Mailed by certified mail, return receipt requested
- [ ] Other method authorized by law: {{other_service_method}}

**Date Served:** {{service_date}}  
**Time Served:** {{service_time}}  
**Served By:** {{served_by_name}}

---

## 7. Proof of Service

I, {{server_name}}, declare under penalty of perjury under the laws of {{state}} that:

1. I am over the age of 18 years
2. I am not a party to this action
3. I served this notice on the above-named tenant(s) in the manner indicated above
4. The information contained in this proof of service is true and correct

**Server Information:**
**Name:** {{server_name}}  
**Address:** {{server_address}}  
**Phone:** {{server_phone}}

**Signature:** _________________________________  
**Date:** {{service_date}}

---

## 8. State-Specific Requirements

### For {{state}} Residents:

{{#if state_specific_requirements}}
**State Law Requirements:**
{{state_specific_requirements}}
{{/if}}

**Notice Period Requirements:**
- **Pay or Quit:** {{state_pay_quit_days}} days minimum
- **Cure or Quit:** {{state_cure_quit_days}} days minimum  
- **Month-to-Month Termination:** {{state_month_to_month_days}} days
- **Other:** {{state_other_requirements}}

---

## 9. Additional Information

### 9.1 Lease Reference
This notice is given under the terms of the lease agreement dated {{lease_date}} and applicable state law.

### 9.2 Acceptance of Partial Payment
{{#if partial_payment_policy}}
**Important:** Acceptance of partial payment after service of this notice may invalidate this notice under state law.
{{/if}}

### 9.3 Translation
{{#if translation_required}}
This notice is available in other languages. Contact {{translation_contact}} for translation services.
{{/if}}

---

**DATED:** {{notice_date}}

**LANDLORD/AUTHORIZED AGENT:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{notice_date}} |
| {{landlord_name}} | |
| {{landlord_title}} | |

---

**IMPORTANT LEGAL NOTICE:** This eviction notice must comply with federal, state, and local landlord-tenant laws. Laws vary significantly by jurisdiction and are subject to change. This notice should be reviewed by a qualified attorney to ensure compliance with current law and proper procedures.

*Template generated by 123LegalDoc - Professional Legal Document Platform*
---
© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
