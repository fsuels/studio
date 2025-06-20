# Residential Lease Agreement

---

**RESIDENTIAL LEASE AGREEMENT**

This Lease Agreement ("Lease") is made and entered into on **{{lease_date}}**, by and between:

- **Landlord:** {{landlord_name}}, with address at {{landlord_address}}
- **Tenant(s):** {{tenant_names}}, with address at {{tenant_address}}

Collectively referred to herein as the "Parties."

---

## 1. Property Description

### 1.1 Rental Property
The Landlord hereby leases to the Tenant(s) the following described premises:

**Property Address:** {{property_address}}  
**Unit/Apartment #:** {{unit_number}}  
**City:** {{city}}, **State:** {{state}}, **ZIP:** {{zip_code}}

### 1.2 Property Type
**Property Type:** {{property_type}} (Single-family home/Apartment/Condominium/Townhouse)  
**Bedrooms:** {{bedrooms}}  
**Bathrooms:** {{bathrooms}}  
**Square Footage:** {{square_footage}} sq ft (approximately)

### 1.3 Included Areas
The premises include: {{included_areas}} (e.g., garage, storage areas, balcony, etc.)

---

## 2. Lease Terms

### 2.1 Lease Period
**Lease Type:** {{lease_type}} (Fixed-term/Month-to-month)  
**Lease Start Date:** {{start_date}}  
**Lease End Date:** {{end_date}}  
**Total Lease Term:** {{lease_duration}}

### 2.2 Renewal Options
{{#if auto_renewal}}
This Lease will automatically renew for {{renewal_period}} unless terminated by either party with {{renewal_notice}} days written notice.
{{else}}
This Lease will terminate on the end date unless renewed by mutual written agreement.
{{/if}}

---

## 3. Rent and Payment Terms

### 3.1 Monthly Rent
**Monthly Rent Amount:** ${{monthly_rent}}  
**Due Date:** {{rent_due_date}} of each month  
**Prorated First Month:** {{#if prorated_rent}}${{prorated_amount}}{{else}}Not applicable{{/if}}

### 3.2 Payment Method
Rent shall be paid by: {{payment_method}} (check, money order, electronic transfer, online portal)  
**Payment Address:** {{payment_address}}  
**Online Portal:** {{online_portal_info}}

### 3.3 Late Fees
- **Grace Period:** {{grace_period}} days after due date
- **Late Fee:** ${{late_fee_amount}} if rent is paid after the grace period
- **Daily Late Fee:** {{#if daily_late_fee}}${{daily_late_fee_amount}} per day{{else}}Not applicable{{/if}}

### 3.4 Returned Payment Fee
**NSF/Returned Check Fee:** ${{nsf_fee}}

---

## 4. Security Deposit and Move-in Costs

### 4.1 Security Deposit
**Security Deposit Amount:** ${{security_deposit}}  
**Purpose:** To secure performance of tenant obligations and cover damages beyond normal wear and tear

### 4.2 Additional Deposits
{{#if pet_deposit}}**Pet Deposit:** ${{pet_deposit_amount}}{{/if}}  
{{#if key_deposit}}**Key Deposit:** ${{key_deposit_amount}}{{/if}}

### 4.3 Move-in Costs Summary
| Item | Amount |
|------|--------|
| First Month's Rent | ${{monthly_rent}} |
| Security Deposit | ${{security_deposit}} |
| {{#if last_month_rent}}Last Month's Rent | ${{monthly_rent}}{{/if}} |
| {{#if pet_deposit}}Pet Deposit | ${{pet_deposit_amount}}{{/if}} |
| **Total Due at Move-in** | **${{total_move_in_cost}}** |

### 4.4 Deposit Return
Security deposit will be returned within {{deposit_return_days}} days after lease termination, less any lawful deductions.

---

## 5. Utilities and Services

### 5.1 Landlord-Paid Utilities
The Landlord agrees to pay for: {{landlord_utilities}}

### 5.2 Tenant-Paid Utilities
The Tenant(s) agree to pay for: {{tenant_utilities}}

### 5.3 Utility Setup
Tenant must establish utility accounts in their name by the lease start date.

---

## 6. Occupancy and Use

### 6.1 Occupancy Limits
**Maximum Occupants:** {{max_occupants}} persons  
**Named Tenants:** {{tenant_names}}

### 6.2 Permitted Use
The premises shall be used solely as a private residential dwelling and for no other purpose.

### 6.3 Guests
Guests may stay for a maximum of {{guest_limit}} consecutive days without Landlord approval.

---

## 7. Pets Policy

### 7.1 Pet Authorization
{{#if pets_allowed}}
**Pets Allowed:** {{pet_policy_details}}  
**Pet Deposit:** ${{pet_deposit_amount}}  
**Monthly Pet Fee:** {{#if monthly_pet_fee}}${{monthly_pet_fee_amount}}{{else}}None{{/if}}  
**Pet Restrictions:** {{pet_restrictions}}
{{else}}
**No pets are allowed** without prior written consent from Landlord.
{{/if}}

---

## 8. Property Condition and Maintenance

### 8.1 Property Condition
Tenant acknowledges receiving the property in good condition. Any existing damages are noted on the attached Property Condition Report.

### 8.2 Landlord Maintenance Responsibilities
Landlord shall maintain:
- Structural components (roof, walls, foundation)
- Plumbing and electrical systems
- Heating and cooling systems
- {{landlord_maintenance_items}}

### 8.3 Tenant Maintenance Responsibilities
Tenant shall maintain:
- General cleanliness and sanitation
- Minor repairs under ${{minor_repair_limit}}
- {{tenant_maintenance_items}}

### 8.4 Maintenance Requests
Maintenance requests must be submitted: {{maintenance_request_method}}  
**Emergency Contact:** {{emergency_contact}} (for emergencies only)

---

## 9. Property Access

### 9.1 Landlord Entry
Landlord may enter the premises:
- With {{entry_notice}} hours advance notice for inspections, repairs, or showings
- In case of emergency without notice
- To show property to prospective tenants/buyers with reasonable notice

### 9.2 Entry Restrictions
Entry times shall be limited to {{entry_hours}} unless emergency or tenant consent.

---

## 10. Tenant Obligations

### 10.1 General Obligations
Tenant agrees to:
- Pay rent and charges when due
- Maintain the property in clean and sanitary condition
- Comply with all applicable laws and regulations
- Not disturb neighbors or engage in illegal activities
- Report maintenance issues promptly

### 10.2 Prohibited Activities
Tenant shall not:
- Alter the property without written permission
- Sublease without Landlord consent
- Use the property for illegal purposes
- Exceed occupancy limits
- Engage in activities that disturb neighbors

---

## 11. Landlord Obligations

### 11.1 Habitability
Landlord warrants the property is habitable and complies with applicable housing codes.

### 11.2 Quiet Enjoyment
Landlord agrees not to unreasonably interfere with Tenant's quiet enjoyment of the property.

### 11.3 Disclosures
{{required_disclosures}}

---

## 12. Insurance

### 12.1 Landlord Insurance
Landlord maintains property insurance covering the building and Landlord's personal property.

### 12.2 Tenant Insurance
**Renter's Insurance:** {{#if renters_insurance_required}}REQUIRED - Tenant must maintain renter's insurance with minimum coverage of ${{insurance_minimum}}{{else}}Recommended but not required{{/if}}

### 12.3 Liability
Tenant is liable for damages caused by their negligence or that of their guests.

---

## 13. Lease Termination

### 13.1 Natural Expiration
This Lease terminates on {{end_date}} unless renewed.

### 13.2 Early Termination by Tenant
{{#if early_termination_allowed}}
Tenant may terminate early with {{early_termination_notice}} days notice and payment of early termination fee of ${{early_termination_fee}}.
{{else}}
Early termination is not permitted except as allowed by law.
{{/if}}

### 13.3 Termination for Cause
Either party may terminate for material breach after {{cure_period}} days written notice to cure.

### 13.4 Move-out Requirements
Upon termination, Tenant must:
- Remove all personal property
- Clean the premises thoroughly
- Return all keys and access devices
- Provide forwarding address for deposit return

---

## 14. Legal Provisions

### 14.1 Governing Law
This Lease is governed by the laws of {{state}}.

### 14.2 Severability
If any provision is held invalid, the remainder of the Lease remains in effect.

### 14.3 Modification
This Lease may only be modified by written agreement signed by both parties.

### 14.4 Attorney Fees
{{#if attorney_fees_clause}}
The prevailing party in any legal action shall be entitled to reasonable attorney fees and costs.
{{/if}}

### 14.5 Joint and Several Liability
If multiple tenants, each is jointly and severally liable for all obligations.

---

## 15. Additional Terms and Conditions

{{additional_terms}}

---

## 16. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Lease Agreement on the date first written above.

**LANDLORD:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{landlord_name}} | |
| Print Name: {{landlord_name}} | |

{{#if landlord_agent}}
**LANDLORD'S AGENT:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{agent_name}} | |
| Title: {{agent_title}} | |
{{/if}}

**TENANT(S):**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{tenant_1_name}} | |

{{#if tenant_2_name}}
| _________________________________ | _____________ |
| {{tenant_2_name}} | |
{{/if}}

{{#if tenant_3_name}}
| _________________________________ | _____________ |
| {{tenant_3_name}} | |
{{/if}}

---

**Attachments:**
- [ ] Property Condition Report
- [ ] Rules and Regulations
- [ ] Lead Paint Disclosure (if applicable)
- [ ] Other: {{additional_attachments}}

---

**IMPORTANT LEGAL NOTICE:** This lease agreement should be reviewed by legal counsel to ensure compliance with federal, state, and local landlord-tenant laws. Lease terms should be tailored to specific property types and local regulations.

*Template generated by 123LegalDoc - Professional Legal Document Platform*
---
© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
