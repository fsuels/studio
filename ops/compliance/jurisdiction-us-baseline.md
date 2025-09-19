# U.S. Jurisdiction Knowledge Base - Baseline

_Last reviewed: 2025-09-19T16:45:01.9559766Z (UTC)_

## Purpose
Establish a repeatable structure for capturing state-by-state legal requirements that impact 123LegalDoc templates, disclosures, and release gates. This baseline focuses on the first five launch states prioritized by Document Intelligence and Compliance.

## State Status Matrix
| State | Mandatory Disclosures | Execution and Filing Requirements | Current Coverage | Gaps | Next Actions | Legal References |
| --- | --- | --- | --- | --- | --- | --- |
| California | Durable power of attorney statutory warning text; consumer cancelation rights for services. | Many forms require notarization; county recording offices accept statutory POA notice phrasing. | Disclaimer and refund policy include California references. | Statutory warning text not yet surfaced in POA workflow; Spanish translations missing. | Document Intelligence to inject Probate Code warning language; Compliance to supply certified Spanish copy. | California Probate Code Sections 4121-4128; Civil Code Section 1723. |
| Texas | UPL advisory language for non-attorney services; disclosure of no attorney-client relationship. | Durable POA requires notarization; real estate filings often require county-specific forms. | General disclaimer cites Texas law but not specific Estates Code language. | Need Estates Code citation in knowledge base and placeholder footnotes for POA instructions. | Add Estates Code Section 751.0021 notice to POA templates; capture county filing checklist. | Texas Estates Code Sections 751.0021, 752.051; Texas Government Code Section 406.016. |
| New York | Consumer Bill of Rights for legal document assistants; refund timelines under General Business Law. | Power of attorney signature must be notarized and witnessed; statutory gifts rider when conveying property. | No dedicated NY guidance beyond general disclaimer. | Need summary of witness requirement and statutory gifts rider flag in workflow. | Coordinate with Document Intelligence to add rider prompt; update refund policy appendix with NY-specific timeframes. | New York General Obligations Law Article 5, Title 15; General Business Law Section 395-b. |
| Florida | Requirement to state nonlawyer status on document assist services; provide translator disclosure when applicable. | Durable POA must be signed with two witnesses and a notary; health care forms require specific notices. | No Florida-specific notice embedded in flows. | Witness pairing guidance missing; translator disclosure not localized. | Draft nonlawyer disclosure insert for workflows; document witness/notary instructions in template metadata. | Florida Statutes Sections 709.2120, 709.2105; Florida Bar Rule 10-2.1. |
| Illinois | Notice that provider is not a lawyer; offer referrals to licensed attorneys; clarify no attorney-client relationship. | POA must use statutory short form; requires notarization; real property transfers must follow 755 ILCS 45. | Templates do not yet differentiate Illinois statutory short form requirements. | Need statutory short form checklist and references in knowledge base. | Create Illinois short form comparison chart and share with Document Intelligence; flag translation parity requirement. | Illinois Power of Attorney Act (755 ILCS 45/2-10); Illinois Consumer Fraud and Deceptive Business Practices Act Section 2. |
| Washington | Nonlawyer disclosure required for document preparers; display translator availability and refund terms. | Durable POA must be notarized; certain filings require county-specific cover sheets; remote online notarization allowed with conditions. | No Washington-specific guidance in templates or policies. | Missing UPL disclosure language and filing instructions for Secretary of State documents. | Draft Washington disclosure insert for workflows and capture county filing checklist; align translations with Spanish plan. | Revised Code of Washington 2.48.190; RCW 11.125.050; Washington Administrative Code 308-30. |

## Research Backlog
1. Add Colorado and Georgia entries (high-volume document states) with notarization, witness, and filing nuance.
2. Map bilingual requirements for California, Texas, and Florida to ensure Spanish policies and DSAR scripts align with regulatory expectations.
3. Coordinate with Growth pod to log marketing claim restrictions (FTC, state AG guidance) per state.
4. Build quarterly review cadence that pairs with policy freshness audit; store deltas in ops/artifacts/<cycle>/jurisdiction-updates.md.

## Data Model Notes
- Each state entry will include: required disclaimers, execution requirements, filing instructions, cooling-off rules, accessibility mandates, and translation obligations.
- Store authoritative citations (statute number, regulation) plus links to external guidance where available.
- Track "last validated" timestamp and owner for accountability.

## Integration Checklist
- Sync with Document Intelligence backlog to tag templates with jurisdiction metadata.
- Feed compliance release gate with state-specific blockers (for example, missing statutory warnings).
- Mirror knowledge base highlights in Remember.md "Pending Cross-Pod Tasks" for coordination.

## International Readiness Placeholder
- Define data fields for GDPR, UK ICO, and Canadian PIPEDA once U.S. coverage reaches 80%.
- Capture cross-border transfer requirements and local counsel contacts in future cycle.

## Storage
- Source of truth: ops/compliance/jurisdiction-us-baseline.md (update via atomic write from ops/tmp).
- Archive prior versions under ops/archive/jurisdiction/<year>/ when changes exceed 10 states or introduce new legal obligations.






