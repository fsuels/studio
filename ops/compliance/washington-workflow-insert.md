# Washington Workflow Insert & Filing Checklist

_Last updated: 2025-09-19T17:52:00Z (UTC)_

## Statutory References
- Revised Code of Washington (RCW) 2.48.190 – Nonlawyer document preparer disclosure requirements.
- RCW 11.125.050 – Execution requirements for powers of attorney (two witnesses or notarization).
- RCW 65.04.045 – Recording standards for real property documents (margins, font size, legibility).
- Washington Administrative Code (WAC) 308-30 – Notaries public (including remote online notarization rules).

## Mandatory Disclosures (UI & Workflow)
1. **Nonlawyer Banner**  
   "123LegalDoc is **not a law firm**. We are not attorneys and cannot provide legal advice."
2. **Translator Availability**  
   "Ask about Spanish-language support at support@123legaldoc.com or through our bilingual help center."
3. **Refund & Complaint Notice**  
   "Washington residents may report concerns to the Washington Attorney General's Consumer Protection Division."
4. **Remote Online Notary Advisory**  
   "Remote notarization is permitted under WAC 308-30 when performed by a Washington-commissioned notary who has notified the Department of Licensing." 

Display the banner on Washington-targeted flows (geo/IP, `/en-us-wa`, `/es-us-wa`) and include translator + complaint language in confirmation emails.

## Power of Attorney Workflow Steps
1. **Execution Prompt**  
   - Highlight that the principal must sign in front of either (a) two competent witnesses or (b) a notary public (RCW 11.125.050).
   - Warn that witnesses cannot be the agent, a home care worker, or individuals with a financial interest.
2. **Notarization Guidance**  
   - Provide downloadable checklist covering acceptable ID, venue statement (City/County, Washington), and notary seal placement.
   - Include reminder that remote online notarization requires audio/video record retention per WAC 308-30-130.
3. **Optional Co-Agent Notice**  
   - If user designates co-agents, instruct to review RCW 11.125.100 for joint authority requirements.

## Real Property Documents (Deeds, Affidavits, Conveyances)
- Enforce formatting rules: 1-inch margins, minimum 8-point font, and legible black ink (RCW 65.04.045).
- Provide cover sheet template referencing Washington Department of Recording Guidelines.
- Advise on Real Estate Excise Tax (REET) affidavit submission when applicable.

## Filing Checklist (Attach to Document Package)
| Step | Requirement | Evidence to Provide |
| --- | --- | --- |
| 1 | Confirm document meets margin/font standards (RCW 65.04.045). | Automated formatting check summary. |
| 2 | Validate witness or notary selection with eligibility prompts. | Workflow answers + checklist acknowledgement. |
| 3 | Add county-specific recording instructions (link to county recorder site). | Washington county portal link list. |
| 4 | Include translator disclosure if document prepared in Spanish. | Copy of bilingual disclosure from docs/legal/es/disclaimer.md (once published). |
| 5 | Package cover sheet and supporting affidavits. | Generated PDF or instructions in download bundle. |

## Implementation Owners
- **Document Intelligence**: integrate prompts and attach filing checklist to Washington POA, deed, and affidavit templates. Add metadata flag `jurisdictionWarnings.washington=true`.
- **Platform Engineering**: display nonlawyer banner, translator notice, and complaint language in UI and transactional emails.
- **Growth**: update Washington landing assets with compliant messaging (English/Spanish) and attorney referral guidance.
- **Compliance**: review screenshots and template outputs; store evidence under `ops/artifacts/compliance-cycle-0009/washington-implementation/`.

## Follow-Up Actions
1. Build county recorder resource list (top 10 counties) for Document Intelligence handoff.
2. Coordinate with Platform to log remote-notary usage telemetry for compliance reporting.
3. Add Washington row to DSAR cookie verification checklist once translator support confirmed.