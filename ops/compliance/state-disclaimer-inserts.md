# State Disclosure Inserts - Colorado & Georgia

_Last updated: 2025-09-19T17:35:00Z (UTC)_

## Usage Notes
- Audience: Platform (UI banners, checkout), Document Intelligence (template guidance), Growth (marketing copy), Compliance (review/approvals).
- Apply concurrently with the bilingual policy rollout plan (see ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md).
- Do not alter statutory citations; if product copy must be shortened, retain the phrases in **bold**.
- Store rendered evidence (screenshots, template excerpts) under ops/artifacts/<release_cycle>/ once implemented.

## Colorado Disclosure Package
**Statutory references**: Colo. Rev. Stat. 6-1-105(1)(bbb), Colo. Rev. Stat. 15-14-705, Colo. Rev. Stat. 24-21-514.5, Colorado Rules of Professional Conduct 5.5.

### Required Statements (English)
1. **Nonlawyer Status Banner (UI/Marketing)**  
   "123LegalDoc is **not a law firm or a substitute for an attorney**. We do not provide legal advice. You may wish to consult a licensed Colorado attorney for your specific situation."
2. **Service Scope Clarifier (Workflow Intro)**  
   "Our team members are not attorneys and cannot review your answers for legal sufficiency. Completing these forms does **not** create an attorney-client relationship."
3. **Notarization & Witness Prompt (POA / Recordable Documents)**  
   "Colorado durable powers of attorney must be notarized. Certain real estate filings also require county-specific formatting (Colo. Rev. Stat. 38-35-106). We will provide a notary checklist after you download your document."
4. **Remote Online Notary Advisory**  
   "Remote online notarization is permitted in Colorado when performed by a Colorado-commissioned notary following Colo. Rev. Stat. 24-21-514.5. Confirm your notary supports remote sessions before relying on this option."

### Spanish Translation (use approved glossary; flag for certified review)
1. **Banner**  
   "123LegalDoc **no es un bufete de abogados ni sustituye a un abogado**. No ofrecemos asesoria legal. Le recomendamos consultar a un abogado con licencia en Colorado para su situacion especifica."
2. **Service Scope**  
   "Nuestro equipo no esta formado por abogados y no puede revisar sus respuestas para confirmar si cumplen con la ley. Completar estos formularios **no** crea una relacion abogado-cliente."
3. **Notarization Prompt**  
   "En Colorado, los poderes notariales duraderos deben firmarse ante notario. Ciertos tramites de bienes raices tambien requieren formatos especificos del condado (Colo. Rev. Stat. 38-35-106). Le proporcionaremos una lista de verificacion para el notario despues de descargar su documento."
4. **Remote Notary Advisory**  
   "Colorado permite la notarizacion remota cuando la realiza un notario comisionado en el estado conforme a Colo. Rev. Stat. 24-21-514.5. Confirme que su notario ofrece este servicio antes de usar esta opcion."

### Implementation Checklist
- **Document Intelligence**: embed statements 2-4 into POA, deed, and recordable-document workflows; surface banner copy in template intros. Supply county formatting checklist with download package.
- **Platform**: add banner (statement 1) to Colorado-targeted flows (geo/IP, locale `/en-us-co`, `/es-us-co`) and policy footer; link to docs/legal/disclaimer.md#colorado.
- **Growth**: update landing pages and email footers for Colorado campaigns; ensure bilingual parity.
- **Compliance**: verify screenshots and template outputs before release gate sign-off.

## Georgia Disclosure Package
**Statutory references**: O.C.G.A. 10-1-393(b)(30), O.C.G.A. 10-6B-5, O.C.G.A. 44-2-21, O.C.G.A. 45-17-8, Georgia Rule of Professional Conduct 5.5.

### Required Statements (English)
1. **Nonlawyer Notice (UI/Marketing)**  
   "123LegalDoc is a **nonlawyer document assistance service**. We are not attorneys and cannot provide legal advice."
2. **Attorney Referral Language**  
   "If you need legal advice, a Georgia-licensed attorney can help you understand your rights. We can provide referral options upon request."
3. **POA Execution Guidance**  
   "Georgia statutory powers of attorney must be signed before a notary and **two witnesses**, one of whom cannot be a relative or agent (O.C.G.A. 10-6B-5)."
4. **Recording Reminder (Real Property)**  
   "Deeds and recordable documents must comply with O.C.G.A. 44-2-21 formatting rules. Confirm county-specific cover sheet requirements before filing."

### Spanish Translation (submit for certified review)
1. **Nonlawyer Notice**  
   "123LegalDoc es un **servicio de asistencia documental sin abogados**. No somos abogados y no podemos brindar asesoria legal."
2. **Attorney Referral**  
   "Si necesita asesoria legal, un abogado con licencia en Georgia puede ayudarle a entender sus derechos. Podemos proporcionarle opciones de referencia si las solicita."
3. **POA Execution Guidance**  
   "Los poderes notariales estatutarios de Georgia deben firmarse ante un notario y **dos testigos**, uno de los cuales no puede ser familiar ni agente (O.C.G.A. 10-6B-5)."
4. **Recording Reminder**  
   "Las escrituras y otros documentos registrables deben cumplir con las reglas de formato de O.C.G.A. 44-2-21. Confirme los requisitos de la hoja de portada segun su condado antes de presentar el documento."

### Implementation Checklist
- **Document Intelligence**: add witness guidance and recording reminders to Georgia templates; include witness eligibility prompt and filing checklist download.
- **Platform**: display statements 1-2 in Georgia-specific flows and checkout; link referral request CTA to support workflow.
- **Growth**: localize marketing materials (EN/ES) with statements 1-2; include CTA for attorney referrals.
- **Compliance**: record evidence in release gate artifacts and track referral response SLA.

## Next Steps
- File integration evidence alongside release gate status (ops/artifacts/compliance-cycle-0007/release-gate-status.md).
- Once implemented, update ops/compliance/jurisdiction-us-baseline.md "Current Coverage" and "Gaps" cells to reflect production status.
- Coordinate translation review with vendor per ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md; store signed approval in ops/artifacts/<cycle>/translation-approvals/.