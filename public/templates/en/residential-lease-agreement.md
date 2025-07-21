# Residential Lease Agreement

**RESIDENTIAL LEASE AGREEMENT**

---

**Property Address:** {{property_address}}  
**Landlord:** {{landlord_name}}  
**Tenant(s):** {{tenant_names}}  
**Lease Term:** {{lease_start_date}} to {{lease_end_date}}

---

## 1. Property and Parties

### 1.1 Leased Premises

**Property Address:** {{property_address}}  
**Unit/Apt Number:** {{unit_number}}  
**City, State, ZIP:** {{city}}, {{state}} {{zip_code}}

**Property Description:** {{property_description}}

### 1.2 Landlord Information

**Landlord Name:** {{landlord_name}}  
**Landlord Address:** {{landlord_address}}  
**Phone:** {{landlord_phone}}  
**Email:** {{landlord_email}}

### 1.3 Tenant Information

{{#each tenants}}
**Tenant {{@index}}:** {{name}}  
**Phone:** {{phone}}  
**Email:** {{email}}
{{/each}}

---

## 2. Lease Terms

### 2.1 Lease Duration

**Lease Type:** {{lease_type}}  
**Lease Start Date:** {{lease_start_date}}  
**Lease End Date:** {{lease_end_date}}  
**Total Lease Term:** {{lease_duration}}

### 2.2 Occupancy Limits

**Maximum Occupants:** {{max_occupants}}  
**Authorized Occupants:** {{authorized_occupants}}

---

## 3. Rent and Financial Terms

### 3.1 Monthly Rent

**Monthly Rent Amount:** ${{monthly_rent}}  
**Due Date:** {{rent_due_date}} of each month  
**Late Fee:** {{late_fee_amount}} if paid after {{late_fee_grace_period}}  
**Payment Method:** {{payment_method}}

### 3.2 Security Deposit

**Security Deposit Amount:** ${{security_deposit}}  
**Pet Deposit:** {{#if pets_allowed}}${{pet_deposit}}{{else}}N/A - No pets allowed{{/if}}  
**Deposit Held At:** {{deposit_location}}

### 3.3 Additional Fees

{{#if additional_fees}}
**Application Fee:** ${{application_fee}}  
**Cleaning Fee:** ${{cleaning_fee}}  
**Other Fees:** {{other_fees}}
{{/if}}

### 3.4 Utilities and Services

**Utilities Included:** {{utilities_included}}  
**Utilities Paid by Tenant:** {{utilities_tenant_pays}}  
**Internet/Cable:** {{internet_cable_arrangement}}

---

## 4. Use of Property

### 4.1 Residential Use Only

The property shall be used solely as a private residence for the named tenants.

### 4.2 Occupancy Rules

- Only authorized occupants may reside on the property
- No subletting without written landlord consent
- {{occupancy_restrictions}}

### 4.3 Prohibited Activities

- No illegal activities
- No commercial use without written consent
- {{prohibited_activities}}

---

## 5. Maintenance and Repairs

### 5.1 Landlord Responsibilities

Landlord shall maintain:
- Structural integrity of the property
- Major appliances (if provided): {{included_appliances}}
- HVAC, plumbing, and electrical systems
- {{landlord_maintenance_items}}

### 5.2 Tenant Responsibilities

Tenant shall:
- Keep the property clean and sanitary
- Report maintenance issues promptly
- Change air filters regularly
- {{tenant_maintenance_duties}}

### 5.3 Repair Requests

**Repair Request Method:** {{repair_request_method}}  
**Emergency Contact:** {{emergency_contact}}  
**Response Time:** {{repair_response_time}}

---

## 6. Property Rules and Regulations

### 6.1 Pets Policy

{{#if pets_allowed}}
**Pets Allowed:** {{pet_policy_details}}  
**Pet Deposit:** ${{pet_deposit}}  
**Pet Restrictions:** {{pet_restrictions}}
{{else}}
**No pets allowed** without written consent from landlord.
{{/if}}

### 6.2 Smoking Policy

{{smoking_policy}}

### 6.3 Noise and Disturbance

Tenant agrees to:
- Keep noise levels reasonable
- Respect neighbors' quiet enjoyment
- {{noise_restrictions}}

### 6.4 Parking

**Parking Spaces:** {{parking_spaces}}  
**Parking Rules:** {{parking_rules}}  
**Visitor Parking:** {{visitor_parking}}

---

## 7. Landlord Access and Entry

### 7.1 Right of Entry

Landlord may enter the property with {{entry_notice_period}} hours notice for:
- Routine inspections
- Necessary repairs
- Showing to prospective tenants/buyers

### 7.2 Emergency Entry

Landlord may enter without notice in emergencies.

---

## 8. Alterations and Improvements

### 8.1 Tenant Modifications

{{modification_policy}}

### 8.2 Fixture Installation

{{fixture_installation_rules}}

---

## 9. Insurance and Liability

### 9.1 Renter's Insurance

{{#if renters_insurance_required}}
**Renter's Insurance:** Required with minimum coverage of ${{insurance_minimum_amount}}
{{else}}
**Renter's Insurance:** Recommended but not required
{{/if}}

### 9.2 Liability

- Landlord not liable for tenant's personal property
- Tenant liable for damage beyond normal wear and tear
- {{liability_provisions}}

---

## 10. Termination

### 10.1 End of Lease Term

{{end_of_lease_procedure}}

### 10.2 Early Termination

{{#if early_termination_allowed}}
**Early Termination:** Allowed with {{early_termination_notice}} notice and payment of {{early_termination_fee}}
{{else}}
**Early Termination:** Not permitted except as required by law
{{/if}}

### 10.3 Eviction

Grounds for eviction include:
- Non-payment of rent
- Violation of lease terms
- Illegal activities
- {{additional_eviction_grounds}}

### 10.4 Move-Out Requirements

**Notice Required:** {{move_out_notice}}  
**Move-Out Inspection:** {{move_out_inspection_procedure}}  
**Deposit Return:** Within {{deposit_return_timeframe}} after move-out

---

## 11. Legal Compliance

### 11.1 Fair Housing

This lease complies with all fair housing laws and anti-discrimination regulations.

### 11.2 Lead Paint Disclosure

{{lead_paint_disclosure}}

### 11.3 Other Disclosures

{{other_required_disclosures}}

---

## 12. Additional Terms

{{additional_lease_terms}}

---

## 13. Governing Law

This lease agreement is governed by the laws of {{governing_state}}.

---

## 14. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Residential Lease Agreement on {{agreement_date}}.

**LANDLORD:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{landlord_name}}                          |                    |
| Print Name: {{landlord_name}}              |                    |

**TENANT(S):**

{{#each tenants}}
**{{name}}:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{name}}                                   |                    |
| Print Name: {{name}}                       |                    |

{{/each}}

---

**IMPORTANT LEGAL NOTICE:** This Residential Lease Agreement should be reviewed by a qualified real estate attorney to ensure compliance with local, state, and federal housing laws. Rental agreements should be customized for specific property requirements and jurisdictional regulations.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
