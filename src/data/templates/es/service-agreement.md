# Acuerdo de Servicios

**ID del Documento:** `service-agreement`

---

Este Acuerdo de Servicios ("Acuerdo") se celebra con fecha **{{startDate}}** entre las siguientes partes:

- **Proveedor de Servicios:** {{providerName}}, un(a) {{providerBusinessStructure}} con domicilio postal {{providerAddress}} ("Proveedor")
- **Cliente:** {{clientName}}, un(a) {{clientBusinessStructure}} con domicilio postal {{clientAddress}} ("Cliente")

El Proveedor y el Cliente pueden denominarse individualmente como la "Parte" y conjuntamente como las "Partes".

---

## 1. Servicios y Alcance

El Proveedor se compromete a realizar los servicios descritos a continuacion (los "Servicios"):

- **Servicios Principales:** {{serviceDescription}}
{{#if projectScope}}
- **Alcance / Hitos del Proyecto:** {{projectScope}}
{{/if}}
- **Entregables:** {{deliverables}}
{{#if acceptanceCriteria}}
- **Criterios de Aceptacion:** {{acceptanceCriteria}}
{{/if}}

{{#if supportAndMaintenance}}
El Proveedor tambien brindara el siguiente apoyo o mantenimiento continuo: {{supportAndMaintenance}}.
{{/if}}

## 2. Plazo y Cronograma

Los Servicios inician el **{{startDate}}**.
{{#if completionDate}}
Las Partes estiman finalizar en o antes del **{{completionDate}}**.
{{/if}}

## 3. Compensacion

- **Estructura de Pago:** {{paymentStructure}}
{{#if paymentAmount}}
- **Importe o Tarifa:** {{paymentAmount}}
{{/if}}
- **Calendario de Pagos:** {{paymentSchedule}}

{{#if expensesReimbursed}}
El Cliente reembolsara al Proveedor los gastos razonables conforme a la siguiente politica: {{expensePolicy}}.
{{else}}
El Cliente no reembolsara gastos incidentales del Proveedor salvo acuerdo escrito en contrario.
{{/if}}

## 4. Propiedad Intelectual y Confidencialidad

- **Titularidad de Propiedad Intelectual:** {{ipOwnership}}
{{#if confidentiality}}
Las Partes mantendran la confidencialidad de la informacion sensible o propietaria compartida durante la prestacion de los Servicios.
{{else}}
No se establecen obligaciones adicionales de confidencialidad mas alla de las impuestas por la ley.
{{/if}}

## 5. Politicas y Asignacion de Riesgos

{{#if terminationNoticeDays}}
Cualquiera de las Partes podra terminar este Acuerdo con {{terminationNoticeDays}} dias de aviso escrito.
{{/if}}

- **Resolucion de Controversias:** {{disputeResolution}}
- **Ley Aplicable:** Estado de {{governingLawState}}

## 6. Avisos

Los avisos oficiales se enviaran a los correos designados por cada Parte. El Cliente designa **{{noticesEmail}}** para la recepcion de avisos.

---

## 7. Terminos Adicionales

{{#if acceptanceCriteria}}
Los criterios de aceptacion descritos previamente controlaran la aprobacion del trabajo finalizado.
{{/if}}
{{#if expensePolicy}}
Los gastos deberan cumplir con la politica indicada en la Seccion 3.
{{/if}}
{{#if supportAndMaintenance}}
El apoyo o mantenimiento se proporcionara conforme a los compromisos descritos en la Seccion 1.
{{/if}}

---

## 8. Firmas

Al firmar a continuacion, las Partes aceptan los terminos de este Acuerdo.

**PROVEEDOR DE SERVICIOS**

Firma: ________________________________  Fecha: _____________

Nombre: {{providerName}}

**CLIENTE**

Firma: ________________________________  Fecha: _____________

Nombre: {{clientName}}

---

*Documento generado por el sistema de plantillas de 123LegalDoc. Las variables se integran utilizando los marcadores indicados.*
