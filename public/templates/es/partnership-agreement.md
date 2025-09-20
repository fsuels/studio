# Contrato de Sociedad

---

**CONTRATO DE SOCIEDAD**

Este Contrato de Sociedad ("Contrato") se celebra el **{{agreement_date}}** entre:

**Socios:**

- **{{partner_1_name}}**, con domicilio en {{partner_1_address}}
- **{{partner_2_name}}**, con domicilio en {{partner_2_address}}
  {{#if partner_3_name}}
- **{{partner_3_name}}**, con domicilio en {{partner_3_address}}
  {{/if}}
  {{additional_partners}}

Denominados conjuntamente los "Socios".

---

## 1. Constitución e información general

### 1.1 Nombre y objeto de la sociedad

**Nombre de la sociedad:** {{partnership_name}}

**Objeto comercial:** {{business_purpose}}

**Domicilio principal de la sociedad:** {{principal_address}}

### 1.2 Tipo de sociedad

{{#if general_partnership}}
Este Contrato crea una sociedad general conforme a las leyes de {{state}}.
{{/if}}

{{#if limited_partnership}}
Este Contrato crea una sociedad limitada conforme a las leyes de {{state}}.
**Socio(s) general(es):** {{general_partners}}
**Socio(s) comanditario(s):** {{limited_partners}}
{{/if}}

### 1.3 Duración de la sociedad

{{#if definite_term}}
La sociedad comenzará el {{commencement_date}} y continuará hasta el {{termination_date}}, salvo terminación anticipada conforme a este Contrato.
{{else}}
La sociedad comenzará el {{commencement_date}} y continuará hasta su terminación conforme a este Contrato.
{{/if}}

### 1.4 Registro empresarial

La sociedad se registrará ante las autoridades estatales y locales correspondientes y obtendrá todas las licencias y permisos necesarios.

---

## 2. Aportaciones de capital

### 2.1 Aportaciones iniciales

Cada Socio aportará a la sociedad lo siguiente:

**{{partner_1_name}}:**

- **Efectivo:** ${{partner_1_cash_contribution}}
- **Bienes:** {{partner_1_property_contribution}}
- **Servicios/Trabajo:** {{partner_1_service_contribution}}
- **Valor total:** ${{partner_1_total_contribution}}

**{{partner_2_name}}:**

- **Efectivo:** ${{partner_2_cash_contribution}}
- **Bienes:** {{partner_2_property_contribution}}
- **Servicios/Trabajo:** {{partner_2_service_contribution}}
- **Valor total:** ${{partner_2_total_contribution}}

{{#if partner_3_name}}
**{{partner_3_name}}:**

- **Efectivo:** ${{partner_3_cash_contribution}}
- **Bienes:** {{partner_3_property_contribution}}
- **Servicios/Trabajo:** {{partner_3_service_contribution}}
- **Valor total:** ${{partner_3_total_contribution}}
  {{/if}}

**Capital total de la sociedad:** ${{total_partnership_capital}}

### 2.2 Aportaciones adicionales

{{#if additional_contributions_required}}
Se podrán requerir aportaciones de capital adicionales conforme a: {{additional_contribution_terms}}
{{else}}
Las aportaciones de capital adicionales solo se realizarán con el consentimiento unánime de todos los Socios.
{{/if}}

### 2.3 Incumplimiento de aportación

Si un Socio no realiza las aportaciones requeridas, {{contribution_default_remedy}}.

---

## 3. Participaciones y distribución de utilidades

### 3.1 Porcentajes de participación

Con base en las aportaciones de capital y otros factores, las participaciones son:

- **{{partner_1_name}}:** {{partner_1_ownership_percentage}}%
- **{{partner_2_name}}:** {{partner_2_ownership_percentage}}%
  {{#if partner_3_name}}
- **{{partner_3_name}}:** {{partner_3_ownership_percentage}}%
  {{/if}}
  {{additional_partner_ownership}}

### 3.2 Distribución de utilidades y pérdidas

**Utilidades** se distribuirán de la siguiente manera:
{{profit_distribution_method}}

**Pérdidas** se asignarán de la siguiente manera:
{{loss_allocation_method}}

### 3.3 Calendario de distribuciones

{{#if regular_distributions}}
Las distribuciones se realizarán {{distribution_frequency}} en función del flujo de efectivo disponible.
{{else}}
Las distribuciones se realizarán conforme determinen los Socios.
{{/if}}

### 3.4 Asignaciones fiscales

Para efectos fiscales, los ingresos, ganancias, pérdidas, deducciones y créditos se asignarán conforme a los porcentajes de participación, salvo que la normativa fiscal disponga otra cosa.

---

## 4. Administración y operaciones

### 4.1 Estructura de administración

{{#if equal_management}}
Todos los Socios tendrán derechos iguales en la administración y conducción del negocio de la sociedad.
{{else}}
**Socio(s) administrador(es):** {{managing_partners}}
**Autoridad de administración:** {{management_authority_description}}
{{/if}}

### 4.2 Toma de decisiones

**Requieren consentimiento unánime:**

- Admisión de nuevos Socios
- Modificación de este Contrato
- Venta de activos de la sociedad que excedan ${{major_decision_threshold}}
- Contratación de deudas que excedan ${{debt_threshold}}
- {{additional_unanimous_matters}}

**Requieren voto mayoritario:**

- Decisiones operativas cotidianas
- Contratación y despido de empleados
- Celebración de contratos por debajo de ${{majority_decision_threshold}}
- {{additional_majority_matters}}

### 4.3 Deberes y responsabilidades de los Socios

**Responsabilidades de {{partner_1_name}}:**
{{partner_1_duties}}

**Responsabilidades de {{partner_2_name}}:**
{{partner_2_duties}}

{{#if partner_3_name}}
**Responsabilidades de {{partner_3_name}}:**
{{partner_3_duties}}
{{/if}}

### 4.4 Compromiso de tiempo

{{#if time_commitment_required}}
Cada Socio se compromete a dedicar {{required_time_commitment}} a las actividades de la sociedad.
{{/if}}

---

## 5. Gestión financiera

### 5.1 Banca y cuentas

**Banco principal:** {{primary_bank}}
**Firmantes autorizados:** {{account_signatories}}
**Requisitos de firma:** {{signature_requirements}}

### 5.2 Libros y registros

La sociedad llevará libros y registros exactos conforme a principios de contabilidad generalmente aceptados. Los libros se mantendrán en {{books_location}} y estarán disponibles para inspección por cualquier Socio.

### 5.3 Periodo contable

El ejercicio fiscal de la sociedad será {{fiscal_year_period}}.

### 5.4 Reportes financieros

{{#if financial_reporting_required}}
Se prepararán estados financieros {{financial_reporting_frequency}} y se entregarán a todos los Socios.
{{/if}}

### 5.5 Sueldos y retiros de socios

{{#if partner_salaries}}
**Sueldos de socios:**

- {{partner_1_name}}: ${{partner_1_salary}} por {{salary_period}}
- {{partner_2_name}}: ${{partner_2_salary}} por {{salary_period}}
  {{#if partner_3_name}}
- {{partner_3_name}}: ${{partner_3_salary}} por {{salary_period}}
  {{/if}}
  {{/if}}

{{#if partner_draws}}
**Retiros de socios:** Cada Socio podrá retirar hasta ${{maximum_draw_amount}} por {{draw_period}} contra su participación en las utilidades.
{{/if}}

---

## 6. Derechos y restricciones de los Socios

### 6.1 Derechos de información

Cada Socio tiene derecho a:

- Inspeccionar los libros y registros de la sociedad
- Recibir estados financieros anuales
- Recibir información sobre los asuntos de la sociedad
- {{additional_information_rights}}

### 6.2 Restricciones de competencia

{{#if non_compete_clause}}
Los Socios tienen prohibido participar en negocios que compitan con la sociedad según: {{non_compete_terms}}
{{else}}
Los Socios pueden realizar otras actividades comerciales siempre que no interfieran con sus deberes societarios.
{{/if}}

### 6.3 Confidencialidad

Los Socios se comprometen a mantener la confidencialidad de la información y secretos comerciales de la sociedad.

### 6.4 No solicitación

{{#if non_solicitation_clause}}
Los Socios acuerdan no solicitar empleados ni clientes de la sociedad durante {{non_solicitation_period}} después de su salida.
{{/if}}

---

## 7. Cesión de participaciones

### 7.1 Restricciones a la transferencia

Ningún Socio podrá transferir, vender o ceder su participación sin:
{{transfer_restriction_requirements}}

### 7.2 Derecho de preferencia

{{#if right_of_first_refusal}}
Antes de vender su participación a un tercero, el Socio deberá ofrecerla a los Socios restantes en los mismos términos y condiciones.
{{/if}}

### 7.3 Método de valuación

Las participaciones se valuarán utilizando el siguiente método: {{valuation_method}}

### 7.4 Transferencias permitidas

Las siguientes transferencias se permiten sin restricción:
{{permitted_transfers}}

---

## 8. Admisión de nuevos Socios

### 8.1 Requisitos de admisión

Nuevos Socios solo podrán admitirse con {{admission_vote_requirement}} de los Socios actuales.

### 8.2 Aportaciones de nuevos Socios

Los nuevos Socios deberán aportar {{new_partner_contribution_requirements}}.

### 8.3 Efecto sobre las participaciones existentes

Al admitirse nuevos Socios, los porcentajes de participación existente se ajustarán de la siguiente manera: {{ownership_adjustment_method}}.

---

## 9. Retiro y disolución

### 9.1 Retiro voluntario

{{#if voluntary_withdrawal_allowed}}
Un Socio podrá retirarse voluntariamente dando aviso escrito con {{withdrawal_notice_period}} de anticipación.
{{else}}
El retiro voluntario no está permitido sin el consentimiento de todos los demás Socios.
{{/if}}

### 9.2 Retiro involuntario

Un Socio podrá ser excluido por:

- Incumplimiento de este Contrato
- Condena por delito grave
- Bancarrota o insolvencia
- Incapacidad que se prolongue más de {{incapacity_period}}
- {{additional_expulsion_grounds}}

**Proceso de expulsión:** {{expulsion_process}}

### 9.3 Fallecimiento o incapacidad

{{#if death_disability_provision}}
En caso de fallecimiento o incapacidad permanente de un Socio:  
{{death_disability_terms}}
{{/if}}

### 9.4 Disolución de la sociedad

La sociedad se disolverá cuando ocurra:

- Vencimiento del plazo (si aplica)
- Acuerdo unánime de los Socios
- {{dissolution_events}}

### 9.5 Liquidación

Al disolverse, los activos se distribuirán en el siguiente orden:

1. Pago de deudas y obligaciones de la sociedad
2. Reembolso de préstamos de los Socios a la sociedad
3. Devolución de las aportaciones de capital
4. Distribución del remanente conforme a los porcentajes de participación

---

## 10. Resolución de disputas

### 10.1 Mediación

{{#if mediation_required}}
Las disputas se someterán primero a mediación con un mediador calificado elegido por los Socios.
{{/if}}

### 10.2 Arbitraje

{{#if arbitration_required}}
Las controversias no resueltas se someterán a arbitraje vinculante conforme a {{arbitration_rules}}.
{{else}}
Las controversias no resueltas se resolverán ante los tribunales de {{jurisdiction}}.
{{/if}}

### 10.3 Resolución de empates

{{#if deadlock_provision}}
En caso de empate en la administración: {{deadlock_resolution_mechanism}}
{{/if}}

---

## 11. Seguro y responsabilidad

### 11.1 Seguros de la sociedad

La sociedad mantendrá los siguientes seguros:

- Seguro de responsabilidad civil general: ${{liability_insurance_amount}}
- Seguro de propiedad: ${{property_insurance_amount}}
- {{additional_insurance_requirements}}

### 11.2 Responsabilidad de los Socios

{{#if limited_liability}}
La responsabilidad de los Socios se limita según lo previsto por la ley estatal de sociedades limitadas.
{{else}}
Los Socios tienen responsabilidad personal ilimitada por las deudas y obligaciones de la sociedad.
{{/if}}

### 11.3 Indemnización

La sociedad indemnizará a los Socios por pérdidas incurridas en el curso ordinario del negocio, excepto por dolo o incumplimiento de este Contrato.

---

## 12. Propiedad intelectual

### 12.1 Propiedad intelectual de la sociedad

Toda propiedad intelectual creada en relación con el negocio de la sociedad pertenecerá a la sociedad, incluyendo:

- Patentes y solicitudes de patente
- Marcas y marcas de servicio
- Derechos de autor
- Secretos comerciales
- {{additional_ip_categories}}

### 12.2 Propiedad intelectual preexistente

Los Socios conservan la titularidad de la propiedad intelectual previa a la formación de la sociedad: {{pre_existing_ip_terms}}

### 12.3 Licencia de propiedad intelectual

{{#if ip_license_terms}}
Los Socios otorgan a la sociedad la siguiente licencia para utilizar su propiedad intelectual preexistente: {{ip_license_details}}
{{/if}}

---

## 13. Empleo y prestaciones

### 13.1 Contratación de personal

{{#if employee_hiring_authority}}
La facultad para contratar personal será: {{hiring_authority_terms}}
{{/if}}

### 13.2 Prestaciones para empleados

{{#if employee_benefits}}
La sociedad proporcionará las siguientes prestaciones a los empleados: {{benefit_details}}
{{/if}}

### 13.3 Prestaciones para socios

{{#if partner_benefits}}
Los Socios tendrán derecho a las siguientes prestaciones: {{partner_benefit_details}}
{{/if}}

---

## 14. Disposiciones varias

### 14.1 Ley aplicable

Este Contrato se regirá por las leyes de {{governing_state}}.

### 14.2 Contrato íntegro

Este Contrato constituye el acuerdo completo entre los Socios y sustituye cualquier negociación o acuerdo previo.

### 14.3 Modificaciones

Este Contrato solo podrá modificarse mediante acuerdo escrito firmado por todos los Socios.

### 14.4 Divisibilidad

Si alguna disposición se considera inválida, las restantes continuarán en pleno vigor y efecto.

### 14.5 Avisos

Todos los avisos deberán hacerse por escrito y entregarse a:

**{{partner_1_name}}:** {{partner_1_notice_address}}
**{{partner_2_name}}:** {{partner_2_notice_address}}
{{#if partner_3_name}}
**{{partner_3_name}}:** {{partner_3_notice_address}}
{{/if}}

### 14.6 Fuerza vinculante

Este Contrato será vinculante para los Socios, sus herederos, albaceas, administradores y cesionarios.

### 14.7 Copias

Este Contrato podrá firmarse en ejemplares, cada uno considerado original.

---

## 15. Elecciones y consideraciones fiscales

### 15.1 Elecciones fiscales

{{#if tax_elections}}
La sociedad realiza las siguientes elecciones fiscales: {{tax_election_details}}
{{/if}}

### 15.2 Socio representante fiscal

{{#if tax_matters_partner}}
{{tax_matters_partner_name}} se designa como socio encargado de asuntos fiscales para efectos de la ley federal.
{{/if}}

### 15.3 Distribuciones para impuestos

{{#if tax_distributions}}
La sociedad realizará distribuciones para cubrir las obligaciones fiscales de los Socios conforme a: {{tax_distribution_terms}}
{{/if}}

---

## 16. Firmas

**EN FE DE LO CUAL**, los Socios firman este Contrato de Sociedad en la fecha indicada al inicio.

**SOCIOS:**

**{{partner_1_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{partner_1_name}} | |
| Nombre en letra de imprenta: {{partner_1_name}} | |

**{{partner_2_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{partner_2_name}} | |
| Nombre en letra de imprenta: {{partner_2_name}} | |

{{#if partner_3_name}}
**{{partner_3_name}}:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{partner_3_name}} | |
| Nombre en letra de imprenta: {{partner_3_name}} | |

{{/if}}

{{additional_partner_signatures}}

---

## 17. Notarización

{{#if notarization_required}}
**Estado de {{state}}**  
**Condado de {{county}}**

En esta fecha **{{agreement_date}}**, comparecieron personalmente ante mí {{partner_1_name}}, {{partner_2_name}}{{#if partner_3_name}} y {{partner_3_name}}{{/if}}, quienes acreditaron con pruebas satisfactorias ser las personas cuyos nombres suscriben este instrumento y reconocieron haberlo firmado en sus calidades autorizadas.

Certifico BAJO PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que el párrafo anterior es verdadero y correcto.

**DOY FE** con mi firma y sello oficial.

**Notario Público:** ******\*\*\*\*******\_******\*\*\*\*******  
**Mi comisión expira:** ****\*\*\*\*****\_****\*\*\*\*****
{{/if}}

---

## 18. Reconocimiento del abogado

{{#if attorney_prepared}}
**CERTIFICACIÓN DEL ABOGADO:**

Certifico que he asesorado a los Socios respecto de este Contrato de Sociedad y considero que se ha ejecutado correctamente y cumple con la legislación aplicable.

**Abogado:** {{attorney_name}}  
**Número de licencia profesional:** {{attorney_bar_number}}  
**Firma:** ******\*\*\*\*******\_******\*\*\*\*******  
**Fecha:** {{agreement_date}}
{{/if}}

---

**AVISO LEGAL IMPORTANTE:** Este contrato de sociedad debe ser revisado por profesionales legales y fiscales calificados para garantizar el cumplimiento con las leyes estatales de sociedades y para abordar las consideraciones comerciales y fiscales específicas. Las leyes de sociedades varían por estado, y este contrato debe adaptarse a las necesidades particulares de los Socios y de su negocio. Considere si una sociedad de responsabilidad limitada (LLC) o una corporación podrían ajustarse mejor a las necesidades de los Socios.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
