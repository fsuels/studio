# Acuerdo de Liquidación de Divorcio

---

**ACUERDO DE LIQUIDACIÓN DE DIVORCIO**

Este Acuerdo de Liquidación de Divorcio ("Acuerdo") se celebra el **{{agreement_date}}** entre:

- **Parte demandante/peticionaria:** {{petitioner_name}}, con domicilio en {{petitioner_address}}
- **Parte demandada/respondente:** {{respondent_name}}, con domicilio en {{respondent_address}}

Denominadas conjuntamente las "Partes".

---

## 1. Identificación de las Partes

### 1.1 Identificación de la parte demandante/peticionaria

**Nombre legal completo:** {{petitioner_name}}  
**Fecha de nacimiento:** {{petitioner_dob}}  
**Número de Seguro Social:** {{petitioner_ssn}}  
**Licencia de conducir:** {{petitioner_license}}  
**Domicilio actual:** {{petitioner_address}}  
**Número telefónico:** {{petitioner_phone}}  
**Correo electrónico:** {{petitioner_email}}  
**Ocupación:** {{petitioner_occupation}}  
**Empleador:** {{petitioner_employer}}

### 1.2 Identificación de la parte demandada/respondente

**Nombre legal completo:** {{respondent_name}}  
**Fecha de nacimiento:** {{respondent_dob}}  
**Número de Seguro Social:** {{respondent_ssn}}  
**Licencia de conducir:** {{respondent_license}}  
**Domicilio actual:** {{respondent_address}}  
**Número telefónico:** {{respondent_phone}}  
**Correo electrónico:** {{respondent_email}}  
**Ocupación:** {{respondent_occupation}}  
**Empleador:** {{respondent_employer}}

---

## 2. Antecedentes y declaraciones

### 2.1 Información matrimonial

**Fecha del matrimonio:** {{marriage_date}}  
**Lugar del matrimonio:** {{marriage_location}}  
**Número del acta de matrimonio:** {{marriage_certificate_number}}

### 1.2 Información sobre la separación

**Fecha de separación:** {{separation_date}}  
**Motivo de la separación:** {{separation_reason}}

### 1.3 Procedimiento de divorcio

**Tribunal:** {{court_name}}  
**Número de expediente:** {{case_number}}  
**Fecha de presentación:** {{filing_date}}  
**Tipo de divorcio:** {{divorce_type}} (Contencioso/No contencioso/Sin culpa)

### 1.4 Representación legal

{{#if legal_representation}}
**Abogado(a) de la parte peticionaria:** {{petitioner_attorney}}  
**Abogado(a) de la parte respondente:** {{respondent_attorney}}
{{else}}
Ambas Partes se representan a sí mismas (pro se) en este asunto.
{{/if}}

---

## 3. Hijos del matrimonio

### 2.1 Hijos menores

{{#if minor_children}}
Las Partes tienen los siguientes hijos menores:

**Hijo(a) 1:**

- **Nombre:** {{child_1_name}}
- **Fecha de nacimiento:** {{child_1_dob}}
- **Edad:** {{child_1_age}}
- **Número de Seguro Social:** {{child_1_ssn}}

{{#if child_2_name}}
**Hijo(a) 2:**

- **Nombre:** {{child_2_name}}
- **Fecha de nacimiento:** {{child_2_dob}}
- **Edad:** {{child_2_age}}
- **Número de Seguro Social:** {{child_2_ssn}}
  {{/if}}

{{#if child_3_name}}
**Hijo(a) 3:**

- **Nombre:** {{child_3_name}}
- **Fecha de nacimiento:** {{child_3_dob}}
- **Edad:** {{child_3_age}}
- **Número de Seguro Social:** {{child_3_ssn}}
  {{/if}}

{{additional_children}}
{{else}}
Las Partes no tienen hijos menores en común.
{{/if}}

### 2.2 Hijos mayores

{{#if adult_children}}
**Hijos mayores:** {{adult_children_details}}
{{else}}
Las Partes no tienen hijos mayores en común.
{{/if}}

---

## 4. Custodia y visitas de los hijos

{{#if minor_children}}

### 3.1 Custodia legal

{{#if joint_legal_custody}}
**Custodia legal compartida:** Ambas Partes compartirán la custodia legal de los hijos menores. Todas las decisiones importantes sobre salud, educación y bienestar se tomarán de manera conjunta.
{{else}}
**Custodia legal exclusiva:** {{sole_custody_parent}} tendrá la custodia legal exclusiva de los hijos menores.
{{/if}}

### 3.2 Custodia física

{{#if joint_physical_custody}}
**Custodia física compartida:** Las Partes compartirán la custodia física conforme al siguiente calendario:
{{custody_schedule}}
{{else}}
**Custodia física principal:** {{primary_custody_parent}} tendrá la custodia física principal.  
**Régimen de visitas:** {{visitation_schedule}}
{{/if}}

### 3.3 Calendario de días festivos y vacaciones

**Días festivos:** {{holiday_schedule}}  
**Vacaciones de verano:** {{summer_vacation_schedule}}  
**Recesos escolares:** {{school_break_schedule}}

### 3.4 Transporte e intercambio

**Lugar de intercambio:** {{exchange_location}}  
**Responsable del transporte:** {{transportation_responsibility}}

{{else}}
**Sin hijos menores:** Esta sección no aplica porque las Partes no tienen hijos menores en común.
{{/if}}

---

## 5. Pensión alimenticia para los hijos

{{#if minor_children}}

### 4.1 Obligación de manutención

{{#if child_support_required}}
**Monto de manutención:** {{support_paying_parent}} pagará ${{monthly_support_amount}} mensuales en concepto de manutención infantil a {{support_receiving_parent}}.

**Frecuencia de pago:** La manutención se pagará {{support_payment_schedule}}.  
**Método de pago:** {{support_payment_method}}  
**Primer pago vence:** {{first_payment_date}}

### 4.2 Información de ingresos

**Ingreso bruto mensual de {{support_paying_parent}}:** ${{paying_parent_income}}  
**Ingreso bruto mensual de {{support_receiving_parent}}:** ${{receiving_parent_income}}

### 4.3 Gastos adicionales

**Seguro médico/odontológico:** {{medical_insurance_responsibility}}  
**Gastos médicos no reembolsados:** {{medical_expense_allocation}}  
**Gastos de cuidado infantil:** {{childcare_expense_allocation}}  
**Gastos educativos:** {{educational_expense_allocation}}  
**Actividades extracurriculares:** {{extracurricular_expense_allocation}}

### 4.4 Modificación de la manutención

La manutención infantil podrá modificarse ante un cambio sustancial en las circunstancias conforme a la ley de {{state}}.

### 4.5 Terminación de la manutención

La manutención infantil terminará cuando el menor alcance la edad de {{support_termination_age}} o ante {{support_termination_conditions}}.
{{else}}
**Sin manutención infantil:** No se requiere manutención infantil considerando el régimen de custodia y los ingresos de ambas Partes.
{{/if}}

{{else}}
**Sin hijos menores:** No aplican disposiciones de manutención infantil.
{{/if}}

---

## 6. Pensión conyugal/alimentos

### 5.1 Concesión de pensión conyugal

{{#if spousal_support_awarded}}
**Monto de pensión:** {{support_paying_spouse}} pagará ${{spousal_support_amount}} mensuales en concepto de pensión conyugal a {{support_receiving_spouse}}.

**Frecuencia de pago:** {{spousal_support_schedule}}  
**Método de pago:** {{spousal_support_payment_method}}  
**Duración:** {{spousal_support_duration}}  
**Fecha de terminación:** {{spousal_support_end_date}}

### 5.2 Eventos de terminación

La pensión conyugal terminará por:

- Fallecimiento de cualquiera de las Partes
- Nuevo matrimonio del cónyuge beneficiario
- Convivencia del cónyuge beneficiario con una pareja sentimental por más de {{cohabitation_period}}
- {{additional_termination_events}}

### 5.3 Modificación

{{spousal_support_modification_terms}}
{{else}}
**Renuncia a pensión conyugal:** Ambas Partes renuncian al derecho presente y futuro de solicitar pensión conyugal, manutención o alimentos de la otra Parte.
{{/if}}

---

## 7. División de bienes

### 6.1 Vivienda conyugal

**Domicilio del inmueble:** {{marital_home_address}}  
**Valor actual:** ${{home_current_value}}  
**Saldo hipotecario:** ${{mortgage_balance}}  
**Equidad:** ${{home_equity}}

**Disposición:** {{home_disposition}}

{{#if home_sale_required}}
**Condiciones de venta:** {{home_sale_terms}}  
**Agente de listado:** {{listing_agent}}  
**Precio mínimo de venta:** ${{minimum_sale_price}}  
**Fecha límite de cierre:** {{sale_deadline}}
{{/if}}

### 6.2 Otros bienes inmuebles

{{#if other_real_estate}}
{{other_property_details}}
{{else}}
Las Partes no poseen otros bienes inmuebles.
{{/if}}

### 6.3 Vehículos

**Vehículo 1:** {{vehicle_1_description}}  
**Adjudicado a:** {{vehicle_1_recipient}}  
**Valor actual:** ${{vehicle_1_value}}  
**Saldo del préstamo:** ${{vehicle_1_loan_balance}}

{{#if vehicle_2_description}}
**Vehículo 2:** {{vehicle_2_description}}  
**Adjudicado a:** {{vehicle_2_recipient}}  
**Valor actual:** ${{vehicle_2_value}}  
**Saldo del préstamo:** ${{vehicle_2_loan_balance}}
{{/if}}

{{additional_vehicles}}

### 6.4 Cuentas bancarias y activos financieros

**Cuenta corriente conjunta:** {{joint_checking_details}}  
**Cuenta de ahorros conjunta:** {{joint_savings_details}}  
**Cuentas individuales de {{petitioner_name}}:** {{petitioner_accounts}}  
**Cuentas individuales de {{respondent_name}}:** {{respondent_accounts}}

### 6.5 Cuentas de retiro

**Cuentas de retiro de {{petitioner_name}}:** {{petitioner_retirement}}  
**Cuentas de retiro de {{respondent_name}}:** {{respondent_retirement}}

{{#if qdro_required}}
**QDRO requerido:** Se preparará una Orden Calificada de Relaciones Domésticas (QDRO) para dividir {{qdro_account_details}}.
{{/if}}

### 6.6 Bienes personales

**Bienes del hogar:** {{household_items_division}}  
**Joyería:** {{jewelry_division}}  
**Electrónicos:** {{electronics_division}}  
**Colecciones/antigüedades:** {{collections_division}}

### 6.7 Intereses empresariales

{{#if business_interests}}
{{business_division_details}}
{{else}}
Ninguna de las Partes posee intereses empresariales.
{{/if}}

---

## 8. Asignación de deudas

### 7.1 Deudas conjuntas

**Hipoteca:** {{mortgage_responsibility}}  
**Tarjetas de crédito:** {{credit_card_responsibility}}  
**Préstamos para vehículos:** {{auto_loan_responsibility}}  
**Préstamos estudiantiles:** {{student_loan_responsibility}}

### 7.2 Deudas individuales

**Deudas individuales de {{petitioner_name}}:** {{petitioner_debts}}  
**Deudas individuales de {{respondent_name}}:** {{respondent_debts}}

### 7.3 Responsabilidad por las deudas

Cada Parte será responsable de las deudas que se le asignan y mantendrá indemne a la otra Parte frente a dichas obligaciones.

---

## 9. Seguros

### 8.1 Seguro de salud

{{#if minor_children}}
**Seguro médico de los hijos:** {{children_health_insurance}}  
**Responsabilidad por el costo:** {{health_insurance_cost_allocation}}
{{/if}}

**Seguro de salud de {{petitioner_name}}:** {{petitioner_health_insurance}}  
**Seguro de salud de {{respondent_name}}:** {{respondent_health_insurance}}

### 8.2 Seguro de vida

{{#if life_insurance_required}}
{{#if minor_children}}
**Seguro de vida para los hijos:** Ambas Partes mantendrán un seguro de vida mínimo de ${{life_insurance_amount}} con los hijos menores como beneficiarios hasta que el más joven alcance la edad de {{life_insurance_termination_age}}.
{{/if}}

{{#if spousal_support_awarded}}
**Seguro de vida para garantizar la pensión conyugal:** {{support_paying_spouse}} mantendrá un seguro de vida mínimo de ${{spousal_support_life_insurance}} designando a {{support_receiving_spouse}} como beneficiario mientras dure la pensión conyugal.
{{/if}}
{{else}}
No se establecen requisitos de seguro de vida.
{{/if}}

---

## 10. Consideraciones fiscales

### 9.1 Declaraciones de impuestos federales y estatales

**Declaraciones del año anterior ({{prior_tax_year}}):** {{prior_tax_returns}}  
**Declaración del año en curso ({{current_tax_year}}):** {{current_year_tax_filing}}  
**Estatus de presentación:** {{tax_filing_status}}  
**Responsable de preparación:** {{tax_preparation_responsibility}}  
**Distribución del costo:** {{tax_preparation_cost_allocation}}

### 9.2 Reembolsos y obligaciones tributarias

**Reembolsos federales pendientes:** {{federal_tax_refunds_allocation}}  
**Reembolsos estatales pendientes:** {{state_tax_refunds_allocation}}  
**Obligaciones federales pendientes:** {{federal_tax_liabilities_allocation}}  
**Obligaciones estatales pendientes:** {{state_tax_liabilities_allocation}}  
**Responsabilidad de pago:** {{tax_payment_responsibility}}

### 9.3 Exenciones y créditos fiscales por dependientes

{{#if minor_children}}
**Exenciones fiscales por hijos:** {{tax_exemption_allocation}}  
**Crédito tributario por hijos:** {{child_tax_credit_allocation}}  
**Crédito por ingreso del trabajo (EITC):** {{eitc_allocation}}  
**Crédito por cuidado de dependientes:** {{child_care_credit_allocation}}  
**Créditos educativos:** {{education_credit_allocation}}
{{/if}}

### 9.4 Implicaciones fiscales de transferencias de bienes

**Impuesto por transferencia de bienes raíces:** {{real_estate_transfer_tax}}  
**Consideraciones sobre ganancias de capital:** {{capital_gains_implications}}  
**Ajuste de base fiscal:** {{property_basis_considerations}}  
**Tratamiento conforme a la Sección 1041:** Las transferencias de bienes entre cónyuges como parte del divorcio generalmente no generan impuestos conforme al IRC Sección 1041.

### 9.5 Implicaciones fiscales de cuentas de retiro

**División de 401(k)/403(b):** {{retirement_division_tax_implications}}  
**División de IRA:** {{ira_division_tax_implications}}  
**División de pensiones:** {{pension_division_tax_implications}}  
**Tratamiento fiscal del QDRO:** {{qdro_tax_implications}}  
**Multas por retiro anticipado:** {{early_withdrawal_considerations}}

### 9.6 Tratamiento fiscal de la pensión conyugal

{{#if spousal_support_awarded}}
**Deducibilidad para quien paga:** {{spousal_support_deduction}}  
**Imposición para quien recibe:** {{spousal_support_income_tax}}  
**Reglas de recaptura de alimentos:** {{alimony_recapture_provisions}}  
**Cumplimiento fiscal:** Ambas Partes reconocen haber comprendido el tratamiento fiscal federal vigente de los pagos de pensión conyugal.
{{/if}}

### 9.7 Implicaciones fiscales de intereses empresariales

{{#if business_interests}}
**Fecha de valuación del negocio:** {{business_valuation_date}}  
**Base fiscal:** {{business_tax_basis}}  
**Recuperación de depreciación:** {{depreciation_recapture_implications}}  
**Obligaciones fiscales futuras:** {{business_future_tax_obligations}}
{{/if}}

### 9.8 Cancelación de deudas y consecuencias fiscales

**Ingresos por condonación de deuda:** {{cancelled_debt_tax_implications}}  
**Excepción por insolvencia:** {{insolvency_considerations}}  
**Reporte en Formulario 1099-C:** {{debt_forgiveness_reporting}}

### 9.9 Consideraciones fiscales específicas del estado

**Impuesto estatal sobre la renta:** {{state_income_tax_implications}}  
**Impuesto estatal sobre la propiedad:** {{state_property_tax_allocation}}  
**Obligaciones fiscales locales:** {{local_tax_considerations}}  
**Cuestiones multiestatales:** {{multi_state_tax_implications}}

### 9.10 Cooperación fiscal futura

**Intercambio de documentos:** Ambas Partes proporcionarán documentos fiscales cuando sea razonablemente solicitado durante cinco (5) años posteriores al divorcio.  
**Cooperación en enmiendas:** Ambas Partes cooperarán en auditorías o enmiendas posteriores vinculadas a declaraciones conjuntas.  
**Indemnización:** {{tax_indemnification_provisions}}

### 9.11 Consulta con profesionales fiscales

Ambas Partes reconocen que se les ha aconsejado consultar con profesionales de impuestos calificados respecto de las implicaciones fiscales de este acuerdo.

---

## 11. Cambio de nombre

### 10.1 Restitución de nombre

{{#if name_change_requested}}
{{name_change_petitioner}} solicita restituir su nombre a {{restored_name}}.
{{else}}
Ninguna de las Partes solicita un cambio de nombre.
{{/if}}

---

## 12. Órdenes de restricción y protección

### 11.1 Órdenes de restricción mutuas

{{#if restraining_orders}}
{{restraining_order_details}}
{{else}}
No existen órdenes de restricción vigentes entre las Partes.
{{/if}}

### 11.2 Protección contra hostigamiento

Ambas Partes se comprometen a no hostigar, amenazar ni molestar a la otra Parte.

---

## 13. Resolución de disputas

### 12.1 Mediación

{{#if mediation_required}}
Antes de presentar cualquier acción judicial para modificar este Acuerdo, las Partes intentarán resolver la disputa mediante mediación.  
**Selección del mediador:** {{mediator_selection_process}}  
**Costos de mediación:** {{mediation_cost_allocation}}
{{/if}}

### 12.2 Jurisdicción judicial

Este Acuerdo estará sujeto a la jurisdicción de {{court_name}} para efectos de ejecución y modificación.

### 12.3 Honorarios de abogados

{{attorney_fees_provision}}

---

## 14. Disposiciones generales

### 13.1 Divulgación completa

Cada Parte declara haber revelado por completo todos sus bienes, deudas, ingresos y obligaciones a la otra Parte.

### 13.2 Acuerdo voluntario

Ambas Partes celebran este Acuerdo de manera voluntaria y reconocen que han tenido la oportunidad de consultar con asesor legal independiente.

### 13.3 Acuerdo íntegro

Este Acuerdo constituye el entendimiento total entre las Partes y sustituye toda negociación o acuerdo previo.

### 13.4 Modificación

Este Acuerdo solo podrá modificarse mediante convenio escrito firmado por ambas Partes o por orden judicial.

### 13.5 Efecto vinculante

Este Acuerdo obligará a las Partes y a sus herederos, albaceas, administradores y cesionarios.

### 13.6 Divisibilidad

Si alguna disposición se considera inválida, el resto permanecerá en pleno vigor y efecto.

### 13.7 Ley aplicable

Este Acuerdo se regirá por las leyes de {{state}}.

### 13.8 Aprobación judicial

Este Acuerdo se incorporará al decreto final de divorcio.

---

## 15. Renuncias mutuas

### 14.1 Renuncia general

Salvo lo dispuesto en este Acuerdo, cada Parte libera y descarga para siempre a la otra de toda reclamación, demanda o acción derivada de la relación matrimonial.

### 14.2 Renuncia a derechos sobre bienes

Cada Parte renuncia a cualquier derecho sobre los bienes adjudicados a la otra Parte en este Acuerdo.

### 14.3 Renuncia a derechos sucesorios

{{#if estate_rights_waived}}
Cada Parte renuncia a todo derecho sucesorio respecto de la herencia de la otra Parte, salvo lo dispuesto expresamente en este documento.
{{/if}}

---

## 16. Ejecución

### 15.1 Desacato

La violación de este Acuerdo puede generar procedimientos por desacato ante el tribunal.

### 15.2 Cumplimiento específico

Este Acuerdo podrá ejecutarse mediante recursos de cumplimiento específico.

### 15.3 Daños y perjuicios

Además de otros recursos, la Parte cumplidora puede solicitar daños monetarios por cualquier incumplimiento de este Acuerdo.

---

## 17. Declaraciones

### 16.1 Reconocimientos de las Partes

Cada Parte reconoce que:

- Ha leído y comprende este Acuerdo
- Ha tenido tiempo suficiente para considerar sus términos
- Suscribe este Acuerdo de manera voluntaria
- {{#if legal_representation}}Ha recibido asesoría de un abogado independiente{{else}}Ha tenido la oportunidad de consultar con un abogado{{/if}}
- Considera que los términos son justos y razonables

### 16.2 Información financiera

Cada Parte ha proporcionado información financiera completa y exacta a la otra Parte.

---

## 18. Firmas

**EN FE DE LO CUAL**, las Partes firman este Acuerdo de Liquidación de Divorcio en la fecha indicada al inicio.

**PARTE DEMANDANTE/PETICIONARIA:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{petitioner_name}} | |
| Nombre en letra de imprenta: {{petitioner_name}} | |

**PARTE DEMANDADA/RESPONDENTE:**

| Firma | Fecha |
| ------------------------------------------ | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{respondent_name}} | |
| Nombre en letra de imprenta: {{respondent_name}} | |

---

## 19. Reconocimiento de los abogados

{{#if legal_representation}}
**ABOGADO(A) DE LA PARTE PETICIONARIA:**

He asesorado a mi cliente respecto de este Acuerdo y considero que es justo y razonable.

| Firma | Fecha |
| --------------------------------------------- | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{petitioner_attorney}} | |
| Número de licencia profesional: {{petitioner_attorney_bar}} | |

**ABOGADO(A) DE LA PARTE RESPONDENTE:**

He asesorado a mi cliente respecto de este Acuerdo y considero que es justo y razonable.

| Firma | Fecha |
| --------------------------------------------- | ------------------ |
| ******\*\*\*\*******\_******\*\*\*\******* | {{agreement_date}} |
| {{respondent_attorney}} | |
| Número de licencia profesional: {{respondent_attorney_bar}} | |

{{/if}}

---

## 20. Notarización

**Estado de {{state}}**  
**Condado de {{county}}**

En esta fecha **{{agreement_date}}**, comparecieron personalmente ante mí {{petitioner_name}} y {{respondent_name}}, quienes acreditaron con pruebas satisfactorias ser las personas cuyos nombres suscriben este instrumento y reconocieron haberlo firmado en sus calidades autorizadas.

Certifico BAJO PENA DE PERJURIO conforme a las leyes del Estado de {{state}} que el párrafo anterior es verdadero y correcto.

**DOY FE** con mi firma y sello oficial.

**Notario Público:** ******\*\*\*\*******\_******\*\*\*\*******  
**Mi comisión expira:** ****\*\*\*\*****\_****\*\*\*\*****

---

## 21. Aprobación judicial

**PARA USO DEL TRIBUNAL ÚNICAMENTE:**

Este Acuerdo de Liquidación de Divorcio queda:  
- [ ] APROBADO e INCORPORADO al fallo de divorcio  
- [ ] RECHAZADO por el tribunal

**Juez:** ******\*\*\*\*******\_******\*\*\*\*******  
**Fecha:** ******\*\*\*\*******\_******\*\*\*\*******  
**Tribunal:** {{court_name}}

---

**AVISO LEGAL IMPORTANTE:** Este acuerdo de liquidación de divorcio debe ser revisado por abogados de derecho familiar calificados que representen a cada Parte para garantizar el cumplimiento de las leyes de divorcio del estado y la protección de los derechos individuales. Las leyes de divorcio varían considerablemente entre estados, y este acuerdo debe ser aprobado por el tribunal para que sea jurídicamente vinculante. Se recomienda que ambas Partes cuenten con representación legal independiente.

## _Plantilla generada por 123LegalDoc - Plataforma profesional de documentos legales_

© 2025 123LegalDoc · Formulario DIY · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
