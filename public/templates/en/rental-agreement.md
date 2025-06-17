# Rental Agreement

---

**RENTAL AGREEMENT**

This Rental Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, between:

**OWNER/LANDLORD:**  
{{landlord_name}}  
{{landlord_address}}  
{{landlord_city}}, {{landlord_state}} {{landlord_zip}}  
Phone: {{landlord_phone}}  
Email: {{landlord_email}}

**TENANT/RENTER:**  
{{tenant_name}}  
{{tenant_address}}  
{{tenant_city}}, {{tenant_state}} {{tenant_zip}}  
Phone: {{tenant_phone}}  
Email: {{tenant_email}}

---

## 1. RENTAL PROPERTY

### 1.1 Property Address
{{property_address}}  
{{property_city}}, {{property_state}} {{property_zip}}

### 1.2 Property Description
**Type:** {{property_type}} (Apartment/House/Condo/Room/Other)  
**Bedrooms:** {{bedrooms}}  
**Bathrooms:** {{bathrooms}}  
**Furnished:** {{furnished_status}} (Yes/No/Partially)  
**Parking:** {{parking_included}}

### 1.3 Included Items
{{included_items}}

---

## 2. RENTAL TERMS

### 2.1 Rental Period
**Start Date:** {{rental_start_date}}  
**End Date:** {{rental_end_date}}  
**Rental Type:** {{rental_type}} (Fixed Term/Month-to-Month/Week-to-Week)

### 2.2 Rent Payment
**Rent Amount:** ${{rent_amount}} per {{payment_period}}  
**Due Date:** {{payment_due_date}}  
**Payment Method:** {{payment_method}}  
**Payable To:** {{payable_to}}

### 2.3 Security Deposit
**Deposit Amount:** ${{security_deposit}}  
**Purpose:** Security for damages and unpaid rent  
**Return Timeline:** {{deposit_return_timeline}}

### 2.4 Late Fees
**Late Fee:** ${{late_fee}} if rent is {{grace_period}} days late  
**Additional Daily Fee:** ${{daily_late_fee}} per day after {{grace_period}} days

---

## 3. USE OF PREMISES

### 3.1 Occupancy Limit
Maximum occupants: {{max_occupants}} persons

### 3.2 Use Restrictions
- Premises to be used for residential purposes only
- No commercial activities without written consent
- No illegal activities
- {{additional_use_restrictions}}

### 3.3 Guest Policy
Guests may stay for maximum {{guest_limit}} consecutive days

---

## 4. TENANT OBLIGATIONS

### 4.1 Maintenance Responsibilities
Tenant agrees to:
- Keep premises clean and sanitary
- Report damages or needed repairs promptly
- Use appliances and fixtures properly
- Not make unauthorized alterations
- {{additional_maintenance_duties}}

### 4.2 Utility Responsibilities
**Tenant Pays:**
{{#each tenant_utilities}}
- {{this}}
{{/each}}

**Landlord Pays:**
{{#each landlord_utilities}}
- {{this}}
{{/each}}

### 4.3 Property Care
- No smoking {{smoking_policy}}
- Pet policy: {{pet_policy}}
- Noise restrictions: {{noise_restrictions}}

---

## 5. LANDLORD OBLIGATIONS

### 5.1 Property Condition
Landlord agrees to:
- Provide premises in habitable condition
- Make necessary repairs for health and safety
- Maintain common areas (if applicable)
- Ensure working utilities at commencement

### 5.2 Access to Property
Landlord may enter for:
- Emergency situations (immediate access)
- Repairs and maintenance ({{notice_hours}} hours notice)
- Inspections ({{inspection_notice}} notice)
- Showing to prospective tenants/buyers ({{showing_notice}} notice)

---

## 6. RULES AND REGULATIONS

### 6.1 General Rules
{{general_rules}}

### 6.2 Parking Rules
{{parking_rules}}

### 6.3 Noise Policy
{{noise_policy}}

### 6.4 Pet Policy
{{#if pets_allowed}}
- Pets allowed: {{allowed_pets}}
- Pet deposit: ${{pet_deposit}}
- Pet restrictions: {{pet_restrictions}}
{{else}}
No pets allowed without written permission.
{{/if}}

---

## 7. TERMINATION

### 7.1 Notice Requirements
{{#if month_to_month}}
Either party may terminate with {{termination_notice}} days written notice.
{{else}}
This agreement terminates on {{rental_end_date}}.
{{/if}}

### 7.2 Early Termination
{{#if early_termination_allowed}}
Early termination permitted with {{early_termination_notice}} notice and payment of ${{early_termination_fee}}.
{{else}}
Early termination not permitted except as required by law.
{{/if}}

### 7.3 Holdover
If tenant remains after expiration, tenancy becomes month-to-month at ${{holdover_rent}} per month.

---

## 8. DEFAULT AND REMEDIES

### 8.1 Default Events
Tenant default includes:
- Non-payment of rent
- Violation of any lease terms
- Abandonment of premises
- {{additional_default_events}}

### 8.2 Remedies
Upon default, Landlord may:
- Terminate this agreement
- Pursue eviction
- Collect damages and costs
- Re-enter premises

---

## 9. MISCELLANEOUS PROVISIONS

### 9.1 Entire Agreement
This agreement contains the complete terms and supersedes all prior agreements.

### 9.2 Modifications
Changes must be in writing and signed by both parties.

### 9.3 Governing Law
This agreement is governed by {{state}} law.

### 9.4 Severability
Invalid provisions do not affect the validity of remaining terms.

### 9.5 Assignment
Tenant may not assign or sublet without landlord's written consent.

### 9.6 Waiver
Failure to enforce any provision does not waive future enforcement.

---

## 10. ADDITIONAL TERMS

{{additional_terms}}

---

## 11. DISCLOSURES

### 11.1 Lead Paint Disclosure
{{#if lead_paint_disclosure}}
{{lead_paint_disclosure}}
{{/if}}

### 11.2 Other Required Disclosures
{{other_disclosures}}

---

## 12. SIGNATURES

The parties have read, understood, and agree to all terms of this Rental Agreement.

**LANDLORD/OWNER:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{landlord_name}} | |

**TENANT/RENTER:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{tenant_name}} | |

{{#if witness_required}}
**WITNESS:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{witness_name}} | |
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This rental agreement should be reviewed by qualified legal counsel to ensure compliance with local rental laws and regulations. Landlord-tenant laws vary by jurisdiction and this agreement should be customized accordingly.

*Template generated by 123LegalDoc - Professional Legal Document Platform*