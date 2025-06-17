# Residential Lease Agreement

---

**RESIDENTIAL LEASE AGREEMENT**

This Residential Lease Agreement ("Agreement") is made and entered into on **{{lease_date}}**, between:

**LANDLORD/LESSOR:**  
{{landlord_name}}  
{{landlord_address}}  
{{landlord_city}}, {{landlord_state}} {{landlord_zip}}  
Phone: {{landlord_phone}}  
Email: {{landlord_email}}

**TENANT/LESSEE:**  
{{tenant_name}}  
{{tenant_current_address}}  
{{tenant_city}}, {{tenant_state}} {{tenant_zip}}  
Phone: {{tenant_phone}}  
Email: {{tenant_email}}

{{#if additional_tenant}}
**ADDITIONAL TENANT:**  
{{additional_tenant_name}}  
Phone: {{additional_tenant_phone}}  
Email: {{additional_tenant_email}}
{{/if}}

---

## 1. PROPERTY DESCRIPTION

### 1.1 Rental Property
**Address:** {{property_address}}  
**City:** {{property_city}}  
**State:** {{property_state}}  
**ZIP Code:** {{property_zip}}  
**County:** {{property_county}}

### 1.2 Property Details
**Property Type:** {{property_type}} (Single Family Home/Duplex/Apartment/Condominium/Townhouse)  
**Bedrooms:** {{bedrooms}}  
**Bathrooms:** {{bathrooms}}  
**Square Footage:** {{square_footage}} sq ft  
**Parking Spaces:** {{parking_spaces}}  
**Storage:** {{storage_description}}

### 1.3 Included Appliances and Fixtures
The following appliances and fixtures are included with the rental:
{{#if included_appliances}}
{{included_appliances}}
{{else}}
- Refrigerator: {{refrigerator_included}}
- Stove/Oven: {{stove_included}}
- Dishwasher: {{dishwasher_included}}
- Washer/Dryer: {{washer_dryer_included}}
- Air Conditioning: {{ac_included}}
- Heating System: {{heating_included}}
{{/if}}

---

## 2. LEASE TERMS

### 2.1 Lease Period
**Lease Type:** {{lease_type}} (Fixed-Term/Month-to-Month)  
**Lease Start Date:** {{lease_start_date}}  
**Lease End Date:** {{lease_end_date}}  
**Lease Term:** {{lease_term_months}} months

### 2.2 Rent Amount and Payment
**Monthly Rent:** ${{monthly_rent}}  
**Payment Due Date:** {{rent_due_date}} of each month  
**Payment Method:** {{payment_method}}  
**Late Fee:** ${{late_fee}} if rent is more than {{grace_period}} days late  
**Returned Check Fee:** ${{returned_check_fee}}

### 2.3 Security Deposit
**Security Deposit Amount:** ${{security_deposit}}  
**Deposit Due Date:** {{deposit_due_date}}  
**Deposit Purpose:** To secure performance of lease terms and cover damages beyond normal wear and tear  
**Deposit Return Timeline:** Within {{deposit_return_days}} days after lease termination

### 2.4 Additional Fees
{{#if pet_deposit}}
**Pet Deposit:** ${{pet_deposit}}  
**Pet Rent:** ${{monthly_pet_rent}} per month
{{/if}}
{{#if cleaning_fee}}
**Move-out Cleaning Fee:** ${{cleaning_fee}}
{{/if}}
{{#if application_fee}}
**Application Fee:** ${{application_fee}} (non-refundable)
{{/if}}

---

## 3. USE AND OCCUPANCY

### 3.1 Authorized Occupants
The premises shall be occupied only by the named Tenant(s) and the following authorized occupants:
{{authorized_occupants}}

### 3.2 Guest Policy
Guests may stay for a maximum of {{guest_limit_days}} consecutive days and no more than {{total_guest_days}} days per month without Landlord's written consent.

### 3.3 Subletting and Assignment
Tenant may not sublet the premises or assign this lease without Landlord's prior written consent.

---

## 4. TENANT RESPONSIBILITIES

### 4.1 Maintenance and Care
Tenant agrees to:
- Keep the premises clean and sanitary
- Use all appliances and fixtures in a reasonable manner
- Report needed repairs promptly to Landlord
- Not make any alterations without written consent
- Replace burned-out light bulbs
- Keep heating/cooling systems clean and change filters regularly

### 4.2 Utilities and Services
**Tenant Responsible For:**
{{#each tenant_utilities}}
- {{this}}
{{/each}}

**Landlord Responsible For:**
{{#each landlord_utilities}}
- {{this}}
{{/each}}

### 4.3 Lawn and Garden Care
{{lawn_care_responsibility}}

---

## 5. LANDLORD RESPONSIBILITIES

### 5.1 Property Maintenance
Landlord agrees to:
- Maintain the property in habitable condition
- Make necessary structural repairs
- Maintain common areas (if applicable)
- Ensure all appliances are in working order at lease commencement
- Respond to repair requests within {{repair_response_time}} hours for emergencies

### 5.2 Right of Entry
Landlord may enter the premises:
- In case of emergency without notice
- For inspections, repairs, or showings with {{entry_notice_hours}} hours notice
- Only during reasonable hours ({{entry_hours}}) unless emergency

---

## 6. RULES AND REGULATIONS

### 6.1 Noise Policy
Tenant agrees to maintain reasonable noise levels and comply with quiet hours from {{quiet_hours_start}} to {{quiet_hours_end}}.

### 6.2 Smoking Policy
{{smoking_policy}}

### 6.3 Pet Policy
{{#if pets_allowed}}
**Pets Allowed:** {{pet_types_allowed}}  
**Maximum Number:** {{max_pets}}  
**Weight Limit:** {{pet_weight_limit}} lbs  
**Additional Requirements:** {{pet_requirements}}
{{else}}
**No pets are allowed** on the premises without prior written consent.
{{/if}}

### 6.4 Parking
{{parking_policy}}

---

## 7. ALTERATIONS AND IMPROVEMENTS

### 7.1 Tenant Alterations
Tenant may not make any alterations, improvements, or installations without Landlord's prior written consent. Any approved alterations become property of Landlord unless otherwise agreed.

### 7.2 Decorating
{{#if decorating_allowed}}
Minor decorating such as hanging pictures is permitted with the following restrictions:
{{decorating_restrictions}}
{{else}}
No nails, screws, or adhesives may be used on walls without written permission.
{{/if}}

---

## 8. INSURANCE

### 8.1 Landlord's Insurance
Landlord maintains property insurance but is not responsible for Tenant's personal property or liability.

### 8.2 Tenant's Insurance
{{#if renters_insurance_required}}
**Tenant is REQUIRED to maintain renter's insurance** with minimum coverage of ${{required_insurance_amount}} and must provide proof of coverage before occupancy.
{{else}}
Tenant is strongly encouraged to maintain renter's insurance to protect personal property.
{{/if}}

---

## 9. DEFAULTS AND REMEDIES

### 9.1 Tenant Default
Tenant shall be in default if:
- Rent is not paid within {{grace_period}} days after due date
- Any lease term is violated
- The premises is abandoned
- Tenant files for bankruptcy
- Any representation made in the application is false

### 9.2 Landlord Remedies
Upon default, Landlord may:
- Terminate the lease with {{default_notice_days}} days written notice
- Pursue eviction proceedings
- Collect unpaid rent and fees
- Re-enter and re-let the premises
- Pursue any other legal remedies

### 9.3 Abandoned Property
Property left on premises after termination will be deemed abandoned after {{abandoned_property_days}} days and may be disposed of at Tenant's expense.

---

## 10. LEASE TERMINATION

### 10.1 End of Lease Term
{{#if automatic_renewal}}
This lease will automatically renew for {{renewal_term}} month(s) unless either party gives {{termination_notice_days}} days written notice.
{{else}}
This lease terminates on {{lease_end_date}} unless renewed by mutual agreement.
{{/if}}

### 10.2 Early Termination
{{#if early_termination_allowed}}
Tenant may terminate early with {{early_termination_notice}} days notice and payment of early termination fee of ${{early_termination_fee}}.
{{else}}
Early termination is not permitted except for reasons allowed by law.
{{/if}}

### 10.3 Move-Out Requirements
Upon termination, Tenant must:
- Remove all personal property
- Clean the premises to original condition
- Return all keys and garage door openers
- Provide forwarding address for security deposit return
- Allow final inspection

---

## 11. DISCLOSURES

### 11.1 Lead-Based Paint Disclosure
{{#if built_before_1978}}
**IMPORTANT:** This property was built before 1978 and may contain lead-based paint. Federal law requires disclosure of lead-based paint hazards. See attached disclosure form.
{{/if}}

### 11.2 Mold Disclosure
{{mold_disclosure}}

### 11.3 Other Disclosures
{{additional_disclosures}}

---

## 12. GENERAL PROVISIONS

### 12.1 Entire Agreement
This lease constitutes the entire agreement and supersedes all prior negotiations and agreements.

### 12.2 Modifications
This lease may only be modified by written agreement signed by both parties.

### 12.3 Governing Law
This lease is governed by the laws of {{state}}.

### 12.4 Severability
If any provision is held invalid, the remainder of the lease remains in effect.

### 12.5 Binding Effect
This lease binds heirs, successors, and assigns of both parties.

### 12.6 Joint and Several Liability
If multiple tenants, each is jointly and severally liable for all obligations.

---

## 13. ADDITIONAL TERMS

{{additional_terms}}

---

## 14. SIGNATURES

By signing below, the parties agree to all terms and conditions of this Residential Lease Agreement.

**LANDLORD:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{lease_date}} |
| {{landlord_name}} | |
| Print Name: {{landlord_name}} | |

**TENANT:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{lease_date}} |
| {{tenant_name}} | |
| Print Name: {{tenant_name}} | |

{{#if additional_tenant}}
**ADDITIONAL TENANT:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{lease_date}} |
| {{additional_tenant_name}} | |
| Print Name: {{additional_tenant_name}} | |
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This residential lease agreement should be reviewed by qualified legal counsel to ensure compliance with local, state, and federal housing laws. Landlord-tenant laws vary significantly by jurisdiction and this agreement should be customized accordingly.

*Template generated by 123LegalDoc - Professional Legal Document Platform*