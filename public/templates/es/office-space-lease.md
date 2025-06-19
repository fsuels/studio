# Arrendamiento de Espacio de Oficina

---

**CONTRATO DE ARRENDAMIENTO DE ESPACIO DE OFICINA**

Este Contrato de Arrendamiento de Espacio de Oficina ("Arrendamiento") se celebra el **{{lease_date}}**, entre:

- **Arrendador:** {{landlord_name}}, una {{landlord_entity_type}} con domicilio en {{landlord_address}}

- **Arrendatario:** {{tenant_name}}, una {{tenant_entity_type}} organizada bajo las leyes de {{tenant_state}}, con su lugar principal de negocios en {{tenant_address}}

Referidas colectivamente como las "Partes".

---

## 1. Locales Arrendados

### 1.1 Descripción de la Propiedad
**Dirección del Edificio:** {{building_address}}
**Número de Suite/Unidad:** {{suite_number}}
**Piso:** {{floor_number}}
**Pies Cuadrados Arrendables:** {{rentable_square_feet}} pies²
**Pies Cuadrados Utilizables:** {{usable_square_feet}} pies²

### 1.2 Detalles de la Propiedad
- **Tipo de Edificio:** {{building_type}}
- **Año de Construcción:** {{year_built}}
- **Clase de Edificio:** {{building_class}}
- **Tamaño Total del Edificio:** {{total_building_size}} pies²
- **Espacios de Estacionamiento:** {{parking_spaces}} espacios

### 1.3 Áreas Incluidas
Los locales arrendados incluyen:
- {{included_area_1}}
- {{included_area_2}}
- {{included_area_3}}
- Uso de áreas comunes según sea designado por el Arrendador

### 1.4 Uso Permitido
Los locales pueden usarse solamente para: {{permitted_use}}

No se permite ningún otro uso sin el consentimiento previo por escrito del Arrendador.

---

## 2. Término del Arrendamiento

### 2.1 Término Inicial
**Fecha de Comienzo del Arrendamiento:** {{commencement_date}}
**Fecha de Expiración del Arrendamiento:** {{expiration_date}}
**Término Inicial:** {{initial_term}} años

### 2.2 Ocupación Temprana
{{#if early_occupancy}}
El Arrendatario puede ocupar los locales temprano comenzando el {{early_occupancy_date}} bajo los mismos términos de este Arrendamiento.
{{/if}}

### 2.3 Opciones de Renovación
{{#if renewal_options}}
El Arrendatario tiene {{number_of_renewals}} opción(es) de renovar por períodos de {{renewal_term}} años cada uno, sujeto a:
- Aviso por escrito {{renewal_notice_period}} meses antes de la expiración
- No tener incumplimientos sin curar bajo este Arrendamiento
- Ajuste de renta a tarifa de mercado
{{/if}}

### 2.4 Retención Después del Vencimiento
Si el Arrendatario permanece después de la expiración del arrendamiento sin acuerdo:
- El arrendamiento se vuelve mes a mes
- La renta aumenta a {{holdover_rent_multiplier}}x la última renta mensual
- Todos los demás términos del arrendamiento permanecen en vigor

---

## 3. Renta y Cargos Adicionales

### 3.1 Renta Base
**Renta Base Mensual:**
- Año 1: ${{year_1_rent}} por mes (${{year_1_psf}} por pie²)
- Año 2: ${{year_2_rent}} por mes (${{year_2_psf}} por pie²)
- Año 3: ${{year_3_rent}} por mes (${{year_3_psf}} por pie²)
- {{additional_years_rent}}

### 3.2 Escalaciones de Renta
{{#if rent_escalations}}
**Método de Escalación:** {{escalation_method}}
- Aumento anual: {{annual_increase}}%
- Ajustes CPI: {{cpi_adjustment_terms}}
- Revisiones de tarifa de mercado: {{market_review_terms}}
{{/if}}

### 3.3 Renta Adicional
El Arrendatario pagará los siguientes cargos adicionales:
- **Mantenimiento de Área Común (CAM):** ${{cam_rate}} por pie² anualmente
- **Impuestos a la Propiedad:** {{tax_allocation_method}}
- **Seguro:** {{insurance_allocation_method}}
- **Servicios Públicos:** {{utility_allocation}}

### 3.4 Escalaciones de Gastos Operativos
{{#if expense_escalations}}
**Año Base:** {{base_year}}
**Participación del Arrendatario:** {{tenant_percentage}}% del edificio
El Arrendatario paga parte proporcional de aumentos sobre gastos del año base.
{{/if}}

### 3.5 Términos de Pago
- Renta vence el 1ro de cada mes
- Cargo por pago tardío de {{late_fee_amount}} si se paga después de {{grace_period}} días
- Cargo por fondos insuficientes: ${{nsf_fee}} por ocurrencia
- Reconciliación anual de gastos operativos

---

## 4. Depósito de Seguridad y Renta Prepagada

### 4.1 Depósito de Seguridad
**Monto del Depósito de Seguridad:** ${{security_deposit}}
- Mantenido como seguridad para cumplimiento de obligaciones del arrendamiento
- No se considera renta prepagada
- Devuelto dentro de {{deposit_return_period}} días después de terminación del arrendamiento

### 4.2 Renta Prepagada
**Renta del Primer Mes:** ${{first_month_rent}}
**Renta del Último Mes:** ${{last_month_rent}} (si aplica)

### 4.3 Carta de Crédito
{{#if letter_of_credit}}
En lugar de depósito en efectivo, el Arrendatario puede proporcionar una carta de crédito irrevocable por ${{loc_amount}}.
{{/if}}

---

## 5. Mejoras del Arrendatario y Construcción

### 5.1 Condición de los Locales
{{#if as_is_condition}}
El Arrendatario acepta los locales en condición "como están".
{{else}}
El Arrendador entregará los locales en la siguiente condición: {{delivery_condition}}
{{/if}}

### 5.2 Asignación para Mejoras del Arrendatario
{{#if improvement_allowance}}
**Asignación TI:** ${{ti_allowance}} por pie² (${{total_ti_allowance}} total)
**Usos Permitidos:** {{ti_allowable_uses}}
**Proceso de Aprobación:** {{ti_approval_process}}
**Fecha Límite:** Las mejoras deben completarse antes del {{ti_deadline}}
{{/if}}

### 5.3 Requisitos de Construcción
Todas las mejoras del arrendatario deben:
- Cumplir con estándares y códigos del edificio
- Recibir aprobación previa por escrito del Arrendador
- Usar contratistas aprobados por el Arrendador
- Obtener permisos necesarios
- Proporcionar garantías y renuncias de gravámenes

### 5.4 Requisitos de Restauración
{{#if restoration_required}}
Al terminar el arrendamiento, el Arrendatario restaurará los locales a condición original, excluyendo desgaste normal.
{{else}}
No se requiere restauración para mejoras estándar de oficina.
{{/if}}

---

## 6. Mantenimiento y Reparaciones

### 6.1 Responsabilidades del Arrendador
El Arrendador mantendrá y reparará:
- Elementos estructurales del edificio
- Techo y paredes exteriores
- Áreas y facilidades comunes
- Sistemas del edificio (HVAC, eléctrico, plomería)
- {{additional_landlord_responsibilities}}

### 6.2 Responsabilidades del Arrendatario
El Arrendatario mantendrá y reparará:
- Interior de los locales arrendados
- Equipo y accesorios del arrendatario
- Paredes interiores no estructurales
- Recubrimientos de piso y tratamientos de ventanas
- {{additional_tenant_responsibilities}}

### 6.3 Servicios HVAC
{{#if hvac_included}}
**Servicio HVAC:** Incluido durante horas estándar del edificio ({{standard_hours}})
**HVAC Fuera de Horas:** ${{after_hours_hvac_rate}} por hora
{{else}}
Arrendatario responsable por mantenimiento HVAC y costos de servicios públicos.
{{/if}}

### 6.4 Servicios de Limpieza
{{#if janitorial_included}}
**Servicio de Limpieza:** Limpieza {{janitorial_frequency}} incluida
**Nivel de Servicio:** {{janitorial_scope}}
{{else}}
Arrendatario responsable por servicios de limpieza.
{{/if}}

---

## 7. Servicios Públicos y Servicios

### 7.1 Asignación de Servicios Públicos
**Electricidad:** {{electricity_allocation}}
**Gas:** {{gas_allocation}}
**Agua/Alcantarillado:** {{water_allocation}}
**Telecomunicaciones:** {{telecom_allocation}}
**Internet:** {{internet_allocation}}

### 7.2 Depósitos de Servicios Públicos
{{#if utility_deposits_required}}
Arrendatario responsable por depósitos de servicios públicos y tarifas de conexión.
{{/if}}

### 7.3 Servicios del Edificio
Servicios incluidos del edificio:
- {{building_service_1}}
- {{building_service_2}}
- {{building_service_3}}
- Servicios de seguridad: {{security_services}}

### 7.4 Interrupciones de Servicio
El Arrendador no es responsable por interrupciones de servicios públicos o servicios fuera del control del Arrendador, excepto por cortes prolongados que excedan {{service_interruption_threshold}} días consecutivos.

---

## 8. Seguro y Responsabilidad

### 8.1 Requisitos de Seguro del Arrendatario
El Arrendatario mantendrá:
- **Responsabilidad General:** ${{general_liability_amount}} por ocurrencia
- **Seguro de Propiedad:** Costo completo de reemplazo de propiedad del arrendatario
- **Compensación de Trabajadores:** Según requerido por ley
- **Interrupción del Negocio:** {{business_interruption_amount}}

### 8.2 Seguro del Arrendador
El Arrendador mantendrá:
- Seguro de propiedad en edificio y áreas comunes
- Seguro de responsabilidad general
- Seguro de pérdida de rentas

### 8.3 Requisitos de Seguro
Todo seguro debe:
- Nombrar al Arrendador como asegurado adicional
- Proporcionar {{insurance_notice_period}} días de aviso de cancelación
- Incluir cláusula de renuncia a subrogación
- Ser primario y no contributorio

### 8.4 Indemnización
{{#if mutual_indemnification}}
Cada parte indemnizará a la otra por reclamaciones que surjan de su respectiva negligencia o mala conducta.
{{else}}
El Arrendatario indemnizará al Arrendador por reclamaciones que surjan del uso de los locales por el Arrendatario.
{{/if}}

---

## 9. Cesión y Subarrendamiento

### 9.1 Restricciones de Cesión
El Arrendatario no puede ceder este Arrendamiento sin el consentimiento previo por escrito del Arrendador, el cual no será negado irrazonablemente.

### 9.2 Subarrendamiento
{{#if subletting_allowed}}
El Arrendatario puede subarrendar con consentimiento del Arrendador, sujeto a:
- Subarrendatario cumpliendo estándares de solvencia del Arrendador
- Términos de subarrendamiento consistentes con este Arrendamiento
- {{subletting_conditions}}
{{else}}
El subarrendamiento está prohibido sin consentimiento expreso por escrito del Arrendador.
{{/if}}

### 9.3 Tarifas de Cesión/Subarrendamiento
**Tarifa de Procesamiento:** ${{assignment_fee}}
**Tarifa de Revisión Legal:** ${{legal_review_fee}}

### 9.4 Derechos de Recaptura
{{#if recapture_rights}}
El Arrendador puede recapturar espacio si el Arrendatario busca ceder o subarrendar más del {{recapture_threshold}}% de los locales.
{{/if}}

---

## 10. Incumplimiento y Remedios

### 10.1 Incumplimiento del Arrendatario
El Arrendatario estará en incumplimiento si:
- La renta no se paga por {{rent_default_period}} días después de aviso por escrito
- Otras violaciones del arrendamiento permanecen sin curar {{cure_period}} días después del aviso
- El Arrendatario se vuelve insolvente o se declara en bancarrota
- El Arrendatario abandona los locales

### 10.2 Remedios del Arrendador
Ante incumplimiento del arrendatario, el Arrendador puede:
- Terminar el arrendamiento y reentrar a los locales
- Rearrendar los locales y cobrar daños
- Continuar el arrendamiento y demandar por renta
- Buscar cualquier otro remedio legal

### 10.3 Incumplimiento del Arrendador
{{#if landlord_default_provisions}}
El Arrendador estará en incumplimiento si obligaciones materiales permanecen sin cumplir por {{landlord_cure_period}} días después de aviso por escrito.

**Remedios del Arrendatario:**
- Autoayuda y compensar costos contra renta
- Terminar arrendamiento por incumplimientos materiales
- Demandar por daños
{{/if}}

### 10.4 Cargos por Pago Tardío
**Cargo por Pago Tardío:** {{late_fee_amount}} si la renta se paga después de {{grace_period}} días
**Tasa de Interés:** {{interest_rate}}% anual en montos vencidos

---

## 11. Reglas y Regulaciones

### 11.1 Reglas del Edificio
El Arrendatario cumplirá con reglas y regulaciones del edificio, incluyendo:
- {{building_rule_1}}
- {{building_rule_2}}
- {{building_rule_3}}
- Regulaciones de estacionamiento: {{parking_rules}}

### 11.2 Horas de Operación
**Horas del Edificio:** {{building_hours}}
**Acceso:** {{access_policy}}
**Acceso Fuera de Horas:** {{after_hours_access}}

### 11.3 Señalización
{{#if signage_rights}}
**Señalización Permitida:** {{signage_description}}
**Aprobación Requerida:** Toda señalización sujeta a aprobación del Arrendador
**Estándares de Señales:** {{sign_standards}}
{{else}}
No se permite señalización exterior sin consentimiento por escrito del Arrendador.
{{/if}}

### 11.4 Estacionamiento
{{#if parking_included}}
**Estacionamiento Incluido:** {{included_parking_spaces}} espacios
**Estacionamiento Adicional:** ${{additional_parking_rate}} por espacio por mes
**Reglas de Estacionamiento:** {{parking_regulations}}
{{else}}
Estacionamiento disponible a ${{parking_rate}} por espacio por mes.
{{/if}}

---

## 12. Ambiental y Cumplimiento

### 12.1 Cumplimiento Ambiental
El Arrendatario no:
- Usará o almacenará materiales peligrosos sin divulgación y aprobación
- Violará leyes o regulaciones ambientales
- Causará contaminación ambiental

### 12.2 Cumplimiento ADA
{{#if ada_compliance}}
**Cumplimiento del Edificio:** El edificio cumple requisitos ADA para áreas comunes
**Mejoras del Arrendatario:** Arrendatario responsable por cumplimiento ADA en locales arrendados
{{/if}}

### 12.3 Cumplimiento de Códigos
El Arrendatario cumplirá con todos los aplicables:
- Códigos de construcción y ordenanzas
- Regulaciones de incendio y seguridad
- Requisitos de zonificación
- Regulaciones del departamento de salud

---

## 13. Siniestro y Expropiación

### 13.1 Daño por Siniestro
Si los locales son dañados:
- **Daño Menor:** El Arrendador repara, la renta se reduce proporcionalmente
- **Daño Mayor:** Cualquier parte puede terminar si el tiempo de reparación excede {{repair_threshold}} días
- **Destrucción Total:** El arrendamiento termina automáticamente

### 13.2 Expropiación
Si los locales son expropiados:
- **Toma Total:** El arrendamiento termina en la fecha de toma
- **Toma Parcial:** El arrendamiento continúa con ajuste de renta si los locales permanecen apropiados
- **Asignación de Compensación:** {{condemnation_award_allocation}}

---

## 14. Disfrute Pacífico y Acceso

### 14.1 Disfrute Pacífico
El Arrendador otorga al Arrendatario disfrute pacífico de los locales, sujeto a términos del arrendamiento y reglas del edificio.

### 14.2 Acceso del Arrendador
El Arrendador puede entrar a los locales:
- Con {{access_notice_period}} horas de aviso para inspecciones
- Sin aviso en emergencias
- Para mostrar espacio a inquilinos/compradores prospectivos
- Para realizar mantenimiento y reparaciones

---

## 15. Disposiciones Generales

### 15.1 Ley Aplicable
Este Arrendamiento se regirá por las leyes de {{governing_state}}.

### 15.2 Resolución de Disputas
{{#if arbitration}}
Las disputas se resolverán a través de arbitraje vinculante en {{arbitration_location}}.
{{else}}
Las disputas se resolverán en las cortes de {{jurisdiction}}.
{{/if}}

### 15.3 Acuerdo Completo
Este Arrendamiento constituye el acuerdo completo y reemplaza todas las negociaciones previas.

### 15.4 Modificación
Este Arrendamiento solo puede modificarse por escrito firmado por ambas partes.

### 15.5 Separabilidad
Las disposiciones inválidas no afectarán la validez de las disposiciones restantes.

### 15.6 Avisos
Todos los avisos deben ser por escrito y entregados a las direcciones especificadas arriba.

---

## 16. Firmas

**EN FE DE LO CUAL**, las partes han ejecutado este Arrendamiento en la fecha arriba escrita.

**ARRENDADOR:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{landlord_name}} | |
| {{landlord_title}} | |

**ARRENDATARIO:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{tenant_name}} | |
| Por: {{tenant_signatory}} | |
| Título: {{tenant_title}} | |

---

**AVISO LEGAL IMPORTANTE:** Este arrendamiento de espacio de oficina debe ser revisado por profesionales inmobiliarios calificados y asesoría legal para asegurar cumplimiento con leyes locales de arrendador-inquilino y protección apropiada de intereses. Los términos de arrendamiento comercial deben negociarse cuidadosamente basándose en condiciones del mercado y requisitos específicos.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*