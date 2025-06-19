# Real Estate Purchase Agreement

---

**REAL ESTATE PURCHASE AGREEMENT**

This Real Estate Purchase Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between:

- **Seller:** {{seller_name}}, {{seller_entity_type}} with address at {{seller_address}}

- **Buyer:** {{buyer_name}}, {{buyer_entity_type}} with address at {{buyer_address}}

Collectively referred to herein as the "Parties."

---

## 1. Property Description

### 1.1 Property Address
The property subject to this Agreement is located at:
**{{property_address}}**

### 1.2 Legal Description
**Legal Description:** {{legal_description}}
**Parcel ID/APN:** {{parcel_id}}
**County:** {{property_county}}
**State:** {{property_state}}

### 1.3 Property Details
- **Property Type:** {{property_type}}
- **Year Built:** {{year_built}}
- **Square Footage:** {{square_footage}} sq ft
- **Lot Size:** {{lot_size}}
- **Bedrooms:** {{bedrooms}}
- **Bathrooms:** {{bathrooms}}

### 1.4 Included Items
The following items are included in the sale:
{{included_items}}

### 1.5 Excluded Items
The following items are excluded from the sale:
{{excluded_items}}

---

## 2. Purchase Price and Financial Terms

### 2.1 Purchase Price
The total purchase price for the Property is: **${{purchase_price}}**

### 2.2 Payment Structure
**Earnest Money:** ${{earnest_money}} due upon execution of this Agreement
**Down Payment:** ${{down_payment}} due at closing
**Financing Amount:** ${{financing_amount}}
**Cash at Closing:** ${{cash_at_closing}}

### 2.3 Earnest Money Deposit
- **Amount:** ${{earnest_money}}
- **Due Date:** {{earnest_money_due_date}}
- **Held By:** {{earnest_money_holder}}
- **Account:** {{earnest_money_account}}

### 2.4 Financing Contingency
{{#if financing_contingency}}
This Agreement is contingent upon Buyer obtaining financing as follows:
- **Loan Type:** {{loan_type}}
- **Loan Amount:** ${{loan_amount}}
- **Interest Rate:** Not to exceed {{max_interest_rate}}%
- **Loan Term:** {{loan_term}} years
- **Financing Deadline:** {{financing_deadline}}
{{else}}
This is a cash purchase with no financing contingency.
{{/if}}

---

## 3. Contingencies and Conditions

### 3.1 Inspection Contingency
{{#if inspection_contingency}}
**Inspection Period:** {{inspection_period}} days from execution
**Inspector Selection:** Buyer's choice of qualified inspector
**Inspection Scope:** {{inspection_scope}}
**Resolution Period:** {{inspection_resolution_period}} days after inspection report
{{else}}
Property is sold "as-is" with no inspection contingency.
{{/if}}

### 3.2 Appraisal Contingency
{{#if appraisal_contingency}}
This Agreement is contingent upon the Property appraising at or above the purchase price within {{appraisal_period}} days.
{{/if}}

### 3.3 Title Contingency
Sale is contingent upon Buyer's approval of title within {{title_review_period}} days. Title must be marketable and insurable.

### 3.4 Survey Contingency
{{#if survey_contingency}}
**Survey Required:** {{survey_type}}
**Survey Period:** {{survey_period}} days
**Survey Standards:** {{survey_standards}}
{{/if}}

### 3.5 HOA/Condo Contingency
{{#if hoa_contingency}}
Buyer shall have {{hoa_review_period}} days to review HOA documents including:
- HOA bylaws and covenants
- Financial statements
- Meeting minutes
- Assessment schedules
{{/if}}

---

## 4. Property Condition and Disclosures

### 4.1 Property Condition
Seller represents that the Property is in the following condition:
{{property_condition_description}}

### 4.2 Known Defects
Seller discloses the following known defects or issues:
{{known_defects}}

### 4.3 Environmental Disclosures
{{#if environmental_disclosures}}
Environmental conditions disclosed:
{{environmental_disclosures_list}}
{{/if}}

### 4.4 Lead Paint Disclosure
{{#if lead_paint_disclosure}}
For properties built before 1978: {{lead_paint_disclosure_details}}
{{/if}}

### 4.5 Utilities and Systems
- **Heating:** {{heating_system}}
- **Air Conditioning:** {{cooling_system}}
- **Plumbing:** {{plumbing_system}}
- **Electrical:** {{electrical_system}}
- **Water Source:** {{water_source}}
- **Sewer/Septic:** {{sewer_system}}

---

## 5. Closing Details

### 5.1 Closing Date
The closing shall take place on or before **{{closing_date}}** at {{closing_time}} at the office of {{closing_agent}}.

### 5.2 Closing Agent
**Title Company/Attorney:** {{closing_agent_name}}
**Address:** {{closing_agent_address}}
**Contact:** {{closing_agent_contact}}

### 5.3 Possession
Possession of the Property shall be delivered to Buyer:
{{#if possession_at_closing}}
At closing upon recording of the deed
{{else}}
On {{possession_date}} at {{possession_time}}
{{/if}}

### 5.4 Prorations
The following items shall be prorated as of the closing date:
- Property taxes
- HOA fees (if applicable)
- Utilities (if assumed)
- {{additional_prorations}}

---

## 6. Title and Deed

### 6.1 Title Insurance
{{#if buyer_title_insurance}}
Buyer shall obtain owner's title insurance in the amount of the purchase price.
{{/if}}

{{#if seller_title_insurance}}
Seller shall provide title insurance as follows: {{seller_title_insurance_details}}
{{/if}}

### 6.2 Type of Deed
Seller shall convey title by: {{deed_type}}

### 6.3 Title Exceptions
Title shall be subject only to:
- Matters of record acceptable to Buyer
- Current year's property taxes
- {{acceptable_title_exceptions}}

### 6.4 Title Problems
If title problems are discovered, Seller shall have {{title_cure_period}} days to cure such problems.

---

## 7. Closing Costs

### 7.1 Seller's Costs
Seller shall pay the following closing costs:
- {{seller_closing_cost_1}}
- {{seller_closing_cost_2}}
- {{seller_closing_cost_3}}
- Real estate commission: {{commission_rate}}%

### 7.2 Buyer's Costs
Buyer shall pay the following closing costs:
- {{buyer_closing_cost_1}}
- {{buyer_closing_cost_2}}
- {{buyer_closing_cost_3}}
- Loan origination fees and costs

### 7.3 Shared Costs
The following costs shall be shared equally:
{{shared_closing_costs}}

---

## 8. Default and Remedies

### 8.1 Buyer Default
If Buyer defaults, Seller may:
- Retain earnest money as liquidated damages
- Seek specific performance
- Pursue other legal remedies

### 8.2 Seller Default
If Seller defaults, Buyer may:
- Seek return of earnest money
- Seek specific performance
- Pursue damages
- Other legal remedies

### 8.3 Dispute Resolution
{{#if arbitration}}
Disputes shall be resolved through binding arbitration in {{arbitration_location}}.
{{else}}
Disputes shall be resolved in the courts of {{jurisdiction}}.
{{/if}}

---

## 9. Additional Terms and Conditions

### 9.1 Time is of the Essence
Time is of the essence regarding all dates and deadlines in this Agreement.

### 9.2 Extensions
Any extensions must be agreed to in writing by both parties.

### 9.3 Assignment
{{#if assignment_allowed}}
This Agreement may be assigned by Buyer with Seller's written consent.
{{else}}
This Agreement may not be assigned without written consent of both parties.
{{/if}}

### 9.4 Survival
The following provisions shall survive closing:
- Warranties and representations
- Environmental disclosures
- {{surviving_provisions}}

---

## 10. Risk of Loss

### 10.1 Insurance
{{#if seller_maintains_insurance}}
Seller shall maintain insurance on the Property until closing.
{{/if}}

### 10.2 Damage Before Closing
If the Property is damaged before closing:
- Damage less than {{minor_damage_threshold}}% of purchase price: Seller repairs
- Damage greater than {{major_damage_threshold}}% of purchase price: Buyer may terminate
- Insurance proceeds assigned to {{insurance_proceeds_recipient}}

---

## 11. Representations and Warranties

### 11.1 Seller Representations
Seller represents and warrants:
- Legal authority to sell the Property
- No pending legal actions affecting the Property
- No violations of zoning or building codes
- {{additional_seller_representations}}

### 11.2 Buyer Representations
Buyer represents and warrants:
- Legal authority to purchase the Property
- Adequate financial resources to complete the purchase
- {{additional_buyer_representations}}

---

## 12. General Provisions

### 12.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### 12.2 Entire Agreement
This Agreement constitutes the entire agreement and supersedes all prior negotiations.

### 12.3 Amendment
This Agreement may only be amended in writing signed by both parties.

### 12.4 Severability
If any provision is held invalid, the remainder shall remain in effect.

### 12.5 Notices
All notices must be in writing and delivered to the addresses specified above.

### 12.6 Counterparts
This Agreement may be signed in counterparts, including electronic signatures.

---

## 13. Signatures

**IN WITNESS WHEREOF**, the parties have executed this Agreement as of the date first written above.

**SELLER:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{seller_name}} | |
| {{seller_title}} | |

**BUYER:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{buyer_name}} | |
| {{buyer_title}} | |

---

**IMPORTANT LEGAL NOTICE:** This real estate purchase agreement should be reviewed by qualified real estate professionals and legal counsel to ensure compliance with local and state laws. Real estate transactions involve significant legal and financial considerations.

*Template generated by 123LegalDoc - Professional Legal Document Platform*