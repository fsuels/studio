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

## 9. Legal Considerations

### 9.1 Separation Agreement
{{#if separation_agreement}}
A separation agreement is attached that addresses additional terms of your termination. Please review and sign if you agree to the terms.
{{/if}}

### 9.2 Unemployment Benefits
{{unemployment_benefits_info}}

### 9.3 Dispute Resolution
{{dispute_resolution_clause}}

---

## 10. Contact Information

For questions regarding this termination or your final benefits, please contact:

**HR Contact:** {{hr_contact_name}}  
**Phone:** {{hr_contact_phone}}  
**Email:** {{hr_contact_email}}  
**Office Hours:** {{hr_office_hours}}

**Payroll Questions:** {{payroll_contact}}  
**Benefits Questions:** {{benefits_contact}}

---

## 11. Acknowledgment

Please sign and return one copy of this letter to acknowledge receipt.

I acknowledge that I have received and understand this Employment Termination Letter and the information contained herein.

**Employee Acknowledgment:**

| Signature | Date |
|-----------|------|
| _________________________________ | _____________ |
| {{employee_name}} | |
| Print Name: {{employee_name}} | |

---

## 12. Company Representative

**Issued By:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{termination_date}} |
| {{hr_representative_name}} | |
| Title: {{hr_representative_title}} | |

{{#if supervisor_signature_required}}
**Supervisor:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{termination_date}} |
| {{supervisor_name}} | |
| Title: {{supervisor_title}} | |
{{/if}}

---

## 13. Important Reminders

- Return all company property by {{property_return_deadline}}
- Review and retain this letter for your records
- Contact HR with any questions about your final pay or benefits
- {{#if cobra_eligible}}Watch for COBRA documentation in the mail{{/if}}
- {{additional_reminders}}

---

**IMPORTANT LEGAL NOTICE:** This employment termination letter should be reviewed by qualified legal counsel to ensure compliance with federal, state, and local employment laws. Termination procedures vary by jurisdiction and should follow proper legal protocols.

*Template generated by 123LegalDoc - Professional Legal Document Platform*