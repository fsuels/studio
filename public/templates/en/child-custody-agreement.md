# Child Custody Agreement

---

**CHILD CUSTODY AGREEMENT**

This Child Custody Agreement ("Agreement") is made and entered into on **{{agreement_date}}**, by and between:

- **Parent 1:** {{parent_1_name}}, residing at {{parent_1_address}}
- **Parent 2:** {{parent_2_name}}, residing at {{parent_2_address}}

Collectively referred to herein as the "Parents."

---

## 1. Child Information

### 1.1 Children Subject to This Agreement

This Agreement concerns the following minor child(ren):

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

### 1.2 Current Residence

The child(ren) currently reside(s) with {{current_primary_parent}} at {{current_residence_address}}.

---

## 2. Legal and Physical Custody

### 2.1 Legal Custody

{{#if joint_legal_custody}}
**Joint Legal Custody:** Both Parents shall share joint legal custody of the child(ren). All major decisions regarding the child(ren)'s health, education, and welfare shall be made jointly by both Parents.
{{else}}
**Sole Legal Custody:** {{sole_legal_custody_parent}} shall have sole legal custody of the child(ren) and the authority to make major decisions regarding the child(ren)'s health, education, and welfare.
{{/if}}

### 2.2 Physical Custody

{{#if joint_physical_custody}}
**Joint Physical Custody:** Both Parents shall share joint physical custody of the child(ren) according to the schedule set forth in Section 3 below.
{{else}}
**Primary Physical Custody:** {{primary_custody_parent}} shall have primary physical custody of the child(ren).  
**Visitation Rights:** {{visitation_parent}} shall have visitation rights as set forth in Section 3 below.
{{/if}}

---

## 3. Parenting Time Schedule

### 3.1 Regular Weekly Schedule

{{#if alternating_weeks}}
**Alternating Weeks:** The child(ren) shall alternate weeks between Parents, with transitions occurring on {{transition_day}} at {{transition_time}}.
{{else}}
**Weekly Schedule:**

- **{{parent_1_name}}:** {{parent_1_schedule}}
- **{{parent_2_name}}:** {{parent_2_schedule}}
- **Transition Times:** {{transition_details}}
  {{/if}}

### 3.2 Holiday Schedule

**Major Holidays:**

| Holiday          | {{holiday_year_1}}         | {{holiday_year_2}}         |
| ---------------- | -------------------------- | -------------------------- |
| New Year's Day   | {{new_years_parent_1}}     | {{new_years_parent_2}}     |
| Easter/Passover  | {{easter_parent_1}}        | {{easter_parent_2}}        |
| Memorial Day     | {{memorial_parent_1}}      | {{memorial_parent_2}}      |
| Independence Day | {{july4_parent_1}}         | {{july4_parent_2}}         |
| Labor Day        | {{labor_parent_1}}         | {{labor_parent_2}}         |
| Halloween        | {{halloween_parent_1}}     | {{halloween_parent_2}}     |
| Thanksgiving     | {{thanksgiving_parent_1}}  | {{thanksgiving_parent_2}}  |
| Christmas Eve    | {{christmas_eve_parent_1}} | {{christmas_eve_parent_2}} |
| Christmas Day    | {{christmas_parent_1}}     | {{christmas_parent_2}}     |

**Holiday Times:** Holidays begin at {{holiday_start_time}} and end at {{holiday_end_time}} the following day, unless otherwise specified.

### 3.3 Summer Vacation

{{summer_vacation_schedule}}

### 3.4 School Breaks

{{school_break_schedule}}

### 3.5 Special Occasions

**Birthdays:** {{birthday_schedule}}  
**Mother's Day:** {{mothers_day_schedule}}  
**Father's Day:** {{fathers_day_schedule}}  
**Parent Birthdays:** {{parent_birthday_schedule}}

---

## 4. Transportation and Exchange

### 4.1 Exchange Location

Child exchanges shall occur at: {{exchange_location}}

### 4.2 Transportation Responsibility

{{transportation_responsibility}}

### 4.3 Exchange Guidelines

- Exchanges shall occur on time as scheduled
- Both Parents shall be courteous and civil during exchanges
- The child(ren) shall bring clothing and personal items appropriate for the visit
- {{additional_exchange_guidelines}}

---

## 5. Communication

### 5.1 Parent-Child Communication

{{#if communication_restrictions}}
**Communication Schedule:** {{communication_schedule}}  
**Communication Methods:** {{communication_methods}}  
**Communication Times:** {{communication_times}}
{{else}}
Each Parent shall have reasonable telephone/video contact with the child(ren) when the child(ren) are with the other Parent.
{{/if}}

### 5.2 Parent-to-Parent Communication

Communication between Parents regarding the child(ren) shall be:

- Conducted in a respectful and business-like manner
- Focused on the child(ren)'s needs and well-being
- {{parent_communication_methods}}

### 5.3 Emergency Communication

In case of emergency involving the child(ren), the Parent with the child(ren) shall immediately notify the other Parent.

---

## 6. Decision-Making Authority

### 6.1 Educational Decisions

{{educational_decision_authority}}

### 6.2 Medical Decisions

{{medical_decision_authority}}

### 6.3 Religious Decisions

{{religious_decision_authority}}

### 6.4 Extracurricular Activities

{{extracurricular_decision_authority}}

### 6.5 Emergency Medical Care

Either Parent may authorize emergency medical care when the child(ren) are in their care.

---

## 7. Child Support

### 7.1 Support Obligation

{{#if separate_support_order}}
Child support is addressed in a separate Child Support Order dated {{support_order_date}}.
{{else}}
**Support Amount:** {{support_paying_parent}} shall pay ${{monthly_support_amount}} per month in child support to {{support_receiving_parent}}.  
**Payment Schedule:** Support shall be paid {{support_payment_schedule}}.  
**Payment Method:** {{support_payment_method}}
{{/if}}

### 7.2 Additional Expenses

**Medical Expenses:** {{medical_expense_allocation}}  
**Childcare Expenses:** {{childcare_expense_allocation}}  
**Educational Expenses:** {{educational_expense_allocation}}  
**Extracurricular Expenses:** {{extracurricular_expense_allocation}}

---

## 8. Relocation

### 8.1 Notice Requirement

{{relocation_notice_requirement}}

### 8.2 Relocation Approval

{{relocation_approval_process}}

### 8.3 Impact on Custody Schedule

If relocation is approved, the custody schedule may be modified as follows:
{{relocation_schedule_modification}}

---

## 9. Restrictions and Limitations

### 9.1 Geographic Restrictions

{{geographic_restrictions}}

### 9.2 Substance Use

{{substance_use_restrictions}}

### 9.3 Supervision Requirements

{{supervision_requirements}}

### 9.4 Other Restrictions

{{additional_restrictions}}

---

## 10. Dispute Resolution

### 10.1 Mediation

{{#if mediation_required}}
Before filing any court action to modify this Agreement, the Parents agree to attempt mediation with a qualified mediator.
{{/if}}

### 10.2 Court Intervention

{{court_intervention_process}}

### 10.3 Attorney Fees

{{attorney_fees_provision}}

---

## 11. Modification

### 11.1 Agreement Modification

This Agreement may only be modified by:

- Written agreement signed by both Parents, or
- Court order based on substantial change in circumstances

### 11.2 Best Interest Standard

Any modification must be in the best interest of the child(ren).

---

## 12. Enforcement

### 12.1 Court Enforcement

This Agreement may be enforced through the courts of {{jurisdiction}}.

### 12.2 Contempt of Court

Violation of this Agreement may result in contempt of court proceedings.

---

## 13. General Provisions

### 13.1 Governing Law

This Agreement shall be governed by the laws of {{state}}.

### 13.2 Best Interest of Child

All provisions of this Agreement are intended to serve the best interests of the child(ren).

### 13.3 Entire Agreement

This Agreement constitutes the entire agreement between the Parents regarding custody and visitation.

### 13.4 Severability

If any provision is held invalid, the remainder shall remain in full force and effect.

### 13.5 Binding Effect

This Agreement is binding upon both Parents and their heirs and assigns.

---

## 14. Additional Provisions

{{additional_provisions}}

---

## 15. Signatures

**IN WITNESS WHEREOF**, the Parents have executed this Child Custody Agreement as of the date first written above.

**PARENT 1:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{parent_1_name}}                          |                    |
| Print Name: {{parent_1_name}}              |                    |

**PARENT 2:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{parent_2_name}}                          |                    |
| Print Name: {{parent_2_name}}              |                    |

---

## 16. Notarization

**State of {{state}}**  
**County of {{county}}**

On this **{{agreement_date}}**, before me personally appeared {{parent_1_name}} and {{parent_2_name}}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** ******\*\*\*\*******\_******\*\*\*\*******  
**My Commission Expires:** ****\*\*\*\*****\_****\*\*\*\*****

---

## 17. Court Approval (if required)

{{#if court_approval_required}}
**FOR COURT USE ONLY:**

This Child Custody Agreement is:
[ ] APPROVED and ORDERED by the Court
[ ] REJECTED by the Court

**Judge:** ******\*\*\*\*******\_******\*\*\*\*******  
**Date:** ******\*\*\*\*******\_******\*\*\*\*******  
**Court:** ******\*\*\*\*******\_******\*\*\*\*******
{{/if}}

---

**IMPORTANT LEGAL NOTICE:** This child custody agreement should be reviewed by qualified legal counsel to ensure compliance with state family laws and protection of children's best interests. Custody laws vary significantly by state, and court approval may be required. Both parents should understand their rights and obligations under this agreement.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
