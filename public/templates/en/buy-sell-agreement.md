# Buy-Sell Agreement

---

**BUY-SELL AGREEMENT**

This Buy-Sell Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between the owners of {{company_name}}, a {{company_entity_type}} organized under the laws of {{company_state}} (the "Company"):

**Owners:**
{{#each owners}}
- **{{name}}:** {{percentage}}% ownership, {{address}}
{{/each}}

Collectively referred to herein as the "Owners."

---

## 1. Purpose and Overview

### 1.1 Agreement Purpose
This Agreement establishes the terms and conditions for the purchase and sale of ownership interests in the Company upon the occurrence of specified triggering events.

### 1.2 Company Information
- **Company Name:** {{company_name}}
- **Entity Type:** {{company_entity_type}}
- **State of Formation:** {{company_state}}
- **Principal Business:** {{business_description}}
- **Total Outstanding Interests:** {{total_interests}}

### 1.3 Current Ownership
| Owner | Ownership Percentage | Number of Shares/Units |
|-------|---------------------|----------------------|
{{#each owners}}
| {{name}} | {{percentage}}% | {{shares_units}} |
{{/each}}

---

## 2. Triggering Events

### 2.1 Mandatory Buy-Sell Events
The following events shall trigger mandatory sale of ownership interests:

**Death:** Upon the death of an Owner, their interest must be sold to the remaining Owners or the Company.

**Disability:** Upon an Owner becoming permanently disabled (as defined in Section 2.3), their interest may be purchased.

**Retirement:** Upon an Owner's retirement at age {{retirement_age}} or after {{years_of_service}} years of service.

**Involuntary Termination:** Upon termination of an Owner's employment for cause.

### 2.2 Optional Buy-Sell Events
The following events may trigger sale at the option of the Company or remaining Owners:

**Voluntary Termination:** When an Owner voluntarily leaves the Company.

**Divorce:** When an Owner's ownership interest becomes subject to divorce proceedings.

**Bankruptcy:** When an Owner files for bankruptcy or becomes insolvent.

**Attempted Transfer:** When an Owner attempts to transfer their interest to a third party.

### 2.3 Disability Definition
"Permanent disability" means the inability to perform essential job functions for {{disability_period}} consecutive months, as determined by {{disability_determination_method}}.

---

## 3. Valuation Methods

### 3.1 Primary Valuation Method
The value of ownership interests shall be determined using: {{primary_valuation_method}}

{{#if appraisal_method}}
### 3.2 Professional Appraisal
- **Appraiser Selection:** {{appraiser_selection_process}}
- **Appraisal Standards:** {{appraisal_standards}}
- **Appraisal Timeline:** {{appraisal_timeline}}
- **Cost Allocation:** {{appraisal_cost_allocation}}
{{/if}}

{{#if formula_method}}
### 3.3 Formula Valuation
The formula for determining value is: {{valuation_formula}}
- **Base Multiple:** {{base_multiple}}
- **Financial Metrics:** {{financial_metrics}}
- **Adjustment Factors:** {{adjustment_factors}}
{{/if}}

{{#if fixed_price}}
### 3.4 Fixed Price Method
- **Current Fixed Price:** ${{fixed_price_amount}} per {{unit_type}}
- **Price Update Schedule:** {{price_update_schedule}}
- **Price Review Process:** {{price_review_process}}
{{/if}}

### 3.5 Discounts and Premiums
- **Minority Interest Discount:** {{minority_discount}}%
- **Lack of Marketability Discount:** {{marketability_discount}}%
- **Control Premium:** {{control_premium}}%

---

## 4. Purchase Rights and Obligations

### 4.1 Right of First Refusal
Upon a triggering event, the following purchase priority applies:
1. **Company Purchase Right:** {{company_purchase_right_period}} days
2. **Remaining Owners:** {{owners_purchase_right_period}} days
3. **Pro Rata Allocation:** Based on current ownership percentages

### 4.2 Mandatory Purchase Obligations
{{#if mandatory_purchase}}
The Company and/or remaining Owners are obligated to purchase in the following situations:
- {{mandatory_purchase_situations}}
{{else}}
All purchases under this Agreement are at the option of the purchasing party.
{{/if}}

### 4.3 Purchase Process
1. **Notice of Triggering Event:** Written notice within {{notice_period}} days
2. **Valuation Determination:** {{valuation_timeline}} days
3. **Purchase Decision:** {{purchase_decision_period}} days
4. **Closing:** {{closing_period}} days after purchase decision

---

## 5. Payment Terms

### 5.1 Payment Structure
**Payment Method:** {{payment_method}}

{{#if cash_payment}}
- **Cash Payment:** {{cash_percentage}}% at closing
{{/if}}

{{#if installment_payment}}
- **Installment Payments:** {{installment_percentage}}% over {{installment_period}} years
- **Interest Rate:** {{interest_rate}}% per annum
- **Payment Schedule:** {{payment_schedule}}
{{/if}}

### 5.2 Security for Installment Payments
{{#if installment_security}}
Installment payments shall be secured by: {{installment_security_method}}
{{/if}}

### 5.3 Acceleration Clauses
Payment acceleration may occur upon:
- Default in payment for {{default_period}} days
- Breach of non-compete agreement
- Other material breach: {{other_breach_conditions}}

---

## 6. Funding Sources

### 6.1 Company Redemption
{{#if company_funded}}
The Company may fund purchases using:
- Available cash reserves
- Company borrowing capacity
- {{company_funding_sources}}
{{/if}}

### 6.2 Cross-Purchase by Owners
{{#if cross_purchase}}
Individual Owners may purchase using:
- Personal funds
- Personal borrowing
- {{owner_funding_sources}}
{{/if}}

### 6.3 Life Insurance
{{#if life_insurance}}
The following life insurance arrangements are in place:
- **Policy Owner:** {{life_insurance_owner}}
- **Beneficiary:** {{life_insurance_beneficiary}}
- **Coverage Amount:** ${{life_insurance_amount}} per Owner
- **Premium Payment:** {{premium_payment_responsibility}}
{{/if}}

### 6.4 Disability Insurance
{{#if disability_insurance}}
Disability insurance arrangements:
- **Coverage Amount:** ${{disability_insurance_amount}}
- **Benefit Period:** {{disability_benefit_period}}
- **Elimination Period:** {{disability_elimination_period}}
{{/if}}

---

## 7. Non-Compete and Confidentiality

### 7.1 Non-Compete Provisions
For {{non_compete_period}} years after a sale transaction, the selling Owner agrees not to:
- Compete directly with the Company's business
- Solicit the Company's customers or employees
- Use confidential information for competitive purposes
- {{additional_non_compete_restrictions}}

### 7.2 Geographic Scope
Non-compete restrictions apply within: {{geographic_scope}}

### 7.3 Confidentiality
Ongoing confidentiality obligations include:
- Protection of trade secrets and proprietary information
- Non-disclosure of customer lists and pricing
- Protection of business strategies and plans

---

## 8. Employment and Management

### 8.1 Employment Termination
Upon sale of ownership interest:
- **Employment Status:** {{employment_status_after_sale}}
- **Severance Benefits:** {{severance_benefits}}
- **Transition Period:** {{transition_period}}

### 8.2 Management Rights
Departing Owners shall:
- Resign from all management positions
- Transfer all company property and records
- Cooperate in transition activities

---

## 9. Dispute Resolution

### 9.1 Valuation Disputes
Disputes over valuation shall be resolved by:
{{#if valuation_arbitration}}
- Binding arbitration with qualified business appraiser
- Three-appraiser panel if values differ by more than {{valuation_variance_threshold}}%
{{else}}
- Mediation followed by arbitration if necessary
{{/if}}

### 9.2 General Disputes
Other disputes shall be resolved through:
1. Good faith negotiation
2. Mediation with qualified mediator
3. {{#if binding_arbitration}}Binding arbitration{{else}}Court proceedings in {{jurisdiction}}{{/if}}

---

## 10. Amendment and Termination

### 10.1 Agreement Amendment
This Agreement may be amended only by written consent of {{amendment_threshold}}% of the Owners.

### 10.2 Agreement Termination
This Agreement shall terminate upon:
- Written agreement of all Owners
- Sale of the Company to third parties
- Dissolution of the Company
- {{termination_conditions}}

### 10.3 Survival Provisions
The following provisions shall survive termination:
- Confidentiality obligations
- Non-compete restrictions
- Dispute resolution procedures

---

## 11. General Provisions

### 11.1 Governing Law
This Agreement shall be governed by the laws of {{governing_state}}.

### 11.2 Binding Effect
This Agreement binds heirs, executors, administrators, and assigns of all Owners.

### 11.3 Tax Considerations
Each Owner should consult with tax advisors regarding the tax implications of this Agreement.

### 11.4 Entire Agreement
This Agreement supersedes all prior agreements relating to buy-sell arrangements.

### 11.5 Severability
Invalid provisions shall not affect the validity of remaining provisions.

---

## 12. Signatures

**IN WITNESS WHEREOF**, the Owners have executed this Agreement as of the date first written above.

{{#each owners}}
**{{name}}:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{name}} | |
| {{title}} | |

{{/each}}

---

**IMPORTANT LEGAL NOTICE:** This buy-sell agreement should be reviewed by legal and tax counsel to ensure compliance with applicable laws and optimal tax treatment. Terms should be tailored to the specific business structure and ownership arrangements.

*Template generated by 123LegalDoc - Professional Legal Document Platform*