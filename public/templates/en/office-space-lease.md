# Office Space Lease

---

**OFFICE SPACE LEASE AGREEMENT**

This Office Space Lease Agreement ("Lease") is made and entered into on **{{lease_date}}**, by and between:

- **Landlord:** {{landlord_name}}, a {{landlord_entity_type}} with address at {{landlord_address}}

- **Tenant:** {{tenant_name}}, a {{tenant_entity_type}} organized under the laws of {{tenant_state}}, with its principal place of business at {{tenant_address}}

Collectively referred to herein as the "Parties."

---

## 1. Leased Premises

### 1.1 Property Description
**Building Address:** {{building_address}}
**Suite/Unit Number:** {{suite_number}}
**Floor:** {{floor_number}}
**Rentable Square Feet:** {{rentable_square_feet}} sq ft
**Usable Square Feet:** {{usable_square_feet}} sq ft

### 1.2 Property Details
- **Building Type:** {{building_type}}
- **Year Built:** {{year_built}}
- **Building Class:** {{building_class}}
- **Total Building Size:** {{total_building_size}} sq ft
- **Parking Spaces:** {{parking_spaces}} spaces

### 1.3 Included Areas
The leased premises include:
- {{included_area_1}}
- {{included_area_2}}
- {{included_area_3}}
- Use of common areas as designated by Landlord

### 1.4 Permitted Use
The premises may be used only for: {{permitted_use}}

No other use is permitted without Landlord's prior written consent.

---

## 2. Lease Term

### 2.1 Initial Term
**Lease Commencement Date:** {{commencement_date}}
**Lease Expiration Date:** {{expiration_date}}
**Initial Term:** {{initial_term}} years

### 2.2 Early Occupancy
{{#if early_occupancy}}
Tenant may occupy premises early beginning {{early_occupancy_date}} under the same terms as this Lease.
{{/if}}

### 2.3 Renewal Options
{{#if renewal_options}}
Tenant has {{number_of_renewals}} option(s) to renew for {{renewal_term}} year periods each, subject to:
- Written notice {{renewal_notice_period}} months before expiration
- No uncured defaults under this Lease
- Market rate rent adjustment
{{/if}}

### 2.4 Holdover
If Tenant remains after lease expiration without agreement:
- Tenancy becomes month-to-month
- Rent increases to {{holdover_rent_multiplier}}x the last monthly rent
- All other lease terms remain in effect

---

## 3. Rent and Additional Charges

### 3.1 Base Rent
**Monthly Base Rent:**
- Year 1: ${{year_1_rent}} per month (${{year_1_psf}} per sq ft)
- Year 2: ${{year_2_rent}} per month (${{year_2_psf}} per sq ft)
- Year 3: ${{year_3_rent}} per month (${{year_3_psf}} per sq ft)
- {{additional_years_rent}}

### 3.2 Rent Escalations
{{#if rent_escalations}}
**Escalation Method:** {{escalation_method}}
- Annual increase: {{annual_increase}}%
- CPI adjustments: {{cpi_adjustment_terms}}
- Market rate reviews: {{market_review_terms}}
{{/if}}

### 3.3 Additional Rent
Tenant shall pay the following additional charges:
- **Common Area Maintenance (CAM):** ${{cam_rate}} per sq ft annually
- **Property Taxes:** {{tax_allocation_method}}
- **Insurance:** {{insurance_allocation_method}}
- **Utilities:** {{utility_allocation}}

### 3.4 Operating Expense Escalations
{{#if expense_escalations}}
**Base Year:** {{base_year}}
**Tenant's Share:** {{tenant_percentage}}% of building
Tenant pays proportionate share of increases over base year expenses.
{{/if}}

### 3.5 Payment Terms
- Rent due on the 1st of each month
- Late fee of {{late_fee_amount}} if paid after {{grace_period}} days
- NSF fee: ${{nsf_fee}} per occurrence
- Annual reconciliation of operating expenses

---

## 4. Security Deposit and Prepaid Rent

### 4.1 Security Deposit
**Security Deposit Amount:** ${{security_deposit}}
- Held as security for performance of lease obligations
- Not considered prepaid rent
- Returned within {{deposit_return_period}} days after lease termination

### 4.2 Prepaid Rent
**First Month's Rent:** ${{first_month_rent}}
**Last Month's Rent:** ${{last_month_rent}} (if applicable)

### 4.3 Letter of Credit
{{#if letter_of_credit}}
In lieu of cash deposit, Tenant may provide an irrevocable letter of credit for ${{loc_amount}}.
{{/if}}

---

## 5. Tenant Improvements and Build-Out

### 5.1 Condition of Premises
{{#if as_is_condition}}
Tenant accepts premises in "as-is" condition.
{{else}}
Landlord will deliver premises in the following condition: {{delivery_condition}}
{{/if}}

### 5.2 Tenant Improvement Allowance
{{#if improvement_allowance}}
**TI Allowance:** ${{ti_allowance}} per sq ft (${{total_ti_allowance}} total)
**Allowable Uses:** {{ti_allowable_uses}}
**Approval Process:** {{ti_approval_process}}
**Deadline:** Improvements must be completed by {{ti_deadline}}
{{/if}}

### 5.3 Construction Requirements
All tenant improvements must:
- Comply with building standards and codes
- Receive Landlord's prior written approval
- Use Landlord-approved contractors
- Obtain necessary permits
- Provide warranties and lien waivers

### 5.4 Restoration Requirements
{{#if restoration_required}}
Upon lease termination, Tenant shall restore premises to original condition, excluding normal wear and tear.
{{else}}
No restoration required for standard office improvements.
{{/if}}

---

## 6. Maintenance and Repairs

### 6.1 Landlord Responsibilities
Landlord shall maintain and repair:
- Structural elements of the building
- Roof and exterior walls
- Common areas and facilities
- Building systems (HVAC, electrical, plumbing)
- {{additional_landlord_responsibilities}}

### 6.2 Tenant Responsibilities
Tenant shall maintain and repair:
- Interior of leased premises
- Tenant's equipment and fixtures
- Interior non-structural walls
- Floor coverings and window treatments
- {{additional_tenant_responsibilities}}

### 6.3 HVAC Services
{{#if hvac_included}}
**HVAC Service:** Included during building standard hours ({{standard_hours}})
**After-Hours HVAC:** ${{after_hours_hvac_rate}} per hour
{{else}}
Tenant responsible for HVAC maintenance and utility costs.
{{/if}}

### 6.4 Janitorial Services
{{#if janitorial_included}}
**Janitorial Service:** {{janitorial_frequency}} cleaning included
**Service Level:** {{janitorial_scope}}
{{else}}
Tenant responsible for janitorial services.
{{/if}}

---

## 7. Utilities and Services

### 7.1 Utility Allocation
**Electricity:** {{electricity_allocation}}
**Gas:** {{gas_allocation}}
**Water/Sewer:** {{water_allocation}}
**Telecommunications:** {{telecom_allocation}}
**Internet:** {{internet_allocation}}

### 7.2 Utility Deposits
{{#if utility_deposits_required}}
Tenant responsible for utility deposits and connection fees.
{{/if}}

### 7.3 Building Services
Included building services:
- {{building_service_1}}
- {{building_service_2}}
- {{building_service_3}}
- Security services: {{security_services}}

### 7.4 Service Interruptions
Landlord not liable for utility or service interruptions beyond Landlord's control, except for extended outages exceeding {{service_interruption_threshold}} consecutive days.

---

## 8. Insurance and Liability

### 8.1 Tenant Insurance Requirements
Tenant shall maintain:
- **General Liability:** ${{general_liability_amount}} per occurrence
- **Property Insurance:** Full replacement cost of tenant's property
- **Workers' Compensation:** As required by law
- **Business Interruption:** {{business_interruption_amount}}

### 8.2 Landlord Insurance
Landlord shall maintain:
- Property insurance on building and common areas
- General liability insurance
- Loss of rents insurance

### 8.3 Insurance Requirements
All insurance must:
- Name Landlord as additional insured
- Provide {{insurance_notice_period}} days notice of cancellation
- Include waiver of subrogation clause
- Be primary and non-contributory

### 8.4 Indemnification
{{#if mutual_indemnification}}
Each party shall indemnify the other for claims arising from their respective negligence or misconduct.
{{else}}
Tenant shall indemnify Landlord for claims arising from Tenant's use of the premises.
{{/if}}

---

## 9. Assignment and Subletting

### 9.1 Assignment Restrictions
Tenant may not assign this Lease without Landlord's prior written consent, which shall not be unreasonably withheld.

### 9.2 Subletting
{{#if subletting_allowed}}
Tenant may sublet with Landlord's consent, subject to:
- Sublessee meeting Landlord's creditworthiness standards
- Sublease terms consistent with this Lease
- {{subletting_conditions}}
{{else}}
Subletting is prohibited without Landlord's express written consent.
{{/if}}

### 9.3 Assignment/Subletting Fees
**Processing Fee:** ${{assignment_fee}}
**Legal Review Fee:** ${{legal_review_fee}}

### 9.4 Recapture Rights
{{#if recapture_rights}}
Landlord may recapture space if Tenant seeks to assign or sublet more than {{recapture_threshold}}% of the premises.
{{/if}}

---

## 10. Default and Remedies

### 10.1 Tenant Default
Tenant shall be in default if:
- Rent is unpaid for {{rent_default_period}} days after written notice
- Other lease violations remain uncured {{cure_period}} days after notice
- Tenant becomes insolvent or files bankruptcy
- Tenant abandons the premises

### 10.2 Landlord Remedies
Upon tenant default, Landlord may:
- Terminate the lease and re-enter premises
- Re-let premises and collect damages
- Continue lease and sue for rent
- Pursue any other legal remedies

### 10.3 Landlord Default
{{#if landlord_default_provisions}}
Landlord shall be in default if material obligations remain unperformed for {{landlord_cure_period}} days after written notice.

**Tenant Remedies:**
- Self-help and offset costs against rent
- Terminate lease for material defaults
- Sue for damages
{{/if}}

### 10.4 Late Charges
**Late Fee:** {{late_fee_amount}} if rent paid after {{grace_period}} days
**Interest Rate:** {{interest_rate}}% per annum on overdue amounts

---

## 11. Rules and Regulations

### 11.1 Building Rules
Tenant shall comply with building rules and regulations, including:
- {{building_rule_1}}
- {{building_rule_2}}
- {{building_rule_3}}
- Parking regulations: {{parking_rules}}

### 11.2 Hours of Operation
**Building Hours:** {{building_hours}}
**Access:** {{access_policy}}
**After-Hours Access:** {{after_hours_access}}

### 11.3 Signage
{{#if signage_rights}}
**Permitted Signage:** {{signage_description}}
**Approval Required:** All signage subject to Landlord approval
**Sign Standards:** {{sign_standards}}
{{else}}
No exterior signage permitted without Landlord's written consent.
{{/if}}

### 11.4 Parking
{{#if parking_included}}
**Included Parking:** {{included_parking_spaces}} spaces
**Additional Parking:** ${{additional_parking_rate}} per space per month
**Parking Rules:** {{parking_regulations}}
{{else}}
Parking available at ${{parking_rate}} per space per month.
{{/if}}

---

## 12. Environmental and Compliance

### 12.1 Environmental Compliance
Tenant shall not:
- Use or store hazardous materials without disclosure and approval
- Violate environmental laws or regulations
- Cause environmental contamination

### 12.2 ADA Compliance
{{#if ada_compliance}}
**Building Compliance:** Building meets ADA requirements for common areas
**Tenant Improvements:** Tenant responsible for ADA compliance in leased premises
{{/if}}

### 12.3 Code Compliance
Tenant shall comply with all applicable:
- Building codes and ordinances
- Fire and safety regulations
- Zoning requirements
- Health department regulations

---

## 13. Casualty and Condemnation

### 13.1 Casualty Damage
If premises are damaged:
- **Minor Damage:** Landlord repairs, rent abates proportionally
- **Major Damage:** Either party may terminate if repair time exceeds {{repair_threshold}} days
- **Total Destruction:** Lease terminates automatically

### 13.2 Condemnation
If premises are condemned:
- **Total Taking:** Lease terminates on taking date
- **Partial Taking:** Lease continues with rent adjustment if premises remain suitable
- **Award Allocation:** {{condemnation_award_allocation}}

---

## 14. Quiet Enjoyment and Access

### 14.1 Quiet Enjoyment
Landlord grants Tenant quiet enjoyment of premises, subject to lease terms and building rules.

### 14.2 Landlord Access
Landlord may enter premises:
- Upon {{access_notice_period}} hours notice for inspections
- Without notice in emergencies
- To show space to prospective tenants/buyers
- To perform maintenance and repairs

---

## 15. General Provisions

### 15.1 Governing Law
This Lease shall be governed by the laws of {{governing_state}}.

### 15.2 Dispute Resolution
{{#if arbitration}}
Disputes shall be resolved through binding arbitration in {{arbitration_location}}.
{{else}}
Disputes shall be resolved in the courts of {{jurisdiction}}.
{{/if}}

### 15.3 Entire Agreement
This Lease constitutes the entire agreement and supersedes all prior negotiations.

### 15.4 Amendment
This Lease may only be amended in writing signed by both parties.

### 15.5 Severability
Invalid provisions shall not affect the validity of remaining provisions.

### 15.6 Notices
All notices must be in writing and delivered to addresses specified above.

---

## 16. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Lease as of the date first written above.

**LANDLORD:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{landlord_name}} | |
| {{landlord_title}} | |

**TENANT:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{tenant_name}} | |
| By: {{tenant_signatory}} | |
| Title: {{tenant_title}} | |

---

**IMPORTANT LEGAL NOTICE:** This office space lease should be reviewed by qualified real estate professionals and legal counsel to ensure compliance with local landlord-tenant laws and proper protection of interests. Commercial lease terms should be carefully negotiated based on market conditions and specific requirements.

*Template generated by 123LegalDoc - Professional Legal Document Platform*