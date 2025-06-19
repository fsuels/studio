# Acuerdo de Compra-Venta

---

**ACUERDO DE COMPRA-VENTA**

Este Acuerdo de Compra-Venta ("Acuerdo") se celebra el **{{agreement_date}}**, entre los propietarios de {{company_name}}, una {{company_entity_type}} organizada bajo las leyes de {{company_state}} (la "Empresa"):

**Propietarios:**
{{#each owners}}
- **{{name}}:** {{percentage}}% de propiedad, {{address}}
{{/each}}

Referidos colectivamente como los "Propietarios."

---

## 1. Propósito y Resumen

### 1.1 Propósito del Acuerdo
Este Acuerdo establece los términos y condiciones para la compra y venta de participaciones de propiedad en la Empresa al ocurrir eventos desencadenantes específicos.

### 1.2 Información de la Empresa
- **Nombre de la Empresa:** {{company_name}}
- **Tipo de Entidad:** {{company_entity_type}}
- **Estado de Constitución:** {{company_state}}
- **Negocio Principal:** {{business_description}}
- **Total de Participaciones Pendientes:** {{total_interests}}

### 1.3 Propiedad Actual
| Propietario | Porcentaje de Propiedad | Número de Acciones/Unidades |
|-------------|------------------------|----------------------------|
{{#each owners}}
| {{name}} | {{percentage}}% | {{shares_units}} |
{{/each}}

---

## 2. Eventos Desencadenantes

### 2.1 Eventos Obligatorios de Compra-Venta
Los siguientes eventos desencadenarán la venta obligatoria de participaciones de propiedad:

**Muerte:** Al fallecer un Propietario, su participación debe venderse a los Propietarios restantes o a la Empresa.

**Discapacidad:** Al quedar permanentemente discapacitado un Propietario (como se define en la Sección 2.3), su participación puede ser comprada.

**Jubilación:** Al jubilarse un Propietario a los {{retirement_age}} años o después de {{years_of_service}} años de servicio.

**Terminación Involuntaria:** Al terminar el empleo de un Propietario por causa.

### 2.2 Eventos Opcionales de Compra-Venta
Los siguientes eventos pueden desencadenar la venta a opción de la Empresa o Propietarios restantes:

**Terminación Voluntaria:** Cuando un Propietario deja voluntariamente la Empresa.

**Divorcio:** Cuando la participación de propiedad de un Propietario queda sujeta a procedimientos de divorcio.

**Bancarrota:** Cuando un Propietario se declara en bancarrota o se vuelve insolvente.

**Intento de Transferencia:** Cuando un Propietario intenta transferir su participación a un tercero.

### 2.3 Definición de Discapacidad
"Discapacidad permanente" significa la incapacidad de realizar funciones esenciales del trabajo por {{disability_period}} meses consecutivos, según se determine por {{disability_determination_method}}.

---

## 3. Métodos de Valoración

### 3.1 Método Primario de Valoración
El valor de las participaciones de propiedad se determinará usando: {{primary_valuation_method}}

{{#if appraisal_method}}
### 3.2 Tasación Profesional
- **Selección de Tasador:** {{appraiser_selection_process}}
- **Estándares de Tasación:** {{appraisal_standards}}
- **Cronograma de Tasación:** {{appraisal_timeline}}
- **Asignación de Costos:** {{appraisal_cost_allocation}}
{{/if}}

{{#if formula_method}}
### 3.3 Valoración por Fórmula
La fórmula para determinar el valor es: {{valuation_formula}}
- **Múltiplo Base:** {{base_multiple}}
- **Métricas Financieras:** {{financial_metrics}}
- **Factores de Ajuste:** {{adjustment_factors}}
{{/if}}

{{#if fixed_price}}
### 3.4 Método de Precio Fijo
- **Precio Fijo Actual:** ${{fixed_price_amount}} por {{unit_type}}
- **Cronograma de Actualización de Precio:** {{price_update_schedule}}
- **Proceso de Revisión de Precio:** {{price_review_process}}
{{/if}}

### 3.5 Descuentos y Primas
- **Descuento por Participación Minoritaria:** {{minority_discount}}%
- **Descuento por Falta de Comerciabilidad:** {{marketability_discount}}%
- **Prima de Control:** {{control_premium}}%

---

## 4. Derechos y Obligaciones de Compra

### 4.1 Derecho de Primera Negativa
Al ocurrir un evento desencadenante, se aplica la siguiente prioridad de compra:
1. **Derecho de Compra de la Empresa:** {{company_purchase_right_period}} días
2. **Propietarios Restantes:** {{owners_purchase_right_period}} días
3. **Asignación Proporcional:** Basada en porcentajes de propiedad actuales

### 4.2 Obligaciones de Compra Obligatoria
{{#if mandatory_purchase}}
La Empresa y/o Propietarios restantes están obligados a comprar en las siguientes situaciones:
- {{mandatory_purchase_situations}}
{{else}}
Todas las compras bajo este Acuerdo son a opción de la parte compradora.
{{/if}}

### 4.3 Proceso de Compra
1. **Notificación de Evento Desencadenante:** Notificación escrita dentro de {{notice_period}} días
2. **Determinación de Valoración:** {{valuation_timeline}} días
3. **Decisión de Compra:** {{purchase_decision_period}} días
4. **Cierre:** {{closing_period}} días después de la decisión de compra

---

## 5. Términos de Pago

### 5.1 Estructura de Pago
**Método de Pago:** {{payment_method}}

{{#if cash_payment}}
- **Pago en Efectivo:** {{cash_percentage}}% al cierre
{{/if}}

{{#if installment_payment}}
- **Pagos a Plazos:** {{installment_percentage}}% durante {{installment_period}} años
- **Tasa de Interés:** {{interest_rate}}% anual
- **Cronograma de Pagos:** {{payment_schedule}}
{{/if}}

### 5.2 Garantía para Pagos a Plazos
{{#if installment_security}}
Los pagos a plazos estarán garantizados por: {{installment_security_method}}
{{/if}}

### 5.3 Cláusulas de Aceleración
La aceleración del pago puede ocurrir por:
- Incumplimiento en el pago por {{default_period}} días
- Incumplimiento del acuerdo de no competencia
- Otro incumplimiento material: {{other_breach_conditions}}

---

## 6. Fuentes de Financiamiento

### 6.1 Redención de la Empresa
{{#if company_funded}}
La Empresa puede financiar compras usando:
- Reservas de efectivo disponibles
- Capacidad de endeudamiento de la empresa
- {{company_funding_sources}}
{{/if}}

### 6.2 Compra Cruzada por Propietarios
{{#if cross_purchase}}
Los Propietarios individuales pueden comprar usando:
- Fondos personales
- Endeudamiento personal
- {{owner_funding_sources}}
{{/if}}

### 6.3 Seguro de Vida
{{#if life_insurance}}
Los siguientes arreglos de seguro de vida están en vigor:
- **Propietario de la Póliza:** {{life_insurance_owner}}
- **Beneficiario:** {{life_insurance_beneficiary}}
- **Monto de Cobertura:** ${{life_insurance_amount}} por Propietario
- **Pago de Prima:** {{premium_payment_responsibility}}
{{/if}}

### 6.4 Seguro de Discapacidad
{{#if disability_insurance}}
Arreglos de seguro de discapacidad:
- **Monto de Cobertura:** ${{disability_insurance_amount}}
- **Período de Beneficio:** {{disability_benefit_period}}
- **Período de Eliminación:** {{disability_elimination_period}}
{{/if}}

---

## 7. No Competencia y Confidencialidad

### 7.1 Disposiciones de No Competencia
Por {{non_compete_period}} años después de una transacción de venta, el Propietario vendedor acuerda no:
- Competir directamente con el negocio de la Empresa
- Solicitar clientes o empleados de la Empresa
- Usar información confidencial para propósitos competitivos
- {{additional_non_compete_restrictions}}

### 7.2 Alcance Geográfico
Las restricciones de no competencia se aplican dentro de: {{geographic_scope}}

### 7.3 Confidencialidad
Las obligaciones continuas de confidencialidad incluyen:
- Protección de secretos comerciales e información propietaria
- No divulgación de listas de clientes y precios
- Protección de estrategias y planes comerciales

---

## 8. Empleo y Administración

### 8.1 Terminación de Empleo
Al vender la participación de propiedad:
- **Estado de Empleo:** {{employment_status_after_sale}}
- **Beneficios de Indemnización:** {{severance_benefits}}
- **Período de Transición:** {{transition_period}}

### 8.2 Derechos de Administración
Los Propietarios que se retiran deberán:
- Renunciar a todas las posiciones de administración
- Transferir toda propiedad y registros de la empresa
- Cooperar en actividades de transición

---

## 9. Resolución de Disputas

### 9.1 Disputas de Valoración
Las disputas sobre valoración se resolverán por:
{{#if valuation_arbitration}}
- Arbitraje vinculante con tasador comercial calificado
- Panel de tres tasadores si los valores difieren en más del {{valuation_variance_threshold}}%
{{else}}
- Mediación seguida de arbitraje si es necesario
{{/if}}

### 9.2 Disputas Generales
Otras disputas se resolverán a través de:
1. Negociación de buena fe
2. Mediación con mediador calificado
3. {{#if binding_arbitration}}Arbitraje vinculante{{else}}Procedimientos judiciales en {{jurisdiction}}{{/if}}

---

## 10. Modificación y Terminación

### 10.1 Modificación del Acuerdo
Este Acuerdo puede modificarse solo con el consentimiento escrito del {{amendment_threshold}}% de los Propietarios.

### 10.2 Terminación del Acuerdo
Este Acuerdo terminará al:
- Acuerdo escrito de todos los Propietarios
- Venta de la Empresa a terceros
- Disolución de la Empresa
- {{termination_conditions}}

### 10.3 Disposiciones de Supervivencia
Las siguientes disposiciones sobrevivirán la terminación:
- Obligaciones de confidencialidad
- Restricciones de no competencia
- Procedimientos de resolución de disputas

---

## 11. Disposiciones Generales

### 11.1 Ley Aplicable
Este Acuerdo se regirá por las leyes de {{governing_state}}.

### 11.2 Efecto Vinculante
Este Acuerdo vincula a herederos, ejecutores, administradores y cesionarios de todos los Propietarios.

### 11.3 Consideraciones Fiscales
Cada Propietario debe consultar con asesores fiscales sobre las implicaciones fiscales de este Acuerdo.

### 11.4 Acuerdo Completo
Este Acuerdo reemplaza todos los acuerdos previos relacionados con arreglos de compra-venta.

### 11.5 Separabilidad
Las disposiciones inválidas no afectarán la validez de las disposiciones restantes.

---

## 12. Firmas

**EN FE DE LO CUAL**, los Propietarios han ejecutado este Acuerdo en la fecha arriba escrita.

{{#each owners}}
**{{name}}:**

| Firma | Fecha |
|-------|-------|
| _________________________________ | _____________ |
| {{name}} | |
| {{title}} | |

{{/each}}

---

**AVISO LEGAL IMPORTANTE:** Este acuerdo de compra-venta debe ser revisado por asesores legales y fiscales para asegurar el cumplimiento con las leyes aplicables y el tratamiento fiscal óptimo. Los términos deben adaptarse a la estructura comercial específica y los arreglos de propiedad.

*Plantilla generada por 123LegalDoc - Plataforma Profesional de Documentos Legales*