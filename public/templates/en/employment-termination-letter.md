# Employment Termination Letter

---

**EMPLOYMENT TERMINATION LETTER**

**Date:** {{termination_date}}

**To:** {{employee_name}}  
**Employee ID:** {{employee_id}}  
**Department:** {{department}}  
**Position:** {{job_title}}

**From:** {{company_name}}  
**Address:** {{company_address}}

---

## 1. Notice of Termination

Dear {{employee_name}},

This letter serves as formal notification that your employment with {{company_name}} will be terminated effective **{{effective_date}}**.

### 1.1 Termination Details

**Reason for Termination:** {{termination_reason}}  
**Termination Type:** {{termination_type}} (Voluntary/Involuntary/Layoff/Resignation)  
**Effective Date:** {{effective_date}}  
**Last Working Day:** {{last_working_day}}

---

## 2. Reason for Termination

{{#if performance_related}}

### Performance-Related Termination

Your employment is being terminated due to performance issues, specifically:
{{performance_issues}}

Previous disciplinary actions taken:
{{disciplinary_history}}
{{/if}}

{{#if misconduct}}

### Misconduct Termination

Your employment is being terminated due to misconduct, specifically:
{{misconduct_details}}
{{/if}}

{{#if layoff}}

### Layoff/Reduction in Force

Your position is being eliminated due to:
{{layoff_reason}}

This decision is not related to your individual performance and is part of a company-wide restructuring.
{{/if}}

{{#if voluntary}}

### Voluntary Termination

We acknowledge receipt of your resignation letter dated {{resignation_date}}. Your voluntary termination is accepted effective {{effective_date}}.
{{/if}}

---

## 3. Final Compensation and Benefits

### 3.1 Final Paycheck

**Final Pay Date:** {{final_pay_date}}  
**Final Pay Amount:** ${{final_pay_amount}}  
**Pay Period Covered:** {{final_pay_period}}

**Final Pay Includes:**

- Regular wages through {{last_working_day}}
- {{#if overtime_owed}}Overtime compensation: ${{overtime_amount}}{{/if}}
- {{#if vacation_payout}}Accrued vacation pay: {{vacation_days}} days = ${{vacation_payout}}{{/if}}
- {{#if sick_leave_payout}}Accrued sick leave (where applicable): ${{sick_leave_amount}}{{/if}}
- {{#if commission_owed}}Outstanding commission: ${{commission_amount}}{{/if}}
- {{#if bonus_owed}}Pro-rated bonus: ${{bonus_amount}}{{/if}}

### 3.2 Deductions

The following deductions will be made from your final pay:
{{final_pay_deductions}}

### 3.3 Severance Package

{{#if severance_offered}}
**Severance Payment:** ${{severance_amount}}  
**Severance Period:** {{severance_weeks}} weeks  
**Payment Schedule:** {{severance_payment_schedule}}  
**Severance Conditions:** {{severance_conditions}}
{{else}}
**No severance package** is provided with this termination.
{{/if}}

---

## 4. Benefits Information

### 4.1 Health Insurance

**COBRA Eligibility:** {{#if cobra_eligible}}You are eligible for COBRA continuation coverage{{else}}You are not eligible for COBRA{{/if}}  
**Coverage End Date:** {{health_insurance_end_date}}  
**COBRA Information:** You will receive separate COBRA documentation within {{cobra_notice_days}} days

### 4.2 Retirement Benefits

**401(k) Plan:** {{retirement_plan_status}}  
**Vesting Status:** {{vesting_status}}  
**Contact Information:** {{retirement_plan_contact}}

### 4.3 Other Benefits

**Life Insurance:** Terminates on {{life_insurance_end_date}}  
**Disability Insurance:** Terminates on {{disability_insurance_end_date}}  
**Flexible Spending Account:** {{fsa_status}}  
**Stock Options:** {{stock_option_status}}

---

## 5. Company Property Return

You must return the following company property by {{property_return_deadline}}:

**Items to Return:**

- [ ] Company laptop/computer: {{laptop_details}}
- [ ] Mobile phone: {{phone_details}}
- [ ] Security badge/access cards
- [ ] Company credit cards
- [ ] Office keys
- [ ] Company vehicle (if applicable)
- [ ] Confidential documents and files
- [ ] {{additional_company_property}}

**Return Location:** {{property_return_location}}  
**Contact Person:** {{property_return_contact}}

---

## 6. Confidentiality and Non-Disclosure

### 6.1 Ongoing Obligations

Your confidentiality and non-disclosure obligations continue after termination, including:

- Protection of company trade secrets and proprietary information
- Non-disclosure of customer lists and confidential business information
- {{additional_confidentiality_obligations}}

### 6.2 Non-Compete Agreement

{{#if non_compete_applies}}
Your non-compete agreement dated {{non_compete_date}} remains in effect for {{non_compete_duration}} following your termination.
{{else}}
No non-compete restrictions apply to your termination.
{{/if}}

---

## 7. Final Work Requirements

### 7.1 Knowledge Transfer

{{#if knowledge_transfer_required}}
You are required to complete the following knowledge transfer activities:
{{knowledge_transfer_tasks}}

**Completion Deadline:** {{knowledge_transfer_deadline}}
{{/if}}

### 7.2 Final Projects

{{#if final_projects}}
**Outstanding Projects:** {{final_project_list}}  
**Transition Plan:** {{project_transition_plan}}
{{/if}}

---

## 8. References and Future Employment

### 8.1 Reference Policy

{{reference_policy}}

### 8.2 Employment Verification

Future employment verifications will confirm:

- Dates of employment: {{employment_start_date}} to {{effective_date}}
- Position held: {{job_title}}
- {{employment_verification_details}}

---

## 9. State-Specific Employment Law Compliance

### 9.1 Final Pay Requirements

{{#if state_california}}
**California Law:** Final pay must be provided immediately upon termination for involuntary terminations, or within 72 hours for voluntary resignations without notice.
{{/if}}
{{#if state_new_york}}
**New York Law:** Final pay must be provided by the next regular payday following termination.
{{/if}}
{{#if state_texas}}
**Texas Law:** Final pay must be provided within 6 days of termination.
{{/if}}
{{#if state_florida}}
**Florida Law:** Final pay must be provided by the next regular payday following termination.
{{/if}}
**{{state}} Requirements:** {{state_final_pay_requirements}}

### 9.2 State Vacation Pay Laws

{{#if state_california}}
**California Law:** Accrued vacation must be paid out upon termination. "Use it or lose it" policies are prohibited.
{{/if}}
{{#if state_massachusetts}}
**Massachusetts Law:** Accrued vacation must be paid if company policy provides for such payment.
{{/if}}
**{{state}} Vacation Laws:** {{state_vacation_payout_requirements}}

### 9.3 WARN Act Compliance

{{#if warn_act_applicable}}
**Worker Adjustment and Retraining Notification (WARN) Act:** This termination {{#if warn_notice_given}}has been preceded by the required 60-day notice{{else}}does not trigger WARN Act requirements{{/if}}.
{{/if}}

### 9.4 State Mini-WARN Laws

{{#if state_warn_law}}
**{{state}} WARN Requirements:** {{state_warn_law_details}}
{{/if}}

### 9.5 At-Will Employment Acknowledgment

{{#if at_will_employment}}
This termination is consistent with the at-will employment relationship. Either party may terminate the employment relationship at any time, with or without cause, and with or without notice.
{{/if}}

### 9.6 State Discrimination Laws

This termination is not based on any protected characteristic under federal, state, or local anti-discrimination laws, including but not limited to:

- Race, color, religion, sex, national origin, age, disability (federal protections)
- {{state_protected_classes}}

### 9.7 State Whistleblower Protections

{{#if whistleblower_protections}}
This termination is not in retaliation for any protected whistleblower activity under {{state}} law.
{{/if}}

### 9.8 Right to Work Laws

{{#if right_to_work_state}}
**{{state}} Right to Work:** This state has right-to-work laws. Union membership is not required for employment.
{{/if}}

---

## 10. Federal Employment Law Compliance

### 10.1 COBRA Notification Requirements

{{#if cobra_eligible}}
**Federal COBRA Requirements:** You have the right to continue health insurance coverage under COBRA for up to 18 months (or 36 months for certain qualifying events). You must be provided written notice of COBRA rights within 44 days of termination.
{{/if}}

### 10.2 Equal Employment Opportunity

This termination complies with all federal EEO laws and is not based on any protected characteristic under Title VII, ADA, ADEA, or other federal anti-discrimination statutes.

### 10.3 Family and Medical Leave Act (FMLA)

{{#if fmla_eligible}}
This termination does not violate your rights under the Family and Medical Leave Act.
{{/if}}

### 10.4 Worker Classification

{{#if contractor_classification}}
**Independent Contractor Notice:** Please note that post-termination work arrangements must comply with proper worker classification laws.
{{/if}}

---

## 11. Legal Considerations

### 11.1 Separation Agreement

{{#if separation_agreement}}
A separation agreement is attached that addresses additional terms of your termination. Please review and sign if you agree to the terms.
{{/if}}

### 11.2 Unemployment Benefits

{{unemployment_benefits_info}}

**State Requirements:** Under {{state}} law, we are required to provide information about unemployment benefits. Contact your state unemployment office at {{state_unemployment_contact}}.

### 11.3 Dispute Resolution

{{dispute_resolution_clause}}

### 11.4 Legal Time Limits

{{#if legal_time_limits}}
**Important:** Certain legal claims have time limits. For example:

- Federal discrimination claims: 180 days (300 days in states with approved agencies)
- State discrimination claims: {{state_discrimination_deadline}}
- Wage and hour claims: {{state_wage_hour_deadline}}
  {{/if}}

---

## 12. Contact Information

For questions regarding this termination or your final benefits, please contact:

**HR Contact:** {{hr_contact_name}}  
**Phone:** {{hr_contact_phone}}  
**Email:** {{hr_contact_email}}  
**Office Hours:** {{hr_office_hours}}

**Payroll Questions:** {{payroll_contact}}  
**Benefits Questions:** {{benefits_contact}}

---

## 13. Acknowledgment

Please sign and return one copy of this letter to acknowledge receipt.

I acknowledge that I have received and understand this Employment Termination Letter and the information contained herein.

**Employee Acknowledgment:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | **\*\***\_**\*\*** |
| {{employee_name}}                          |                    |
| Print Name: {{employee_name}}              |                    |

---

## 14. Company Representative

**Issued By:**

| Signature                                  | Date                 |
| ------------------------------------------ | -------------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{termination_date}} |
| {{hr_representative_name}}                 |                      |
| Title: {{hr_representative_title}}         |                      |

{{#if supervisor_signature_required}}
**Supervisor:**

| Signature                                  | Date                 |
| ------------------------------------------ | -------------------- |
| ******\*\*\*\*******\_******\*\*\*\******* | {{termination_date}} |
| {{supervisor_name}}                        |                      |
| Title: {{supervisor_title}}                |                      |

{{/if}}

---

## 15. Important Reminders

- Return all company property by {{property_return_deadline}}
- Review and retain this letter for your records
- Contact HR with any questions about your final pay or benefits
- {{#if cobra_eligible}}Watch for COBRA documentation in the mail{{/if}}
- {{additional_reminders}}

---

**IMPORTANT LEGAL NOTICE:** This employment termination letter should be reviewed by qualified legal counsel to ensure compliance with federal, state, and local employment laws. Termination procedures vary by jurisdiction and should follow proper legal protocols.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
