# Divorce Settlement Agreement

---

**DIVORCE SETTLEMENT AGREEMENT**

This Divorce Settlement Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between:

- **Petitioner/Plaintiff:** {{petitioner_name}}, residing at {{petitioner_address}}
- **Respondent/Defendant:** {{respondent_name}}, residing at {{respondent_address}}

Collectively referred to herein as the "Parties."

---

## 1. Party Identification

### 1.1 Petitioner/Plaintiff Identification
**Full Legal Name:** {{petitioner_name}}  
**Date of Birth:** {{petitioner_dob}}  
**Social Security Number:** {{petitioner_ssn}}  
**Driver's License:** {{petitioner_license}}  
**Current Address:** {{petitioner_address}}  
**Phone Number:** {{petitioner_phone}}  
**Email Address:** {{petitioner_email}}  
**Occupation:** {{petitioner_occupation}}  
**Employer:** {{petitioner_employer}}

### 1.2 Respondent/Defendant Identification
**Full Legal Name:** {{respondent_name}}  
**Date of Birth:** {{respondent_dob}}  
**Social Security Number:** {{respondent_ssn}}  
**Driver's License:** {{respondent_license}}  
**Current Address:** {{respondent_address}}  
**Phone Number:** {{respondent_phone}}  
**Email Address:** {{respondent_email}}  
**Occupation:** {{respondent_occupation}}  
**Employer:** {{respondent_employer}}

---

## 2. Background and Recitals

### 2.1 Marriage Information
**Date of Marriage:** {{marriage_date}}  
**Place of Marriage:** {{marriage_location}}  
**Marriage Certificate Number:** {{marriage_certificate_number}}

### 1.2 Separation Information
**Date of Separation:** {{separation_date}}  
**Reason for Separation:** {{separation_reason}}

### 1.3 Divorce Proceeding
**Court:** {{court_name}}  
**Case Number:** {{case_number}}  
**Filing Date:** {{filing_date}}  
**Divorce Type:** {{divorce_type}} (Contested/Uncontested/No-Fault)

### 1.4 Legal Representation
{{#if legal_representation}}
**Petitioner's Attorney:** {{petitioner_attorney}}  
**Respondent's Attorney:** {{respondent_attorney}}
{{else}}
Both parties are representing themselves pro se in this matter.
{{/if}}

---

## 3. Children of the Marriage

### 2.1 Minor Children
{{#if minor_children}}
The Parties have the following minor child(ren):

**Child 1:**
- **Name:** {{child_1_name}}
- **Date of Birth:** {{child_1_dob}}
- **Age:** {{child_1_age}}
- **Social Security #:** {{child_1_ssn}}

{{#if child_2_name}}
**Child 2:**
- **Name:** {{child_2_name}}
- **Date of Birth:** {{child_2_dob}}
- **Age:** {{child_2_age}}
- **Social Security #:** {{child_2_ssn}}
{{/if}}

{{#if child_3_name}}
**Child 3:**
- **Name:** {{child_3_name}}
- **Date of Birth:** {{child_3_dob}}
- **Age:** {{child_3_age}}
- **Social Security #:** {{child_3_ssn}}
{{/if}}

{{additional_children}}
{{else}}
The Parties have no minor children together.
{{/if}}

### 2.2 Adult Children
{{#if adult_children}}
**Adult Children:** {{adult_children_details}}
{{else}}
The Parties have no adult children together.
{{/if}}

---

## 4. Child Custody and Visitation

{{#if minor_children}}
### 3.1 Legal Custody
{{#if joint_legal_custody}}
**Joint Legal Custody:** Both Parties shall share joint legal custody of the minor child(ren). All major decisions regarding the child(ren)'s health, education, and welfare shall be made jointly.
{{else}}
**Sole Legal Custody:** {{sole_custody_parent}} shall have sole legal custody of the minor child(ren).
{{/if}}

### 3.2 Physical Custody
{{#if joint_physical_custody}}
**Joint Physical Custody:** Both Parties shall share joint physical custody according to the following schedule:
{{custody_schedule}}
{{else}}
**Primary Physical Custody:** {{primary_custody_parent}} shall have primary physical custody.  
**Visitation Schedule:** {{visitation_schedule}}
{{/if}}

### 3.3 Holiday and Vacation Schedule
**Holiday Schedule:** {{holiday_schedule}}  
**Summer Vacation:** {{summer_vacation_schedule}}  
**School Breaks:** {{school_break_schedule}}

### 3.4 Transportation and Exchange
**Exchange Location:** {{exchange_location}}  
**Transportation Responsibility:** {{transportation_responsibility}}

{{else}}
**No Minor Children:** This section is not applicable as the Parties have no minor children together.
{{/if}}

---

## 5. Child Support

{{#if minor_children}}
### 4.1 Support Obligation
{{#if child_support_required}}
**Support Amount:** {{support_paying_parent}} shall pay ${{monthly_support_amount}} per month in child support to {{support_receiving_parent}}.

**Payment Schedule:** Child support shall be paid {{support_payment_schedule}}.  
**Payment Method:** {{support_payment_method}}  
**First Payment Due:** {{first_payment_date}}

### 4.2 Income Information
**{{support_paying_parent}}'s Gross Monthly Income:** ${{paying_parent_income}}  
**{{support_receiving_parent}}'s Gross Monthly Income:** ${{receiving_parent_income}}

### 4.3 Additional Expenses
**Medical/Dental Insurance:** {{medical_insurance_responsibility}}  
**Unreimbursed Medical Expenses:** {{medical_expense_allocation}}  
**Childcare Expenses:** {{childcare_expense_allocation}}  
**Educational Expenses:** {{educational_expense_allocation}}  
**Extracurricular Activities:** {{extracurricular_expense_allocation}}

### 4.4 Support Modification
Child support may be modified upon substantial change in circumstances in accordance with {{state}} law.

### 4.5 Support Termination
Child support shall terminate when the child reaches age {{support_termination_age}} or upon {{support_termination_conditions}}.
{{else}}
**No Child Support:** No child support is required based on the custody arrangement and income of both parties.
{{/if}}

{{else}}
**No Minor Children:** Child support provisions are not applicable.
{{/if}}

---

## 6. Spousal Support/Alimony

### 5.1 Spousal Support Award
{{#if spousal_support_awarded}}
**Support Amount:** {{support_paying_spouse}} shall pay ${{spousal_support_amount}} per month in spousal support to {{support_receiving_spouse}}.

**Payment Schedule:** {{spousal_support_schedule}}  
**Payment Method:** {{spousal_support_payment_method}}  
**Duration:** {{spousal_support_duration}}  
**Termination Date:** {{spousal_support_end_date}}

### 5.2 Termination Events
Spousal support shall terminate upon:
- Death of either party
- Remarriage of the receiving spouse
- Cohabitation of the receiving spouse with a romantic partner for more than {{cohabitation_period}}
- {{additional_termination_events}}

### 5.3 Modification
{{spousal_support_modification_terms}}
{{else}}
**Spousal Support Waived:** Both Parties hereby waive any right to spousal support, maintenance, or alimony from the other Party, both now and in the future.
{{/if}}

---

## 7. Property Division

### 6.1 Marital Home
**Property Address:** {{marital_home_address}}  
**Current Value:** ${{home_current_value}}  
**Mortgage Balance:** ${{mortgage_balance}}  
**Equity:** ${{home_equity}}

**Disposition:** {{home_disposition}}

{{#if home_sale_required}}
**Sale Terms:** {{home_sale_terms}}  
**Listing Agent:** {{listing_agent}}  
**Minimum Sale Price:** ${{minimum_sale_price}}  
**Closing Date Deadline:** {{sale_deadline}}
{{/if}}

### 6.2 Other Real Estate
{{#if other_real_estate}}
{{other_property_details}}
{{else}}
The Parties own no other real estate.
{{/if}}

### 6.3 Vehicles
**Vehicle 1:** {{vehicle_1_description}}  
**Awarded to:** {{vehicle_1_recipient}}  
**Current Value:** ${{vehicle_1_value}}  
**Loan Balance:** ${{vehicle_1_loan_balance}}

{{#if vehicle_2_description}}
**Vehicle 2:** {{vehicle_2_description}}  
**Awarded to:** {{vehicle_2_recipient}}  
**Current Value:** ${{vehicle_2_value}}  
**Loan Balance:** ${{vehicle_2_loan_balance}}
{{/if}}

{{additional_vehicles}}

### 6.4 Bank Accounts and Financial Assets
**Joint Checking Account:** {{joint_checking_details}}  
**Joint Savings Account:** {{joint_savings_details}}  
**{{petitioner_name}}'s Individual Accounts:** {{petitioner_accounts}}  
**{{respondent_name}}'s Individual Accounts:** {{respondent_accounts}}

### 6.5 Retirement Accounts
**{{petitioner_name}}'s Retirement Accounts:** {{petitioner_retirement}}  
**{{respondent_name}}'s Retirement Accounts:** {{respondent_retirement}}

{{#if qdro_required}}
**QDRO Required:** A Qualified Domestic Relations Order will be prepared for the division of {{qdro_account_details}}.
{{/if}}

### 6.6 Personal Property
**Household Items:** {{household_items_division}}  
**Jewelry:** {{jewelry_division}}  
**Electronics:** {{electronics_division}}  
**Collections/Antiques:** {{collections_division}}

### 6.7 Business Interests
{{#if business_interests}}
{{business_division_details}}
{{else}}
Neither Party owns any business interests.
{{/if}}

---

## 8. Debt Allocation

### 7.1 Joint Debts
**Mortgage:** {{mortgage_responsibility}}  
**Credit Cards:** {{credit_card_responsibility}}  
**Auto Loans:** {{auto_loan_responsibility}}  
**Student Loans:** {{student_loan_responsibility}}

### 7.2 Individual Debts
**{{petitioner_name}}'s Individual Debts:** {{petitioner_debts}}  
**{{respondent_name}}'s Individual Debts:** {{respondent_debts}}

### 7.3 Debt Responsibility
Each Party shall be responsible for debts allocated to them and shall hold the other Party harmless from such debts.

---

## 9. Insurance

### 8.1 Health Insurance
{{#if minor_children}}
**Children's Health Insurance:** {{children_health_insurance}}  
**Cost Responsibility:** {{health_insurance_cost_allocation}}
{{/if}}

**{{petitioner_name}}'s Health Insurance:** {{petitioner_health_insurance}}  
**{{respondent_name}}'s Health Insurance:** {{respondent_health_insurance}}

### 8.2 Life Insurance
{{#if life_insurance_required}}
{{#if minor_children}}
**Life Insurance for Children:** Both Parties shall maintain life insurance of at least ${{life_insurance_amount}} with the minor child(ren) as beneficiaries until the youngest child reaches age {{life_insurance_termination_age}}.
{{/if}}

{{#if spousal_support_awarded}}
**Life Insurance for Spousal Support:** {{support_paying_spouse}} shall maintain life insurance of at least ${{spousal_support_life_insurance}} with {{support_receiving_spouse}} as beneficiary during the period of spousal support.
{{/if}}
{{else}}
No life insurance requirements.
{{/if}}

---

## 10. Tax Considerations

### 9.1 Federal and State Tax Returns
**Prior Year Returns ({{prior_tax_year}}):** {{prior_tax_returns}}  
**Current Year Return ({{current_tax_year}}):** {{current_year_tax_filing}}  
**Filing Status:** {{tax_filing_status}}  
**Preparation Responsibility:** {{tax_preparation_responsibility}}  
**Cost Allocation:** {{tax_preparation_cost_allocation}}

### 9.2 Tax Refunds and Liabilities
**Outstanding Federal Refunds:** {{federal_tax_refunds_allocation}}  
**Outstanding State Refunds:** {{state_tax_refunds_allocation}}  
**Outstanding Federal Liabilities:** {{federal_tax_liabilities_allocation}}  
**Outstanding State Liabilities:** {{state_tax_liabilities_allocation}}  
**Payment Responsibility:** {{tax_payment_responsibility}}

### 9.3 Dependency Exemptions and Tax Credits
{{#if minor_children}}
**Child Tax Exemptions:** {{tax_exemption_allocation}}  
**Child Tax Credit:** {{child_tax_credit_allocation}}  
**Earned Income Tax Credit:** {{eitc_allocation}}  
**Child and Dependent Care Credit:** {{child_care_credit_allocation}}  
**Education Credits:** {{education_credit_allocation}}
{{/if}}

### 9.4 Property Transfer Tax Implications
**Real Estate Transfer Tax:** {{real_estate_transfer_tax}}  
**Capital Gains Considerations:** {{capital_gains_implications}}  
**Basis Step-Up:** {{property_basis_considerations}}  
**Section 1041 Treatment:** Property transfers between spouses pursuant to divorce are generally non-taxable under IRC Section 1041.

### 9.5 Retirement Account Tax Implications
**401(k)/403(b) Division:** {{retirement_division_tax_implications}}  
**IRA Division:** {{ira_division_tax_implications}}  
**Pension Division:** {{pension_division_tax_implications}}  
**QDRO Tax Treatment:** {{qdro_tax_implications}}  
**Early Withdrawal Penalties:** {{early_withdrawal_considerations}}

### 9.6 Spousal Support Tax Treatment
{{#if spousal_support_awarded}}
**Deductibility for Payor:** {{spousal_support_deduction}}  
**Taxability for Recipient:** {{spousal_support_income_tax}}  
**Alimony Recapture Rules:** {{alimony_recapture_provisions}}  
**Tax Compliance:** Both parties acknowledge understanding of current federal tax treatment of spousal support payments.
{{/if}}

### 9.7 Business Interest Tax Implications
{{#if business_interests}}
**Business Valuation Date:** {{business_valuation_date}}  
**Tax Basis:** {{business_tax_basis}}  
**Depreciation Recapture:** {{depreciation_recapture_implications}}  
**Future Tax Obligations:** {{business_future_tax_obligations}}
{{/if}}

### 9.8 Debt Forgiveness and Tax Consequences
**Cancelled Debt Income:** {{cancelled_debt_tax_implications}}  
**Insolvency Exception:** {{insolvency_considerations}}  
**Form 1099-C Reporting:** {{debt_forgiveness_reporting}}

### 9.9 State-Specific Tax Considerations
**State Income Tax:** {{state_income_tax_implications}}  
**State Property Tax:** {{state_property_tax_allocation}}  
**Local Tax Obligations:** {{local_tax_considerations}}  
**Multi-State Issues:** {{multi_state_tax_implications}}

### 9.10 Future Tax Cooperation
**Document Sharing:** Both parties agree to provide tax-related documents upon reasonable request for five (5) years following the divorce.  
**Amendment Cooperation:** Both parties agree to cooperate in any future tax audits or amendments related to joint returns.  
**Indemnification:** {{tax_indemnification_provisions}}

### 9.11 Tax Professional Consultation
Both parties acknowledge they have been advised to consult with qualified tax professionals regarding the tax implications of this divorce settlement.

---

## 11. Name Change

### 10.1 Name Restoration
{{#if name_change_requested}}
{{name_change_petitioner}} requests that their name be restored to {{restored_name}}.
{{else}}
Neither Party requests a name change.
{{/if}}

---

## 12. Restraining Orders and Protection

### 11.1 Mutual Restraining Orders
{{#if restraining_orders}}
{{restraining_order_details}}
{{else}}
No restraining orders are in effect between the Parties.
{{/if}}

### 11.2 Harassment Protection
Both Parties agree to refrain from harassing, threatening, or bothering the other Party.

---

## 13. Dispute Resolution

### 12.1 Mediation
{{#if mediation_required}}
Before filing any court action to modify this Agreement, the Parties agree to attempt mediation.  
**Mediator Selection:** {{mediator_selection_process}}  
**Mediation Cost:** {{mediation_cost_allocation}}
{{/if}}

### 12.2 Court Jurisdiction
This Agreement shall be subject to the jurisdiction of {{court_name}} for enforcement and modification purposes.

### 12.3 Attorney Fees
{{attorney_fees_provision}}

---

## 14. General Provisions

### 13.1 Full Disclosure
Each Party represents that they have made full disclosure of all assets, debts, income, and liabilities to the other Party.

### 13.2 Voluntary Agreement
Both Parties enter into this Agreement voluntarily and acknowledge that they have had the opportunity to consult with independent legal counsel.

### 13.3 Entire Agreement
This Agreement constitutes the entire agreement between the Parties and supersedes all prior negotiations and agreements.

### 13.4 Modification
This Agreement may only be modified by written agreement signed by both Parties or by court order.

### 13.5 Binding Effect
This Agreement shall be binding upon the Parties, their heirs, executors, administrators, and assigns.

### 13.6 Severability
If any provision is held invalid, the remainder shall remain in full force and effect.

### 13.7 Governing Law
This Agreement shall be governed by the laws of {{state}}.

### 13.8 Court Approval
This Agreement shall be incorporated into the final divorce decree.

---

## 15. Mutual Releases

### 14.1 General Release
Except as provided in this Agreement, each Party releases and forever discharges the other from all claims, demands, and causes of action arising from the marriage relationship.

### 14.2 Property Rights Release
Each Party releases all rights in the property awarded to the other Party under this Agreement.

### 14.3 Estate Rights Release
{{#if estate_rights_waived}}
Each Party waives all rights to inherit from the other Party's estate, except as specifically provided herein.
{{/if}}

---

## 16. Enforcement

### 15.1 Contempt of Court
Violation of this Agreement may result in contempt of court proceedings.

### 15.2 Specific Performance
This Agreement may be enforced through specific performance remedies.

### 15.3 Damages
In addition to other remedies, the non-breaching Party may seek monetary damages for any breach of this Agreement.

---

## 17. Acknowledgments

### 16.1 Party Acknowledgments
Each Party acknowledges:
- They have read and understand this Agreement
- They have had adequate time to consider the terms
- They enter into this Agreement voluntarily
- {{#if legal_representation}}They have been advised by independent legal counsel{{else}}They have had the opportunity to consult with legal counsel{{/if}}
- They believe the terms are fair and reasonable

### 16.2 Financial Information
Each Party has provided complete and accurate financial information to the other Party.

---

## 18. Signatures

**IN WITNESS WHEREOF**, the Parties have executed this Divorce Settlement Agreement as of the date first written above.

**PETITIONER/PLAINTIFF:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{petitioner_name}} | |
| Print Name: {{petitioner_name}} | |

**RESPONDENT/DEFENDANT:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{respondent_name}} | |
| Print Name: {{respondent_name}} | |

---

## 19. Attorney Acknowledgments

{{#if legal_representation}}
**ATTORNEY FOR PETITIONER:**

I have advised my client regarding this Agreement and believe it to be fair and reasonable.

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{petitioner_attorney}} | |
| State Bar Number: {{petitioner_attorney_bar}} | |

**ATTORNEY FOR RESPONDENT:**

I have advised my client regarding this Agreement and believe it to be fair and reasonable.

| Signature | Date |
|-----------|------|
| _________________________________ | {{agreement_date}} |
| {{respondent_attorney}} | |
| State Bar Number: {{respondent_attorney_bar}} | |
{{/if}}

---

## 20. Notarization

**State of {{state}}**  
**County of {{county}}**

On this **{{agreement_date}}**, before me personally appeared {{petitioner_name}} and {{respondent_name}}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** _________________________________  
**My Commission Expires:** _________________________

---

## 21. Court Approval

**FOR COURT USE ONLY:**

This Divorce Settlement Agreement is:
☐ APPROVED and INCORPORATED into the Judgment of Divorce
☐ REJECTED by the Court

**Judge:** _________________________________  
**Date:** _________________________________  
**Court:** {{court_name}}

---

**IMPORTANT LEGAL NOTICE:** This divorce settlement agreement should be reviewed by qualified family law attorneys for both parties to ensure compliance with state divorce laws and protection of individual rights. Divorce laws vary significantly by state, and this agreement must be approved by the court to become legally binding. Both parties should have independent legal representation.

*Template generated by 123LegalDoc - Professional Legal Document Platform*