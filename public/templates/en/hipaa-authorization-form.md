# HIPAA Authorization Form

---

**AUTHORIZATION FOR USE AND DISCLOSURE OF PROTECTED HEALTH INFORMATION**

**Patient Information:**
- **Patient Name:** {{patient_name}}
- **Date of Birth:** {{patient_dob}}
- **Address:** {{patient_address}}
- **Phone:** {{patient_phone}}
- **Patient ID/Medical Record #:** {{patient_id}}

**Healthcare Provider:**
- **Provider Name:** {{provider_name}}
- **Address:** {{provider_address}}
- **Phone:** {{provider_phone}}
- **NPI Number:** {{provider_npi}}

**Date of Authorization:** {{authorization_date}}

---

## 1. Authorization Details

### 1.1 Information to be Disclosed
I authorize the use and disclosure of my protected health information (PHI) as described below:

**Type of Information Authorized for Release:**
{{#if all_records}}
☑ Complete medical record/all health information
{{else}}
☐ Complete medical record/all health information
{{/if}}

{{#if specific_records}}
☑ Specific information (check all that apply):
- ☐ History and physical examination
- ☐ Consultation reports
- ☐ Laboratory results (specify): {{lab_results_details}}
- ☐ Radiology/imaging reports (specify): {{radiology_details}}
- ☐ Pathology reports
- ☐ Operative/procedure reports
- ☐ Emergency department records
- ☐ Discharge summaries
- ☐ Medication lists/pharmacy records
- ☐ Immunization records
- ☐ Other (specify): {{other_records_details}}
{{else}}
☐ Specific information
{{/if}}

**Date Range of Information:**
- From: {{date_range_from}} To: {{date_range_to}}
- ☐ All dates of service
- ☐ Ongoing/future information

### 1.2 Sensitive Information
{{#if sensitive_info_included}}
This authorization includes the following types of sensitive information (check if applicable):
- ☐ Mental health/psychiatric records
- ☐ Substance abuse treatment records
- ☐ HIV/AIDS related information
- ☐ Genetic information
- ☐ Reproductive health information
- ☐ Other sensitive information: {{other_sensitive_info}}
{{/if}}

---

## 2. Parties Involved in Disclosure

### 2.1 Person/Organization Authorized to Disclose Information
**Name:** {{disclosing_entity}}
**Address:** {{disclosing_entity_address}}
**Phone:** {{disclosing_entity_phone}}
**Relationship to Patient:** {{disclosing_relationship}}

### 2.2 Person/Organization Authorized to Receive Information
**Name:** {{receiving_entity}}
**Address:** {{receiving_entity_address}}
**Phone:** {{receiving_entity_phone}}
**Relationship to Patient:** {{receiving_relationship}}

### 2.3 Additional Recipients
{{#if additional_recipients}}
The following additional parties are authorized to receive this information:
{{#each additional_recipients}}
- **Name:** {{name}}
- **Address:** {{address}}
- **Relationship:** {{relationship}}
{{/each}}
{{/if}}

---

## 3. Purpose of Disclosure

### 3.1 Reason for Authorization
I authorize this use/disclosure for the following purpose(s):

{{#if purpose_treatment}}
☑ **Treatment:** {{treatment_details}}
{{else}}
☐ **Treatment**
{{/if}}

{{#if purpose_insurance}}
☑ **Insurance/Benefits:** {{insurance_details}}
{{else}}
☐ **Insurance/Benefits**
{{/if}}

{{#if purpose_legal}}
☑ **Legal Proceedings:** {{legal_details}}
{{else}}
☐ **Legal Proceedings**
{{/if}}

{{#if purpose_personal}}
☑ **Personal Use:** {{personal_use_details}}
{{else}}
☐ **Personal Use**
{{/if}}

{{#if purpose_disability}}
☑ **Disability Determination:** {{disability_details}}
{{else}}
☐ **Disability Determination**
{{/if}}

{{#if purpose_employment}}
☑ **Employment:** {{employment_details}}
{{else}}
☐ **Employment**
{{/if}}

{{#if purpose_other}}
☑ **Other:** {{other_purpose_details}}
{{else}}
☐ **Other:** _________________________
{{/if}}

### 3.2 Specific Use Limitations
{{#if use_limitations}}
The information may only be used for the following specific purposes:
{{use_limitations_details}}
{{/if}}

---

## 4. Term and Expiration

### 4.1 Expiration
This authorization will expire:

{{#if expiration_date}}
☑ On the following date: {{expiration_date}}
{{else}}
☐ On a specific date: _______________
{{/if}}

{{#if expiration_event}}
☑ Upon the following event: {{expiration_event_description}}
{{else}}
☐ Upon the following event: _______________
{{/if}}

{{#if no_expiration}}
☑ This authorization does not expire
{{else}}
☐ This authorization does not expire
{{/if}}

### 4.2 Automatic Expiration
If no expiration date or event is specified, this authorization will expire one year from the date signed.

---

## 5. Patient Rights and Notices

### 5.1 Right to Revoke
**I understand that:**
- I have the right to revoke this authorization at any time by submitting a written request
- Revocation is not effective for actions already taken in reliance on this authorization
- Revocation does not affect information already disclosed
- To revoke, I must submit written notice to: {{revocation_address}}

### 5.2 Right to Refuse
I understand that:
- I have the right to refuse to sign this authorization
- My treatment, payment, enrollment, or eligibility for benefits cannot be conditioned on signing this authorization, except in limited circumstances
- If I refuse to sign, the consequences may be: {{refusal_consequences}}

### 5.3 Re-disclosure Warning
I understand that:
- Information disclosed under this authorization may be re-disclosed by the recipient
- Re-disclosed information may no longer be protected by federal privacy laws
- I have the right to request restrictions on re-disclosure

### 5.4 Copy of Authorization
I understand that:
- I have the right to receive a copy of this authorization
- ☐ I have received a copy of this authorization
- ☐ I decline to receive a copy of this authorization

---

## 6. Special Circumstances

### 6.1 Third-Party Payment
{{#if third_party_payment}}
I understand that the recipient may pay for obtaining these records and that payment does not affect the validity of this authorization.
{{/if}}

### 6.2 Marketing and Fundraising
{{#if marketing_disclosure}}
☑ I authorize use of my information for marketing purposes
☐ I do NOT authorize use of my information for marketing purposes
{{/if}}

{{#if fundraising_disclosure}}
☑ I authorize use of my information for fundraising activities
☐ I do NOT authorize use of my information for fundraising activities
{{/if}}

### 6.3 Research Purposes
{{#if research_disclosure}}
I understand this information may be used for research purposes and:
- The research study is: {{research_study_details}}
- My participation is voluntary
- I may withdraw from research at any time
{{/if}}

---

## 7. Fees and Costs

### 7.1 Record Copying Fees
{{#if copying_fees}}
I understand that I may be charged reasonable fees for copying and mailing records:
- **Copying Fee:** ${{copying_fee_rate}} per page
- **Mailing Fee:** ${{mailing_fee}}
- **Administrative Fee:** ${{admin_fee}}
- **Maximum Total Fee:** ${{max_fee}}
{{else}}
No fees will be charged for providing records under this authorization.
{{/if}}

### 7.2 Payment Responsibility
{{#if payment_responsibility}}
**Payment will be made by:** {{payment_responsible_party}}
{{else}}
Payment responsibility: Patient
{{/if}}

---

## 8. Special Populations

### 8.1 Minor Patients
{{#if minor_patient}}
**For patients under 18 years old:**
- **Minor's Name:** {{minor_name}}
- **Minor's Date of Birth:** {{minor_dob}}
- **Parent/Guardian Name:** {{parent_guardian_name}}
- **Relationship:** {{parent_guardian_relationship}}

I certify that I am the parent/legal guardian of the above-named minor and have the authority to sign this authorization.
{{/if}}

### 8.2 Deceased Patients
{{#if deceased_patient}}
**For deceased patients:**
- **Date of Death:** {{death_date}}
- **Authorized Representative:** {{authorized_representative}}
- **Authority:** {{representative_authority}}
{{/if}}

### 8.3 Incapacitated Patients
{{#if incapacitated_patient}}
**For incapacitated patients:**
- **Legal Representative:** {{legal_representative}}
- **Court Appointment:** {{court_appointment_details}}
- **Power of Attorney:** {{poa_details}}
{{/if}}

---

## 9. Electronic Transmission

### 9.1 Electronic Delivery
{{#if electronic_delivery}}
☑ I authorize electronic transmission of records to: {{electronic_address}}
**Method:** {{electronic_method}} (email, secure portal, fax, etc.)

**Security Notice:** I understand that electronic transmission may not be completely secure and there are risks including:
- Interception by unauthorized persons
- Incorrect delivery
- Technical transmission failures
{{/if}}

### 9.2 Delivery Preferences
**Preferred delivery method:**
- ☐ Regular mail
- ☐ Certified mail
- ☐ Email
- ☐ Secure patient portal
- ☐ Fax to: {{fax_number}}
- ☐ Pick up in person
- ☐ Other: {{other_delivery_method}}

---

## 10. Acknowledgments and Signatures

### 10.1 Patient Acknowledgment
I acknowledge that:
- I have read this authorization form and understand its contents
- All my questions about this authorization have been answered
- I understand my rights regarding this authorization
- I am signing this authorization voluntarily
- I understand the risks and benefits of authorizing this disclosure

### 10.2 Patient Signature
**Patient Signature:** _________________________________ **Date:** _____________
**Patient Name (Print):** {{patient_name}}

{{#if minor_patient}}
### 10.3 Parent/Guardian Signature
**Parent/Guardian Signature:** _________________________________ **Date:** _____________
**Name (Print):** {{parent_guardian_name}}
**Relationship:** {{parent_guardian_relationship}}
{{/if}}

{{#if witness_required}}
### 10.4 Witness Signature
**Witness Signature:** _________________________________ **Date:** _____________
**Witness Name (Print):** {{witness_name}}
{{/if}}

---

## 11. Healthcare Provider Use Only

### 11.1 Verification
**Staff Member Reviewing Form:** {{staff_member_name}}
**Date Reviewed:** {{review_date}}
**Verification Notes:** {{verification_notes}}

### 11.2 Processing Information
**Date Records Prepared:** {{preparation_date}}
**Prepared By:** {{prepared_by}}
**Date Sent/Delivered:** {{delivery_date}}
**Method of Delivery:** {{delivery_method}}
**Tracking Information:** {{tracking_info}}

### 11.3 Fees Collected
**Total Fees Charged:** ${{total_fees}}
**Payment Method:** {{payment_method}}
**Date Payment Received:** {{payment_date}}
**Receipt Number:** {{receipt_number}}

---

**IMPORTANT NOTICE:** This authorization complies with the Health Insurance Portability and Accountability Act (HIPAA) Privacy Rule. Healthcare providers must verify the identity of persons requesting records and ensure proper authorization before releasing protected health information.

*Template generated by 123LegalDoc - Professional Legal Document Platform*