# Commercial Lease Agreement

---

**COMMERCIAL LEASE AGREEMENT**

This Commercial Lease Agreement ("Lease") is made and entered into on **{{lease_date}}**, by and between:

- **Landlord:** {{landlord_name}}, a {{landlord_entity_type}} organized under the laws of {{landlord_state}}, with its principal place of business at {{landlord_address}}

- **Tenant:** {{tenant_name}}, a {{tenant_entity_type}} organized under the laws of {{tenant_state}}, with its principal place of business at {{tenant_address}}

Collectively referred to herein as the "Parties."

---

## 1. Premises Description

### 1.1 Leased Premises

**Property Address:** {{property_address}}  
**City:** {{city}}, **State:** {{state}}, **ZIP:** {{zip_code}}  
**Legal Description:** {{legal_description}}

### 1.2 Property Details

**Building Name:** {{building_name}}  
**Suite/Unit Number:** {{suite_number}}  
**Total Square Footage:** {{total_square_feet}} square feet  
**Usable Square Footage:** {{usable_square_feet}} square feet  
**Property Type:** {{property_type}} (Office/Retail/Industrial/Warehouse/Other)

### 1.3 Included Areas

**Common Areas:** {{common_areas}}  
**Parking Spaces:** {{parking_spaces}} spaces  
**Storage Areas:** {{storage_areas}}  
**Other Inclusions:** {{other_inclusions}}

---

## 2. Lease Terms

### 2.1 Lease Period

**Lease Type:** {{lease_type}} (Gross/Net/Modified Gross/Triple Net)  
**Lease Commencement Date:** {{commencement_date}}  
**Lease Expiration Date:** {{expiration_date}}  
**Total Lease Term:** {{lease_term_years}} years, {{lease_term_months}} months

### 2.2 Renewal Options

{{#if renewal_options}}
**Renewal Terms:** Tenant has {{renewal_option_count}} option(s) to renew for {{renewal_term}} each, subject to {{renewal_terms}}.  
**Renewal Notice:** {{renewal_notice_days}} days written notice required.  
**Renewal Rent:** {{renewal_rent_terms}}
{{else}}
**No renewal options** are provided under this Lease.
{{/if}}

---

## 3. Rent and Additional Charges

### 3.1 Base Rent

**Annual Base Rent:** ${{annual_base_rent}}  
**Monthly Base Rent:** ${{monthly_base_rent}}  
**Per Square Foot Rate:** ${{rent_per_sq_ft}} per square foot annually  
**Rent Commencement Date:** {{rent_commencement_date}}

### 3.2 Rent Payment Terms

**Due Date:** {{rent_due_date}} of each month  
**Payment Method:** {{payment_method}}  
**Payment Address:** {{payment_address}}  
**Late Fee:** {{late_fee_percentage}}% of monthly rent or ${{late_fee_amount}}, whichever is greater  
**Grace Period:** {{grace_period}} days

### 3.3 Rent Increases

{{#if rent_increases}}
**Rent Escalation:** {{rent_escalation_type}}

- **Annual Increase:** {{annual_increase_percentage}}% per year
- **CPI Adjustment:** {{#if cpi_adjustment}}Based on Consumer Price Index{{/if}}
- **Market Rate Review:** {{#if market_rate_review}}Every {{market_review_years}} years{{/if}}
  {{/if}}

### 3.4 Additional Rent and Operating Expenses

{{#if operating_expenses}}
**Operating Expenses:** Tenant's proportionate share: {{tenant_expense_percentage}}%

**Included Operating Expenses:**

- Property taxes and assessments
- Insurance premiums
- Common area maintenance (CAM)
- Utilities for common areas
- Property management fees
- Repairs and maintenance
- {{additional_operating_expenses}}

**Expense Stop:** ${{expense_stop}} per square foot annually  
**Reconciliation:** Annual reconciliation provided by {{reconciliation_date}}
{{/if}}

---

## 4. Security Deposit and Additional Deposits

### 4.1 Security Deposit

**Security Deposit Amount:** ${{security_deposit}}  
**Purpose:** Secure faithful performance of Tenant's obligations  
**Return Terms:** Within {{deposit_return_days}} days after lease termination, less lawful deductions

### 4.2 Additional Deposits

{{#if additional_deposits}}
**First Month's Rent:** ${{monthly_base_rent}}  
**Last Month's Rent:** {{#if last_month_required}}${{monthly_base_rent}}{{else}}Not required{{/if}}  
**Utility Deposits:** {{utility_deposits}}  
**Key Deposit:** ${{key_deposit}}
{{/if}}

---

## 5. Permitted Use and Restrictions

### 5.1 Permitted Use

**Primary Use:** {{permitted_use}}  
**Business Type:** {{business_type}}  
**Operating Hours:** {{operating_hours}}  
**Zoning Classification:** {{zoning_classification}}

### 5.2 Prohibited Uses

Tenant shall not use the premises for:
{{prohibited_uses}}

### 5.3 Exclusive Use Provisions

{{#if exclusive_use}}
**Exclusive Rights:** {{exclusive_use_description}}
{{/if}}

---

## 6. Utilities and Services

### 6.1 Utilities Provided by Landlord

{{landlord_utilities}}

### 6.2 Utilities Provided by Tenant

{{tenant_utilities}}

### 6.3 After-Hours HVAC

{{#if after_hours_hvac}}
**Rate:** ${{hvac_hourly_rate}} per hour  
**Notice Required:** {{hvac_notice_hours}} hours advance notice
{{/if}}

---

## 7. Maintenance and Repairs

### 7.1 Landlord Responsibilities

Landlord shall maintain and repair:

- Structural components of the building
- Roof and exterior walls
- Common areas and facilities
- Building systems (HVAC, electrical, plumbing) serving multiple tenants
- {{landlord_maintenance_items}}

### 7.2 Tenant Responsibilities

Tenant shall maintain and repair:

- Interior of the premises
- Fixtures and equipment installed by Tenant
- HVAC systems serving only the premises
- {{tenant_maintenance_items}}

### 7.3 Emergency Repairs

**Emergency Contact:** {{emergency_contact}}  
**Emergency Phone:** {{emergency_phone}}

---

## 8. Insurance Requirements

### 8.1 Landlord's Insurance

Landlord shall maintain:

- Property insurance covering the building
- General liability insurance: ${{landlord_liability_minimum}}
- {{landlord_additional_insurance}}

### 8.2 Tenant's Insurance

Tenant shall maintain:

- **General Liability:** ${{tenant_liability_minimum}} per occurrence
- **Property Insurance:** Full replacement cost of Tenant's property
- **Business Interruption:** {{#if business_interruption_required}}${{business_interruption_amount}}{{else}}Not required{{/if}}
- **Workers' Compensation:** As required by law

### 8.3 Additional Insured

{{#if additional_insured_required}}
Landlord shall be named as additional insured on Tenant's liability policies.
{{/if}}

---

## 9. Alterations and Improvements

### 9.1 Tenant Improvements

**Approval Required:** All alterations require Landlord's prior written consent  
**Permitted Improvements:** {{permitted_improvements}}  
**Improvement Standards:** {{improvement_standards}}

### 9.2 Restoration Requirements

{{#if restoration_required}}
Upon lease termination, Tenant shall restore premises to original condition, except for normal wear and tear.
{{/if}}

### 9.3 Landlord Improvements

{{#if landlord_improvements}}
**Tenant Improvement Allowance:** ${{improvement_allowance}} per square foot  
**Completion Date:** {{improvement_completion_date}}
{{/if}}

---

## 10. Assignment and Subletting

### 10.1 Assignment Restrictions

**General Rule:** Tenant may not assign this Lease without Landlord's prior written consent.

### 10.2 Subletting Restrictions

**Subletting:** Permitted with {{subletting_approval_requirement}}  
**Subletting Fee:** ${{subletting_fee}}  
**Profit Sharing:** {{#if profit_sharing}}{{profit_sharing_percentage}}% of profits to Landlord{{/if}}

---

## 11. Default and Remedies

### 11.1 Events of Default

The following constitute default by Tenant:

- Non-payment of rent for {{default_cure_period}} days after written notice
- Violation of lease terms that remains uncured for {{lease_violation_cure_period}} days after written notice
- Bankruptcy or insolvency of Tenant
- {{additional_default_events}}

### 11.2 Landlord's Remedies

Upon default, Landlord may:

- Terminate this Lease
- Re-enter and re-let the premises
- Collect all unpaid rent and damages
- Pursue any other legal or equitable remedies

### 11.3 Late Payment

**Late Fee:** {{late_fee_percentage}}% of overdue amount  
**Interest Rate:** {{interest_rate}}% per annum on overdue amounts

---

## 12. Property Access and Inspections

### 12.1 Landlord Access Rights

Landlord may enter the premises:

- With {{inspection_notice_hours}} hours notice for inspections
- For emergency situations without notice
- To show premises to prospective tenants/buyers with reasonable notice
- {{additional_access_rights}}

### 12.2 Access Hours

**Normal Business Hours:** {{access_hours}}  
**After-Hours Access:** {{after_hours_access_policy}}

---

## 13. Environmental and Safety Compliance

### 13.1 Environmental Compliance

Both parties agree to comply with all environmental laws and regulations.

### 13.2 Hazardous Materials

**Prohibition:** {{hazardous_materials_policy}}  
**Tenant Certification:** Tenant certifies no hazardous materials will be used, stored, or disposed of on premises without proper permits.

### 13.3 ADA Compliance

{{ada_compliance_responsibility}}

---

## 14. Casualty and Condemnation

### 14.1 Casualty Damage

If premises are damaged by fire or other casualty:
{{casualty_provisions}}

### 14.2 Condemnation

If premises are taken by eminent domain:
{{condemnation_provisions}}

---

## 15. Parking

### 15.1 Parking Allocation

**Assigned Spaces:** {{assigned_parking_spaces}}  
**Visitor Spaces:** {{visitor_parking_spaces}}  
**Parking Fee:** {{#if parking_fee}}${{parking_fee_amount}} per space per month{{else}}Included in rent{{/if}}

### 15.2 Parking Rules

{{parking_rules}}

---

## 16. Signage

### 16.1 Permitted Signage

{{signage_rights}}

### 16.2 Signage Approval

All signage requires Landlord's prior written approval and must comply with local ordinances.

---

## 17. General Provisions

### 17.1 Governing Law

This Lease shall be governed by the laws of {{governing_state}}.

### 17.2 Entire Agreement

This Lease constitutes the entire agreement between the parties.

### 17.3 Amendment

This Lease may only be amended by written agreement signed by both parties.

### 17.4 Severability

If any provision is held invalid, the remainder shall remain in full force and effect.

### 17.5 Binding Effect

This Lease binds the parties, their heirs, successors, and assigns.

---

## 18. Special Provisions

{{special_provisions}}

---

## 19. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Commercial Lease Agreement as of the date first written above.

**LANDLORD:**

| Signature                                  | Date           |
| ------------------------------------------ | -------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{lease_date}} |
| {{landlord_name}}                          |                |
| By: {{landlord_signatory}}                 |                |
| Title: {{landlord_title}}                  |                |

**TENANT:**

| Signature                                  | Date           |
| ------------------------------------------ | -------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{lease_date}} |
| {{tenant_name}}                            |                |
| By: {{tenant_signatory}}                   |                |
| Title: {{tenant_title}}                    |                |

---

### Notarization

**State of {{state}}**  
**County of {{county}}**

[Standard notarization block as required by state law]

---

**IMPORTANT LEGAL NOTICE:** This commercial lease agreement should be reviewed by qualified legal counsel to ensure compliance with local laws and specific business requirements. Commercial lease terms vary significantly by location and property type.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
