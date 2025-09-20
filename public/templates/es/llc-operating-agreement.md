# Acuerdo Operativo de LLC

---

**ACUERDO OPERATIVO DE SOCIEDAD DE RESPONSABILIDAD LIMITADA**

**Nombre de la compañía:** {{company_name}}  
**Estado de constitución:** {{state_of_formation}}  
**Fecha de vigencia:** {{effective_date}}

---

## 1. Información de la Compañía

### 1.1 Constitución y nombre

**Nombre de la LLC:** {{company_name}}  
**Estado de constitución:** {{state_of_formation}}  
**Domicilio de la oficina principal:** {{principal_office_address}}  
**Agente registrado:** {{registered_agent_name}} en {{registered_agent_address}}  
**EIN:** {{federal_ein}} (si corresponde)

### 1.2 Artículos de Organización

Este Acuerdo Operativo complementa los Artículos de Organización presentados ante la Secretaría de Estado de {{state_of_formation}} el {{articles_filing_date}}.

### 1.3 Objeto y actividad comercial

**Objeto social:** {{business_purpose}}

**Actividades permitidas:** La Compañía puede dedicarse a cualquier actividad comercial lícita permitida por las leyes de {{state_of_formation}}.

---

## 2. Miembros e intereses de membresía

### 2.1 Miembros iniciales

Los siguientes son los Miembros iniciales de la Compañía:

| Nombre del miembro | Domicilio | Aportación de capital | Porcentaje de propiedad | Unidades de membresía |
| ------------------ | --------- | --------------------- | ----------------------- | --------------------- |
| {{member_1_name}}  | {{member_1_address}} | ${{member_1_contribution}} | {{member_1_percentage}}% | {{member_1_units}} |
| {{member_2_name}}  | {{member_2_address}} | ${{member_2_contribution}} | {{member_2_percentage}}% | {{member_2_units}} |
| {{member_3_name}}  | {{member_3_address}} | ${{member_3_contribution}} | {{member_3_percentage}}% | {{member_3_units}} |

**Total de unidades de membresía:** {{total_units}}  
**Capital inicial total:** ${{total_initial_capital}}

### 2.2 Aportaciones adicionales de capital

{{#if additional_contributions_allowed}}
Se podrán realizar aportaciones de capital adicionales con el consentimiento de {{additional_contribution_approval}} de los Miembros.
{{else}}
Ningún Miembro estará obligado a realizar aportaciones adicionales de capital sin el consentimiento unánime.
{{/if}}

### 2.3 Reembolso de capital

Ningún Miembro tiene derecho a exigir la devolución de sus aportaciones de capital excepto tras la liquidación de la Compañía.

---

## 3. Estructura de administración

### 3.1 Tipo de administración

{{#if member_managed}}
**LLC ADMINISTRADA POR SUS MIEMBROS:** La Compañía será administrada por sus Miembros.

**Autoridad de administración:** Todos los Miembros tienen iguales derechos de administración independientemente de su porcentaje de propiedad, salvo que se disponga lo contrario más adelante.

**Toma de decisiones:** Las decisiones que requieran la aprobación de los Miembros se adoptarán por el voto de {{decision_threshold}} de los Miembros.
{{/if}}

{{#if manager_managed}}
**LLC ADMINISTRADA POR GERENTES:** La Compañía será administrada por uno o más Gerentes.

**Gerente(s) inicial(es):**
{{#each managers}}
- {{name}} de {{address}}
{{/each}}

**Autoridad de los gerentes:** Los Gerentes tienen plena autoridad para administrar las operaciones diarias de la Compañía.

**Nombramiento de los gerentes:** Los Gerentes son designados por {{manager_appointment_process}} y permanecerán en el cargo hasta su renuncia, remoción o sustitución.
{{/if}}

### 3.2 Autoridad y limitaciones

**Decisiones del giro ordinario:** {{ordinary_decision_authority}}

**Decisiones mayores que requieren la aprobación de {{major_decision_threshold}}:**

- Modificación de este Acuerdo Operativo
- Admisión de nuevos Miembros
- Venta de la totalidad o la mayor parte de los activos de la Compañía
- Fusión o disolución de la Compañía
- {{additional_major_decisions}}

### 3.3 Reuniones

**Reuniones anuales:** {{#if annual_meetings_required}}Obligatorias anualmente el {{annual_meeting_date}}{{else}}No son obligatorias salvo que las convoquen los Miembros{{/if}}

**Reuniones extraordinarias:** Pueden ser convocadas por {{special_meeting_authority}}

**Aviso:** Se requiere aviso por escrito con {{meeting_notice_days}} días de antelación para todas las reuniones

**Quórum:** {{quorum_requirement}} constituyen quórum

---

## 4. Distribuciones y asignaciones

### 4.1 Distribuciones

**Política de distribución:** Las distribuciones se realizarán {{distribution_frequency}} con base en {{distribution_criteria}}.

**Porcentajes de distribución:** Las distribuciones se efectuarán a los Miembros en proporción a sus porcentajes de propiedad, salvo que {{distribution_decision_authority}} determine lo contrario.

### 4.2 Asignaciones fiscales

**Asignación de ingresos y pérdidas:** Las utilidades y pérdidas se asignarán a los Miembros conforme a sus porcentajes de propiedad.

**Elecciones fiscales:** La Compañía adoptará las siguientes elecciones fiscales:
{{tax_elections}}

### 4.3 Cuentas de capital

Se mantendrán cuentas de capital para cada Miembro de acuerdo con la normativa del Tesoro.

---

## 5. Cesión de intereses de membresía

### 5.1 Restricciones a la transferencia

**Regla general:** Ningún Miembro podrá transferir la totalidad o parte de su interés de membresía sin {{transfer_approval_requirement}}.

### 5.2 Derecho de preferencia

{{#if right_of_first_refusal}}
Antes de que un Miembro transfiera su interés a un tercero, deberá ofrecerlo primero a los demás Miembros bajo las siguientes condiciones:

**Plazo de aviso:** Aviso por escrito con {{rofr_notice_days}} días de antelación  
**Condiciones:** Mismo precio y términos que la oferta del tercero  
**Plazo de respuesta:** {{rofr_response_days}} días para aceptar
{{/if}}

### 5.3 Disposiciones de compra-venta

{{#if buy_sell_provisions}}
**Eventos que activan la cláusula:** {{buy_sell_triggers}}  
**Método de valoración:** {{valuation_method}}  
**Condiciones de pago:** {{buy_sell_payment_terms}}
{{/if}}

---

## 6. Derechos y obligaciones de los Miembros

### 6.1 Derechos de los Miembros

Los Miembros tienen derecho a:

- Recibir distribuciones cuando se declaren
- Examinar los libros y registros de la Compañía
- Recibir estados financieros anuales
- Votar en los asuntos que requieran aprobación de los Miembros
- {{additional_member_rights}}

### 6.2 Obligaciones de los Miembros

Los Miembros deberán:

- Actuar de buena fe hacia la Compañía
- Mantener la confidencialidad de la información de la Compañía
- {{#if non_compete}}Cumplir con las restricciones de no competencia: {{non_compete_terms}}{{/if}}
- {{additional_member_obligations}}

### 6.3 Deberes fiduciarios

{{fiduciary_duty_provisions}}

---

## 7. Disposiciones financieras

### 7.1 Banca y registros

**Cuentas bancarias:** Los fondos de la Compañía se depositarán en cuentas designadas por el {{banking_authority}}.

**Registros:** La Compañía mantendrá libros y registros precisos en su oficina principal.

**Ejercicio fiscal:** El ejercicio fiscal de la Compañía será {{fiscal_year}}.

### 7.2 Estados financieros

Los estados financieros anuales se prepararán y entregarán a los Miembros dentro de los {{financial_statement_deadline}} posteriores al cierre del ejercicio.

---

## 8. Disolución y liquidación

### 8.1 Supuestos de disolución

La Compañía se disolverá cuando:

- Todos los Miembros voten de manera unánime
- {{dissolution_triggers}}
- Así lo exija la ley

### 8.2 Proceso de liquidación

Al producirse la disolución:

1. **Liquidación:** Los asuntos de la Compañía serán liquidados por {{liquidation_authority}}
2. **Orden de distribución de activos:**
   - Pago de deudas y obligaciones
   - Reembolso de aportaciones de capital (si existe excedente)
   - Distribución del remanente a los Miembros conforme a sus porcentajes de propiedad

---

## 9. Resolución de disputas

### 9.1 Proceso de resolución de disputas

{{#if mediation_required}}
**Mediación:** Las disputas se someterán primero a mediación en {{mediation_location}}.
{{/if}}

{{#if arbitration_required}}
**Arbitraje:** Las disputas no resueltas se someterán a arbitraje vinculante en {{arbitration_location}} conforme a {{arbitration_rules}}.
{{else}}
**Litigio:** Las disputas se resolverán ante los tribunales de {{litigation_jurisdiction}}.
{{/if}}

---

## 10. Disposiciones misceláneas

### 10.1 Ley aplicable

Este Acuerdo se regirá por las leyes de {{governing_state}}.

### 10.2 Modificación

Este Acuerdo solo podrá modificarse mediante {{amendment_requirement}}.

### 10.3 Divisibilidad

Si alguna disposición se considera inválida, las restantes continuarán en pleno vigor y efecto.

### 10.4 Efecto vinculante

Este Acuerdo obliga a los Miembros, sus herederos, sucesores y cesionarios.

### 10.5 Ejemplares

Este Acuerdo podrá firmarse en ejemplares, cada uno de los cuales se considerará original.

---

## 11. Disposiciones adicionales

{{additional_provisions}}

---

## 12. Firmas de los Miembros

**EN FE DE LO CUAL**, los Miembros han firmado este Acuerdo Operativo a partir del {{effective_date}}.

**MIEMBROS:**

**{{member_1_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{member_1_name}} | |
| Nombre en letra de imprenta: {{member_1_name}} | |

**{{member_2_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{member_2_name}} | |
| Nombre en letra de imprenta: {{member_2_name}} | |

{{#if member_3_name}}
**{{member_3_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{effective_date}} |
| {{member_3_name}} | |
| Nombre en letra de imprenta: {{member_3_name}} | |

{{/if}}

{{#if additional_members}}
{{additional_member_signatures}}
{{/if}}

---

**AVISO LEGAL IMPORTANTE:** Este Acuerdo Operativo de LLC debe ser revisado por un abogado empresarial calificado para garantizar el cumplimiento de las leyes estatales y los requisitos específicos del negocio. Los acuerdos operativos deben adaptarse a las necesidades particulares de cada empresa y de sus Miembros.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
