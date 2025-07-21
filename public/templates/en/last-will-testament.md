# Last Will and Testament

---

**LAST WILL AND TESTAMENT**

I, **{{testator_name}}**, a resident of {{testator_city}}, {{testator_state}}, being of sound mind and memory, and being at least eighteen (18) years of age, do hereby make, publish, and declare this to be my Last Will and Testament, hereby expressly revoking all former wills and codicils by me made.

## TESTATOR IDENTIFICATION

**Full Legal Name:** {{testator_name}}  
**Date of Birth:** {{testator_dob}}  
**Social Security Number:** {{testator_ssn}}  
**Current Address:** {{testator_address}}  
**County:** {{testator_county}}  
**State:** {{testator_state}}  
**Zip Code:** {{testator_zip}}  
**Length of Residence:** {{residence_duration}}

I declare that I am of sound mind and memory, not under any duress, menace, fraud, or undue influence of any person, and that I am competent to make this Will.

---

## ARTICLE I: REVOCATION CLAUSE

I hereby expressly revoke all prior wills, codicils, and testamentary dispositions heretofore made by me. This Will supersedes and replaces all previous wills and codicils, and I declare this to be my only valid Last Will and Testament.

---

## ARTICLE II: FAMILY INFORMATION AND BENEFICIARY DESIGNATIONS

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

## ARTICLE III: EXECUTOR APPOINTMENT WITH COMPREHENSIVE POWERS

### Section 3.1 Primary Personal Representative/Executor

I hereby nominate, constitute, and appoint **{{executor_name}}** of {{executor_address}} to serve as the Personal Representative (Executor) of this Will and of my estate.

**Primary Executor Details:**

- **Full Name:** {{executor_name}}
- **Relationship:** {{executor_relationship}}
- **Address:** {{executor_address}}
- **Phone:** {{executor_phone}}
- **Email:** {{executor_email}}

### Section 3.2 Successor Personal Representative/Executor

If {{executor_name}} is unable, unwilling, or fails to qualify to serve as Personal Representative, I nominate **{{successor_executor_name}}** of {{successor_executor_address}} as successor Personal Representative.

**Successor Executor Details:**

- **Full Name:** {{successor_executor_name}}
- **Relationship:** {{successor_executor_relationship}}
- **Address:** {{successor_executor_address}}
- **Phone:** {{successor_executor_phone}}
- **Email:** {{successor_executor_email}}

### Section 3.3 Bond Waiver

I direct that no bond or other security shall be required of any Personal Representative appointed under this Will, unless required by applicable law.

### Section 3.4 Comprehensive Powers of Personal Representative

I grant my Personal Representative full power and authority to administer my estate, including but not limited to the following powers, all to be exercised in a fiduciary capacity:

**A. General Administrative Powers:**

- To collect, receive, and take possession of all assets of my estate
- To manage, control, and protect all estate assets
- To invest and reinvest estate funds in any property or securities
- To continue or terminate any business interests
- To employ attorneys, accountants, investment advisors, and other professionals
- To determine which assets are income or principal

**B. Real Estate Powers:**

- To sell, exchange, lease, or mortgage any real property
- To grant easements, restrictions, or other rights in real property
- To subdivide, develop, or improve real property
- To abandon property of little or no value

**C. Personal Property Powers:**

- To sell, exchange, or distribute any personal property
- To store, insure, repair, or dispose of tangible personal property
- To collect debts owed to the estate
- To compromise, settle, or abandon claims

**D. Financial Powers:**

- To open, maintain, and close bank accounts and investment accounts
- To borrow money and pledge estate assets as security
- To make loans to beneficiaries or others
- To purchase insurance or cease paying premiums on existing policies

**E. Tax and Legal Powers:**

- To prepare, file, and pay all taxes
- To make tax elections and allocations
- To represent the estate in audits and proceedings
- To settle, compromise, or litigate claims for or against the estate

**F. Distribution Powers:**

- To make distributions in cash or in kind
- To allocate specific assets to satisfy general bequests
- To value assets for distribution purposes
- To establish trusts as provided in this Will

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

## ARTICLE VI: RESIDUARY CLAUSE (ESSENTIAL PROVISION)

### Section 6.1 Primary Residuary Distribution

I give, devise, and bequeath all the rest, residue, and remainder of my estate, both real and personal, of every kind and description, wherever located, including any property that I may acquire after the execution of this Will and any property as to which I or my estate may be entitled and any property over which I may have a power of appointment (collectively, my "residuary estate"), as follows:

{{#if married}}
**First, to my spouse {{spouse_name}}:** {{spouse_percentage}}% of my residuary estate, if {{spouse_name}} survives me by {{survivorship_period}} days and is not divorced from me at the time of my death.
{{/if}}

{{#if has_children}}
**Second, to my children:** {{children_percentage}}% of my residuary estate, to be divided equally among all my children who survive me, per stirpes. If any child predeceases me but leaves descendants who survive me, such descendants shall take by representation.
{{/if}}

### Section 6.2 Contingent Residuary Beneficiaries

If none of the primary beneficiaries survive me, or if the primary residuary distribution fails for any reason, I give my entire residuary estate to:

**Primary Contingent:** {{contingent_beneficiary_1}}  
**Secondary Contingent:** {{contingent_beneficiary_2}}  
**Tertiary Contingent:** {{contingent_beneficiary_3}}

### Section 6.3 Ultimate Contingent Disposition

If all named beneficiaries predecease me or the gifts otherwise fail, I give my entire residuary estate to {{ultimate_beneficiary}} or, if no such organization exists at my death, to such charitable organizations as my Personal Representative may select in their absolute discretion.

### Section 6.4 Anti-Lapse Protection

This Will is intended to comply with anti-lapse statutes. If any beneficiary predeceases me but is survived by descendants, and if such beneficiary is my grandparent or a descendant of my grandparent, then such descendants shall take by representation the gift that would have been made to the predeceased beneficiary.

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

## ARTICLE XIV: EXECUTION AND ATTESTATION WITH PROPER WITNESS SIGNATURES

### Testator's Execution

IN WITNESS WHEREOF, I, {{testator_name}}, the Testator, sign my name to this Will, consisting of {{page_count}} pages including this page, and being first duly sworn, do hereby declare to the undersigned authority that I sign and execute this instrument as my Last Will and Testament and that I sign it willingly, that I execute it as my free and voluntary act for the purposes therein expressed, and that I am eighteen (18) years of age or older, of sound mind, and under no constraint or undue influence.

**TESTATOR:**

| Signature                                  | Date               |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{execution_date}} |
| {{testator_name}}                          |                    |
| (Testator's Signature)                     |                    |

### Witness Attestation Clause

We, {{witness_1_name}} and {{witness_2_name}}, the witnesses, sign our names to this Will, being first duly sworn, and do hereby declare to the undersigned authority that the Testator signs and executes this instrument as the Testator's Last Will and Testament and that the Testator signs it willingly, and that each of us, in the presence and hearing of the Testator, hereby signs this Will as witness to the Testator's signing, and that to the best of our knowledge the Testator is eighteen (18) years of age or older, of sound mind, and under no constraint or undue influence.

**WITNESS REQUIREMENTS:**

- Witnesses must be at least 18 years of age
- Witnesses should not be beneficiaries under this Will
- Witnesses must be mentally competent
- Witnesses must sign in the presence of the Testator and each other

**WITNESS 1:**

| Signature                                  | Print Name                 | Address                                                   | Date               |
| ------------------------------------------ | -------------------------- | --------------------------------------------------------- | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{witness_1_name}}         | {{witness_1_address}}                                     | {{execution_date}} |
| (Witness 1 Signature)                      |                            | {{witness_1_city}}, {{witness_1_state}} {{witness_1_zip}} |                    |
|                                            | Phone: {{witness_1_phone}} |                                                           |                    |

**WITNESS 2:**

| Signature                                  | Print Name                 | Address                                                   | Date               |
| ------------------------------------------ | -------------------------- | --------------------------------------------------------- | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{witness_2_name}}         | {{witness_2_address}}                                     | {{execution_date}} |
| (Witness 2 Signature)                      |                            | {{witness_2_city}}, {{witness_2_state}} {{witness_2_zip}} |                    |
|                                            | Phone: {{witness_2_phone}} |                                                           |                    |

### Attestation Affidavit

The State of {{state}} requires that this Will be properly witnessed. By signing below, the witnesses attest to the following:

1. The Testator declared this instrument to be their Will
2. The Testator signed the Will in our presence or acknowledged their signature
3. The Testator appeared to be of sound mind and not under duress
4. We signed as witnesses in the presence of the Testator and each other
5. We are both over 18 years of age and competent to witness
6. To our knowledge, we are not named as beneficiaries in this Will

---

## 15. Notarization (if required by state law)

**State of {{state}}**  
**County of {{county}}**

On this **{{execution_date}}**, before me personally appeared {{testator_name}}, {{witness_1_name}}, and {{witness_2_name}}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the State of {{state}} that the foregoing paragraph is true and correct.

**WITNESS** my hand and official seal.

**Notary Public:** ******\*\*\*\*******\_******\*\*\*\*******  
**My Commission Expires:** ****\*\*\*\*****\_****\*\*\*\*****

---

**IMPORTANT LEGAL NOTICE:** This Last Will and Testament should be reviewed by a qualified estate planning attorney to ensure compliance with state laws and proper estate planning strategies. Wills must meet specific legal requirements to be valid, and laws vary significantly by state.

## _Template generated by 123LegalDoc - Professional Legal Document Platform_

© 2025 123LegalDoc · DIY form · Not legal advice · Terms: 123LegalDoc.com/terms
