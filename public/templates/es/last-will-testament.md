# Última Voluntad y Testamento

---

**ÚLTIMA VOLUNTAD Y TESTAMENTO**

Yo, **{{testator_name}}**, residente en {{testator_city}}, {{testator_state}}, mayor de dieciocho (18) años, en pleno uso de mis facultades mentales y sin coerción alguna, declaro este documento como mi Última Voluntad y Testamento, revocando expresamente cualquier testamento y codicilo anteriores.

## IDENTIFICACIÓN DE LA PERSONA TESTADORA

**Nombre legal completo:** {{testator_name}}  
**Fecha de nacimiento:** {{testator_dob}}  
**Número de Seguro Social:** {{testator_ssn}}  
**Domicilio actual:** {{testator_address}}  
**Condado:** {{testator_county}}  
**Estado:** {{testator_state}}  
**Código postal:** {{testator_zip}}  
**Tiempo de residencia:** {{residence_duration}}

Declaro que estoy en pleno uso de mis facultades y no actúo bajo coacción, fraude o influencia indebida. Soy legalmente competente para otorgar este testamento.

---

## ARTÍCULO I: REVOCACIÓN

Revoco expresamente todo testamento, codicilo o disposición testamentaria previa. Este documento constituye mi única Última Voluntad y Testamento válido.

---

## ARTÍCULO II: INFORMACIÓN FAMILIAR Y BENEFICIARIOS

### 2.1 Estado civil

{{#if married}}
**Cónyuge:** Estoy casado/a con {{spouse_name}}; toda referencia a “mi cónyuge” corresponde a {{spouse_name}}.
{{else}}
**Estado civil:** No estoy casado/a al momento de firmar este testamento.
{{/if}}

### 2.2 Hijos

{{#if has_children}}
**Hijos:** Tengo los siguientes hijos:
{{#each children}}
- {{name}}, nacido el {{birth_date}}
{{/each}}

Toda referencia a “mis hijos” incluye a los mencionados y a cualquier hijo que nazca o adopte posteriormente.
{{else}}
**Hijos:** No tengo hijos al momento de firmar este testamento.
{{/if}}

---

## ARTÍCULO III: NOMBRAMIENTO DE ALBACEA Y FACULTADES

### 3.1 Albacea principal

Nombro como albacea y representante personal de mi sucesión a **{{executor_name}}**, con domicilio en {{executor_address}}.

**Datos del albacea:**

- **Nombre completo:** {{executor_name}}  
- **Relación:** {{executor_relationship}}  
- **Domicilio:** {{executor_address}}  
- **Teléfono:** {{executor_phone}}  
- **Correo electrónico:** {{executor_email}}

### 3.2 Albacea suplente

Si {{executor_name}} no puede o no desea actuar, designo a **{{successor_executor_name}}**, domiciliado en {{successor_executor_address}}, como albacea suplente.

**Datos del albacea suplente:**

- **Nombre completo:** {{successor_executor_name}}  
- **Relación:** {{successor_executor_relationship}}  
- **Domicilio:** {{successor_executor_address}}  
- **Teléfono:** {{successor_executor_phone}}  
- **Correo electrónico:** {{successor_executor_email}}

### 3.3 Fianza

Dispongo que no se requiera fianza u otra garantía al albacea, salvo que la ley aplicable lo ordene.

### 3.4 Facultades del albacea

Otorgo a mi albacea plena autoridad fiduciaria para administrar mi patrimonio, incluyendo:

**A. Facultades administrativas generales**

- Reunir, custodiar y proteger los bienes sucesorios
- Gestionar, invertir o reinvertir activos
- Continuar o liquidar negocios o inversiones
- Contratar profesionales (abogados, contadores, asesores)
- Determinar la clasificación entre ingresos y capital

**B. Bienes inmuebles**

- Vender, arrendar, permutar o hipotecar inmuebles
- Otorgar servidumbres u otros derechos
- Mejorar, subdividir o abandonar propiedades sin valor

**C. Bienes muebles**

- Vender o distribuir bienes personales
- Guardar, asegurar o reparar bienes tangibles
- Cobrar créditos y conciliar reclamaciones

**D. Finanzas**

- Abrir o cerrar cuentas bancarias
- Obtener préstamos y garantizar con bienes sucesorios
- Conceder préstamos a beneficiarios cuando sea prudente
- Contratar o cancelar pólizas de seguro

**E. Distribuciones**

- Realizar distribuciones parciales o finales en dinero o especie
- Tomar decisiones de valoración y asignación de impuestos

---

## ARTÍCULO IV: DISPOSICIONES DE BIENES

### 4.1 Gastos funerarios y deudas

Ordeno que se paguen mis gastos funerarios, médicos y de administración, así como cualquier deuda legítima, tan pronto sea razonable.

### 4.2 Disposiciones específicas

{{#if specific_bequests}}
Lego los siguientes bienes:
{{specific_bequests}}
{{else}}
No realizo legados específicos en este testamento.
{{/if}}

### 4.3 Patrimonio residual

El remanente de mi patrimonio lo lego a:

{{#each residuary_beneficiaries}}
- {{name}} ({{relationship}}): {{share_percentage}}%
{{/each}}

Si algún beneficiario residual me predece, su porción se distribuirá conforme a {{residuary_contingency_plan}}.

### 4.4 Cláusulas especiales

{{special_provisions}}

---

## ARTÍCULO V: TUTELA DE HIJOS MENORES

{{#if has_minor_children}}
### 5.1 Tutor legal

Nombro a **{{guardian_name}}** de {{guardian_address}} como tutor legal de mis hijos menores.

### 5.2 Tutor suplente

Si {{guardian_name}} no puede servir, designo a **{{successor_guardian_name}}** de {{successor_guardian_address}} como tutor suplente.

### 5.3 Instrucciones

Solicito que el tutor fomente la educación, salud, desarrollo y valores familiares de mis hijos.
{{else}}
No es necesario nombrar tutor, ya que no tengo hijos menores.
{{/if}}

---

## ARTÍCULO VI: FIDEICOMISOS TESTAMENTARIOS

{{#if testamentary_trust}}
### 6.1 Creación del fideicomiso

Creo el "{{trust_name}}" para los beneficiarios designados.

### 6.2 Fiduciario

Designo a **{{trustee_name}}** como fiduciario, con **{{successor_trustee_name}}** como suplente.

### 6.3 Propósito y administración

{{trust_terms}}

### 6.4 Distribuciones

- Distribuciones para educación, manutención, salud y bienestar
- Distribución final al alcanzar {{trust_termination_age}} años o según {{trust_termination_event}}

### 6.5 Poderes del fiduciario

El fiduciario tendrá los poderes previstos por ley y por este documento para administrar el fideicomiso con prudencia.
{{else}}
No establezco fideicomisos en este testamento.
{{/if}}

---

## ARTÍCULO VII: IMPUESTOS Y GASTOS

### 7.1 Impuestos sucesorios

Dispongo que los impuestos federales y estatales sobre el patrimonio se paguen con cargo al patrimonio residual, salvo que la ley obligue otra cosa.

### 7.2 Gastos administrativos

Los costos de administración, honorarios profesionales y otros gastos se pagarán del patrimonio antes de realizar distribuciones.

---

## ARTÍCULO VIII: DISPOSICIONES ADICIONALES

### 8.1 Cláusula de no impugnación

{{no_contest_clause}}

### 8.2 Derechos de la pareja

{{spousal_rights_clause}}

### 8.3 Propiedad comunitaria

{{community_property_clause}}

### 8.4 Animales de compañía

{{pet_provisions}}

### 8.5 Donación de órganos y restos

{{organ_donation_clause}}

### 8.6 Disposición digital

{{digital_assets_clause}}

---

## ARTÍCULO IX: INTERPRETACIÓN

Este testamento se interpreta conforme a las leyes de {{governing_state}}. Las palabras en género masculino o femenino incluyen ambos, y el singular incluye el plural, según corresponda.

---

## ARTÍCULO X: FIRMA Y TESTIGOS

Firmado en {{execution_city}}, {{execution_state}}, el día **{{execution_date}}**.

**Firma de la persona testadora:** _______________________________  
**Nombre:** {{testator_name}}

### Testigos

Ratificamos que {{testator_name}} firmó este testamento voluntariamente en nuestra presencia, y que la persona testadora aparenta gozar de plena capacidad mental.

**Testigo 1:**  
Nombre: {{witness_one_name}}  
Domicilio: {{witness_one_address}}  
Firma: _______________________________  
Fecha: {{witness_one_date}}

**Testigo 2:**  
Nombre: {{witness_two_name}}  
Domicilio: {{witness_two_address}}  
Firma: _______________________________  
Fecha: {{witness_two_date}}

{{#if additional_witness_required}}
**Testigo 3:**  
Nombre: {{witness_three_name}}  
Domicilio: {{witness_three_address}}  
Firma: _______________________________  
Fecha: {{witness_three_date}}
{{/if}}

---

## ARTÍCULO XI: DECLARACIÓN NOTARIAL

**Estado de {{state}}**  
**Condado de {{county}}**

El **{{notary_date}}**, compareció ante mí {{testator_name}}, a quien reconozco (o quien presentó identificación suficiente), y manifestó que firmó libremente este documento.

**Firma del/de la notario/a:** _______________________________  
**Nombre:** {{notary_name}}  
**Número de comisión:** {{notary_commission_number}}  
**Expiración de la comisión:** {{notary_commission_expiration}}

---

## ANEXOS Y DISPOSICIONES OPCIONALES

{{optional_annexes}}

---

**AVISO LEGAL IMPORTANTE:** Las leyes testamentarias varían por estado. Consulte a un abogado para asegurarse de que este documento cumpla con los requisitos de {{governing_state}}, especialmente en lo relativo a testigos, notarización, propiedad comunitaria y disposiciones especiales.

## _Documento generado por 123LegalDoc - Plataforma Profesional de Documentos Legales_

(c) 2025 123LegalDoc · Documento de autoayuda · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
