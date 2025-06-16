# Last Will and Testament

---

**LAST WILL AND TESTAMENT**

I, **{{testator_name}}**, a resident of {{testator_city}}, {{testator_state}}, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all former wills and codicils by me made.

---

## 1. Personal Information

**Full Name:** {{testator_name}}  
**Date of Birth:** {{testator_dob}}  
**Address:** {{testator_address}}  
**Social Security Number:** {{testator_ssn}}  
**State of Residence:** {{testator_state}}

---

## 2. Family Information

### 2.1 Marital Status
{{#if married}}
**Spouse:** I am married to {{spouse_name}}, and all references to "my spouse" refer to {{spouse_name}}.
{{else}}
**Marital Status:** I am not married at the time of executing this Will.
{{/if}}

### 2.2 Children
{{#if has_children}}
**Children:** I have the following children:
{{#each children}}
- {{name}}, born {{birth_date}}
{{/each}}

All references in this Will to "my children" refer to the individuals named above and any children hereafter born to or legally adopted by me.
{{else}}
**Children:** I have no children at the time of executing this Will.
{{/if}}

---

## 3. Appointment of Personal Representative (Executor)

### 3.1 Primary Personal Representative
I hereby nominate and appoint **{{executor_name}}** of {{executor_address}} to serve as the Personal Representative (Executor) of my estate.

### 3.2 Successor Personal Representative
If {{executor_name}} is unable or unwilling to serve, I nominate **{{successor_executor_name}}** of {{successor_executor_address}} as successor Personal Representative.

### 3.3 Powers of Personal Representative
I grant my Personal Representative full power and authority to:
- Collect, manage, and distribute my assets
- Pay all debts, taxes, and administration expenses
- Sell, transfer, or distribute property as necessary
- Take all actions required for proper estate administration
- Serve without bond unless required by law

---

## 4. Guardian for Minor Children

{{#if has_minor_children}}
### 4.1 Guardian Appointment
If my spouse does not survive me, I nominate **{{guardian_name}}** of {{guardian_address}} as Guardian of the person and property of my minor children.

### 4.2 Successor Guardian
If {{guardian_name}} cannot serve, I nominate **{{successor_guardian_name}}** of {{successor_guardian_address}} as successor Guardian.

### 4.3 Guardian Powers
I grant the Guardian full authority to make decisions regarding my children's health, education, and welfare, and to manage their property until they reach majority.
{{/if}}

---

## 5. Specific Bequests

### 5.1 Personal Property Bequests
I make the following specific bequests of personal property:

{{#each specific_bequests}}
**To {{beneficiary_name}}:** {{property_description}}
{{/each}}

### 5.2 Monetary Bequests
I make the following monetary bequests:

{{#each monetary_bequests}}
**To {{beneficiary_name}}:** ${{amount}}
{{/each}}

### 5.3 Real Property Bequests
{{#if real_property_bequests}}
I make the following bequests of real property:

{{#each real_property_bequests}}
**To {{beneficiary_name}}:** {{property_description}} located at {{property_address}}
{{/each}}
{{/if}}

---

## 6. Residuary Estate

### 6.1 Distribution of Residuary Estate
I give, devise, and bequeath all the rest, residue, and remainder of my estate, both real and personal, of every kind and description, wherever located (my "residuary estate") as follows:

{{#if married}}
**To my spouse {{spouse_name}}:** {{spouse_percentage}}% of my residuary estate, if {{spouse_name}} survives me by {{survivorship_period}} days.
{{/if}}

{{#if has_children}}
**To my children:** {{children_percentage}}% of my residuary estate, to be divided equally among my children who survive me, per stirpes.
{{/if}}

### 6.2 Contingent Beneficiaries
If none of the above beneficiaries survive me, I give my residuary estate to:
{{contingent_beneficiaries}}

---

## 7. Survivorship Clause

No person shall be deemed to have survived me unless such person survives me by at least {{survivorship_period}} days. Any person who dies within {{survivorship_period}} days after my death shall be deemed to have predeceased me.

---

## 8. Per Stirpes Distribution

Unless otherwise specified, all distributions to my descendants shall be made per stirpes, meaning that if any of my children predecease me, their share shall pass to their descendants by right of representation.

---

## 9. Trust Provisions for Minor Beneficiaries

### 9.1 Trust Creation
If any beneficiary is under the age of {{trust_age}} at the time of distribution, their share shall be held in trust under the following terms:

### 9.2 Trustee Appointment
**Trustee:** {{trustee_name}} of {{trustee_address}}  
**Successor Trustee:** {{successor_trustee_name}} of {{successor_trustee_address}}

### 9.3 Trust Distributions
The Trustee may distribute income and principal for the beneficiary's health, education, maintenance, and support until the beneficiary reaches age {{trust_termination_age}}, at which time the trust shall terminate and all remaining assets shall be distributed outright.

---

## 10. Digital Assets

### 10.1 Digital Asset Authorization
I authorize my Personal Representative to access, manage, and distribute my digital assets, including:
- Social media accounts
- Digital photographs and documents
- Online financial accounts
- Cryptocurrency and digital wallets
- Email accounts and digital communications

### 10.2 Digital Asset Instructions
{{digital_asset_instructions}}

---

## 11. Debts and Taxes

### 11.1 Payment of Debts
I direct my Personal Representative to pay all my just debts, funeral expenses, and costs of administration from my residuary estate.

### 11.2 Tax Allocation
All estate, inheritance, and other death taxes payable by reason of my death shall be paid from my residuary estate and shall not be apportioned among the beneficiaries.

---

## 12. No Contest Clause

If any beneficiary under this Will contests or aids in contesting the validity of this Will or any of its provisions, such person shall forfeit any benefit provided to them under this Will.

---

## 13. Miscellaneous Provisions

### 13.1 Governing Law
This Will shall be governed by and construed under the laws of {{governing_state}}.

### 13.2 Severability
If any provision of this Will is held invalid, the remaining provisions shall remain in full force and effect.

### 13.3 Gender and Number
Words of one gender include the other gender, and words in the singular include the plural and vice versa.

### 13.4 Funeral and Burial Instructions
{{funeral_instructions}}

---

## 14. Execution and Attestation

IN WITNESS WHEREOF, I have hereunto set my hand and seal this **{{execution_date}}**.

**TESTATOR:**

| Signature | Date |
|-----------|------|
| _________________________________ | {{execution_date}} |
| {{testator_name}} | |

**WITNESSES:**

We, the undersigned, do hereby certify that the above-named Testator subscribed, published, and declared the foregoing instrument to be {{testator_name}}'s Last Will and Testament in our presence, and at {{testator_name}}'s request, and in the presence of each other, we have hereunto subscribed our names as witnesses this **{{execution_date}}**.

**WITNESS 1:**

| Signature | Address | Date |
|-----------|---------|------|
| _________________________________ | {{witness_1_address}} | {{execution_date}} |
| {{witness_1_name}} | | |

**WITNESS 2:**

| Signature | Address | Date |
|-----------|---------|------|
| _________________________________ | {{witness_2_address}} | {{execution_date}} |
| {{witness_2_name}} | | |

---

## 15. Notarization (if required by state law)

**State of {{state}}**  
**County of {{county}}**

On this **{{execution_date}}**, before me personally appeared {{testator_name}}, {{witness_1_name}}, and {{witness_2_name}}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** _________________________________  
**My Commission Expires:** _________________________

---

**IMPORTANT LEGAL NOTICE:** This Last Will and Testament should be reviewed by a qualified estate planning attorney to ensure compliance with state laws and proper estate planning strategies. Wills must meet specific legal requirements to be valid, and laws vary significantly by state.

*Template generated by 123LegalDoc - Professional Legal Document Platform*