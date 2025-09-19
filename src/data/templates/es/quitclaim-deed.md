# Escritura de Cesion de Derechos (Quitclaim Deed)

**ID del Documento:** `quitclaim-deed`

---

Esta escritura se firma el **{{transferDate}}**.

- **Otorgante (Grantor):** {{grantorName}}, estado civil {{grantorMaritalStatus}}
- **Cesionario (Grantee):** {{granteeName}}, estado civil {{granteeMaritalStatus}}

El Otorgante cede y transfiere, sin garantia, todo derecho, titulo e interes sobre la propiedad descrita a continuacion al Cesionario.

---

## 1. Descripcion de la Propiedad

- **Direccion:** {{propertyStreetAddress}}
- **Ciudad:** {{propertyCity}}, Estado: {{propertyState}}, Condado: {{propertyCounty}}
- **Descripcion Legal:** {{propertyLegalDescription}}
{{#if parcelNumber}}
- **Numero de Parcela o ID Fiscal:** {{parcelNumber}}
{{/if}}

{{#if liensOrEncumbrances}}
Se revelan los siguientes gravamenes o cargas vigentes: {{liensOrEncumbrances}}.
{{else}}
El Otorgante declara que no existen gravamenes adicionales aparte de los registrados publicamente.
{{/if}}

## 2. Contraprestacion y Motivo de la Cesion

El Otorgante recibe y reconoce la suma de **${{considerationAmount}}** como contraprestacion.

- **Motivo de la Cesion:** {{conveyanceType}}

## 3. Registro y Comunicaciones Posteriores

Despues del registro, devuelva la escritura a:

- Nombre: {{afterRecordingName}}
- Direccion: {{afterRecordingAddress}}

{{#if taxStatementRecipient}}
Las declaraciones de impuestos sobre la propiedad deberan enviarse a: {{taxStatementRecipient}}.
{{/if}}

{{#if notaryCounty}}
La notarizacion se realizara en el Condado de {{notaryCounty}}.
{{/if}}

{{#if witnessesRequired}}
El registro exige testigos; se incluyen lineas de firma para ellos.
{{/if}}

## 4. Disposiciones Adicionales

{{#if specialInstructions}}
Instrucciones especiales: {{specialInstructions}}
{{else}}
No se incluyen disposiciones adicionales fuera de la cesion quitclaim estandar.
{{/if}}

---

## Firmas

**OTORGANTE**

Firma: ________________________________  Fecha: _____________

Nombre: {{grantorName}}

**CESIONARIO**

Firma: ________________________________  Fecha: _____________

Nombre: {{granteeName}}

{{#if witnessesRequired}}
**TESTIGO 1**

Firma: ________________________________  Fecha: _____________

Nombre: ________________________________

**TESTIGO 2**

Firma: ________________________________  Fecha: _____________

Nombre: ________________________________
{{/if}}

---

## Reconocimiento Notarial

Estado de {{propertyState}}

Condado de {{propertyCounty}}

En esta fecha ___ de ____________, ante mi comparecio {{grantorName}}, a quien conozco o identifique, y reconocio que firmo esta escritura de cesion libremente y por voluntad propia.

Notario Publico: ____________________________

Mi comision vence: ____________________

---

*Documento generado por 123LegalDoc; los datos reemplazan los marcadores mostrados.*
