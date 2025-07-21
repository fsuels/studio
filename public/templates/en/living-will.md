# Living Will (Advance Healthcare Directive)

---

**LIVING WILL**  
**ADVANCE HEALTHCARE DIRECTIVE**

**State of {{state}}**

---

## 1. Personal Information

**I, {{declarant_name}}**, being of sound mind and at least 18 years of age, voluntarily make this Living Will and Advance Healthcare Directive.

**Personal Information:**

- **Full Name:** {{declarant_name}}
- **Date of Birth:** {{declarant_dob}}
- **Address:** {{declarant_address}}
- **Phone:** {{declarant_phone}}
- **Social Security #:** {{declarant_ssn}}

---

## 2. Purpose and Intent

### 2.1 Declaration of Intent

This Living Will is intended to provide guidance to my family, physicians, and other healthcare providers regarding my wishes for medical treatment in the event I become unable to communicate my decisions about my medical care.

### 2.2 Legal Authority

This document is created under the authority of {{state}} law and is intended to be legally binding under state and federal law.

### 2.3 Scope of Directive

This directive applies when:

- I am in a terminal condition
- I am permanently unconscious
- I am in an end-stage condition
- I am otherwise unable to communicate my healthcare decisions

---

## 3. Definition of Terms

### 3.1 Terminal Condition

A terminal condition means an incurable condition caused by injury, disease, or illness that, according to reasonable medical judgment, will cause death within a relatively short time with or without the application of life-sustaining treatment.

### 3.2 Permanently Unconscious State

A permanently unconscious state means an incurable condition in which I am not aware of myself or my environment and show no behavioral response to the environment.

### 3.3 End-Stage Condition

An end-stage condition means an incurable condition that has resulted in progressively severe and permanent deterioration, and for which treatment would be ineffective.

### 3.4 Life-Sustaining Treatment

Life-sustaining treatment means any medical intervention, technology, procedure, or medication that is administered to delay the moment of death.

---

## 4. Healthcare Directives

### 4.1 Terminal Condition Directives

{{#if terminal_condition_directive}}
**If I am in a terminal condition:** {{terminal_condition_wishes}}

{{#if withhold_life_sustaining_treatment}}
☐ **WITHHOLD** life-sustaining treatment, including but not limited to:

- Mechanical ventilation/respirators
- Artificial nutrition and hydration
- Cardiopulmonary resuscitation (CPR)
- Dialysis
- Antibiotics for life-threatening infections
- {{additional_treatments_to_withhold}}
  {{/if}}

{{#if provide_comfort_care}}
☐ **PROVIDE** comfort care and pain relief, even if it may hasten death
{{/if}}
{{/if}}

### 4.2 Permanently Unconscious State Directives

{{#if unconscious_state_directive}}
**If I am in a permanently unconscious state:** {{unconscious_state_wishes}}

{{#if withhold_life_sustaining_unconscious}}
☐ **WITHHOLD** life-sustaining treatment
☐ **PROVIDE** comfort care only
{{/if}}
{{/if}}

### 4.3 End-Stage Condition Directives

{{#if end_stage_directive}}
**If I am in an end-stage condition:** {{end_stage_wishes}}
{{/if}}

---

## 5. Specific Medical Instructions

### 5.1 Cardiopulmonary Resuscitation (CPR)

{{#if cpr_wishes}}
**CPR Instructions:** {{cpr_directive}}
{{else}}
☐ I DO want CPR attempted
☐ I DO NOT want CPR attempted
☐ I want CPR attempted only if the situation allows for a reasonable chance of recovery
{{/if}}

### 5.2 Mechanical Ventilation

{{#if ventilation_wishes}}
**Ventilation Instructions:** {{ventilation_directive}}
{{else}}
☐ I DO want mechanical ventilation
☐ I DO NOT want mechanical ventilation
☐ I want mechanical ventilation for a trial period of {{trial_period}} days
{{/if}}

### 5.3 Artificial Nutrition and Hydration

{{#if nutrition_wishes}}
**Nutrition/Hydration Instructions:** {{nutrition_directive}}
{{else}}
☐ I DO want artificial nutrition and hydration
☐ I DO NOT want artificial nutrition and hydration
☐ I want artificial nutrition and hydration for a limited time period
{{/if}}

### 5.4 Dialysis

{{#if dialysis_wishes}}
**Dialysis Instructions:** {{dialysis_directive}}
{{else}}
☐ I DO want dialysis
☐ I DO NOT want dialysis
☐ I want dialysis only if there is a reasonable chance of recovery
{{/if}}

### 5.5 Antibiotics

{{#if antibiotics_wishes}}
**Antibiotic Instructions:** {{antibiotics_directive}}
{{else}}
☐ I DO want antibiotics for life-threatening infections
☐ I DO NOT want antibiotics for life-threatening infections
☐ I want antibiotics for comfort purposes only
{{/if}}

### 5.6 Surgery

{{#if surgery_wishes}}
**Surgery Instructions:** {{surgery_directive}}
{{else}}
☐ I DO want surgery if it may be beneficial
☐ I DO NOT want surgery
☐ I want surgery only for comfort purposes
{{/if}}

---

## 6. Pain Management and Comfort Care

### 6.1 Pain Relief

{{#if pain_relief_directive}}
**Pain Management Instructions:** {{pain_relief_wishes}}
{{else}}
☐ I want all necessary pain medication, even if it shortens my life
☐ I want pain medication that does not shorten my life
☐ I want minimal pain medication
{{/if}}

### 6.2 Comfort Measures

**Comfort Care Instructions:** {{comfort_care_wishes}}

I want the following comfort measures:

- Keep me clean and comfortable
- Provide emotional and spiritual support
- Allow family and friends to visit
- {{additional_comfort_measures}}

### 6.3 Palliative Care

{{#if palliative_care_wishes}}
**Palliative Care:** {{palliative_care_directive}}
{{/if}}

---

## 7. Organ and Tissue Donation

### 7.1 Donation Wishes

{{#if organ_donation}}
**Organ Donation:** {{organ_donation_wishes}}

{{#if donate_all_organs}}
☐ I want to donate all suitable organs and tissues
{{/if}}

{{#if specific_organ_donation}}
☐ I want to donate only the following organs/tissues: {{specific_organs}}
{{/if}}

{{#if no_organ_donation}}
☐ I DO NOT want to donate any organs or tissues
{{/if}}
{{else}}
☐ I want to donate all suitable organs and tissues
☐ I want to donate specific organs: **\*\***\_\_\_\_**\*\***
☐ I DO NOT want to donate organs or tissues
{{/if}}

### 7.2 Donation Procedures

{{#if donation_procedures}}
**Special Instructions for Donation:** {{donation_instructions}}
{{/if}}

---

## 8. Pregnancy Considerations

{{#if pregnancy_directive}}

### 8.1 Pregnancy Instructions

**If I am pregnant:** {{pregnancy_wishes}}
{{else}}
**If I am pregnant when this directive would otherwise take effect, I direct that:**
☐ This directive should be followed regardless of pregnancy
☐ Life-sustaining treatment should be provided until the fetus is viable
☐ Other instructions: ******\*\*******\_\_\_\_******\*\*******
{{/if}}

---

## 9. Religious and Spiritual Considerations

### 9.1 Religious Preferences

{{#if religious_preferences}}
**Religious/Spiritual Instructions:** {{religious_wishes}}

**Religious Leader to Contact:**

- **Name:** {{religious_leader_name}}
- **Title:** {{religious_leader_title}}
- **Phone:** {{religious_leader_phone}}
- **Religious Affiliation:** {{religious_affiliation}}
  {{/if}}

### 9.2 Spiritual Care

{{#if spiritual_care_wishes}}
**Spiritual Care Instructions:** {{spiritual_care_directive}}
{{/if}}

---

## 10. Duration and Revocation

### 10.1 Effective Period

This Living Will shall remain in effect until:

- I revoke it in writing
- I create a new Living Will that supersedes this one
- {{additional_termination_conditions}}

### 10.2 Revocation Process

I may revoke this Living Will at any time by:

- Destroying this document
- Writing a new Living Will
- Orally expressing my intent to revoke in the presence of witnesses
- Any other method recognized under {{state}} law

### 10.3 Updates and Modifications

I should review and update this document:

- Every 5 years
- After major life changes
- After changes in my health status
- When laws change

---

## 11. Healthcare Agent/Proxy Designation

{{#if healthcare_agent_designated}}

### 11.1 Primary Healthcare Agent

I designate the following person as my healthcare agent to make medical decisions for me if I cannot make them myself:

**Primary Agent:**

- **Name:** {{primary_agent_name}}
- **Relationship:** {{primary_agent_relationship}}
- **Address:** {{primary_agent_address}}
- **Phone:** {{primary_agent_phone}}
- **Email:** {{primary_agent_email}}

### 11.2 Alternate Healthcare Agent

If my primary agent is unavailable, I designate:

**Alternate Agent:**

- **Name:** {{alternate_agent_name}}
- **Relationship:** {{alternate_agent_relationship}}
- **Address:** {{alternate_agent_address}}
- **Phone:** {{alternate_agent_phone}}

### 11.3 Agent Authority

My healthcare agent has authority to:

- Make medical treatment decisions according to this Living Will
- Access my medical records
- Communicate with healthcare providers
- {{additional_agent_powers}}

### 11.4 Agent Limitations

My healthcare agent may NOT:

- Override my specific directives in this document
- {{agent_limitations}}
  {{else}}
  **I have NOT designated a healthcare agent.** Medical decisions should be made according to this Living Will and applicable law.
  {{/if}}

---

## 12. Family Notification

### 12.1 People to Notify

**Please notify the following people of my condition:**

**Primary Contact:**

- **Name:** {{primary_contact_name}}
- **Relationship:** {{primary_contact_relationship}}
- **Phone:** {{primary_contact_phone}}

**Additional Contacts:**

- {{contact_2_name}} ({{contact_2_relationship}}) - {{contact_2_phone}}
- {{contact_3_name}} ({{contact_3_relationship}}) - {{contact_3_phone}}
- {{additional_contacts}}

### 12.2 Visitation Wishes

{{#if visitation_wishes}}
**Visitation Instructions:** {{visitation_directive}}
{{/if}}

---

## 13. Additional Instructions

### 13.1 Special Circumstances

{{#if special_circumstances}}
**Special Medical Circumstances:** {{special_circumstances_directive}}
{{/if}}

### 13.2 Location Preferences

{{#if location_preferences}}
**Preferred Location for Care:** {{care_location_wishes}}
{{/if}}

### 13.3 Other Wishes

{{#if other_wishes}}
**Additional Instructions:** {{other_instructions}}
{{/if}}

---

## 14. Legal Acknowledgments

### 14.1 Mental Competency

I am of sound mind and under no duress, fraud, or undue influence. I understand the nature and consequences of this Living Will.

### 14.2 Medical Understanding

I understand that my condition may change and that medical technology may advance. This directive reflects my wishes based on my current understanding.

### 14.3 Legal Effect

I understand that this document has legal force and effect under the laws of {{state}}.

### 14.4 Healthcare Provider Instructions

I direct that healthcare providers who are unwilling or unable to comply with this directive transfer my care to providers who will honor my wishes.

---

## 15. Signatures and Witnesses

### 15.1 Declarant Signature

**EXECUTED** on **{{execution_date}}** at {{execution_location}}.

**DECLARANT:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{declarant_name}}                         |                    |
| Print Name: {{declarant_name}}             |                    |

### 15.2 Witness Requirements

{{#if witnesses_required}}
**WITNESSES:**

This document was signed in our presence. We believe the declarant to be of sound mind and under no duress.

**WITNESS 1:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{witness_1_name}}                         |                    |
| Address: {{witness_1_address}}             |                    |

**WITNESS 2:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{witness_2_name}}                         |                    |
| Address: {{witness_2_address}}             |                    |

**Witness Qualifications:**

- Neither witness is related to the declarant
- Neither witness stands to inherit from the declarant
- Neither witness is directly involved in the declarant's medical care
  {{/if}}

---

## 16. Notarization

{{#if notarization_required}}
**State of {{state}}**  
**County of {{county}}**

On this **{{execution_date}}**, before me personally appeared {{declarant_name}}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument and acknowledged to me that he/she executed the same in his/her authorized capacity.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** ******\*\*\*\*******\_******\*\*\*\*******  
**My Commission Expires:** ****\*\*\*\*****\_****\*\*\*\*****

**[Notary Seal]**
{{/if}}

---

## 17. Healthcare Provider Acknowledgment

{{#if provider_acknowledgment}}
**HEALTHCARE PROVIDER ACKNOWLEDGMENT:**

I have received a copy of this Living Will and have placed it in the patient's medical record. I understand and will comply with the directives contained herein.

**Provider:** ******\*\*\*\*******\_******\*\*\*\*******  
**Title:** ******\*\*\*\*******\_******\*\*\*\*******  
**Date:** ******\*\*\*\*******\_******\*\*\*\*******  
**Medical Facility:** ******\*\*\*\*******\_******\*\*\*\*******
{{/if}}

---

## 18. Distribution and Storage

### 18.1 Copies Provided To:

☐ Primary healthcare agent  
☐ Alternate healthcare agent  
☐ Primary care physician  
☐ Hospital/medical facility  
☐ Family members  
☐ Attorney  
☐ {{additional_copy_recipients}}

### 18.2 Storage Location

**Original Document Stored At:** {{storage_location}}  
**Additional Copies At:** {{additional_storage_locations}}

---

**IMPORTANT LEGAL NOTICE:** This living will should be reviewed by qualified legal and medical professionals to ensure compliance with state advance directive laws and to address individual medical circumstances. Living will laws vary significantly by state, and this document should be reviewed with healthcare providers to ensure it can be properly implemented.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
