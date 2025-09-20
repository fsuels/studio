# Contrato de Compraventa de Vehiculo (Estados Unidos)

**Fecha de venta:** {{sale_date}}
**Estado que rige:** {{state}}

---

## 1. Partes

### 1.1 Vendedor (Cedente)
**Nombre:** {{seller_name}}
**Direccion postal:** {{seller_address}}
{{#if seller_phone}}**Telefono:** {{seller_phone}}
{{/if}}{{#if seller2_name}}**Vendedor adicional:** {{seller2_name}}{{#if seller2_phone}} (Telefono: {{seller2_phone}}){{/if}}
{{/if}}

### 1.2 Comprador (Cesionario)
**Nombre:** {{buyer_name}}
**Direccion postal:** {{buyer_address}}
{{#if buyer_phone}}**Telefono:** {{buyer_phone}}
{{/if}}{{#if buyer2_name}}**Comprador adicional:** {{buyer2_name}}{{#if buyer2_phone}} (Telefono: {{buyer2_phone}}){{/if}}
{{/if}}

---

## 2. Identificacion del vehiculo

| Elemento | Detalle |
| -------- | ------- |
| Ano | {{year}} |
| Marca | {{make}} |
| Modelo | {{model}} |
| Tipo de carroceria | {{body_type}} |
| Color | {{color}} |
| Numero de identificacion vehicular (VIN) | {{vin}} |

---

## 3. Terminos de compraventa

- **Precio total de venta:** ${{price}} USD
- **Metodo de pago:** {{payment_method}}
- **Fecha de transferencia:** {{sale_date}}
- El Vendedor transfiere todo derecho, titulo e interes sobre el vehiculo al Comprador una vez recibido el precio total.

{{#if existing_liens}}
**Divulgacion de gravamenes:** {{existing_liens}}
{{else}}
El Vendedor declara que entrega el vehiculo libre de gravamenes y cargas.
{{/if}}

---

## 4. Declaracion de odometro

**Lectura del odometro:** {{odometer}} millas
**Estado del odometro:** {{odo_status}} (ACTUAL = millaje exacto, EXCEEDS = excede el limite mecanico, NOT_ACTUAL = advertencia de discrepancia).
El Vendedor certifica que la lectura del odometro refleja el estado del vehiculo segun su leal saber y entender bajo las leyes federales y estatales.

---

## 5. Condicion y garantia

{{#if as_is}}
El Comprador acepta el vehiculo **EN EL ESTADO EN QUE SE ENCUENTRA**, sin garantias expresas ni implicitas. El Comprador tuvo oportunidad de inspeccionar el vehiculo y asume todos los riesgos de propiedad despues de la transferencia.
{{else}}
El Vendedor otorga la siguiente garantia limitada:
{{warranty_text}}
{{/if}}

---

## 6. Entrega y reconocimientos

- El Vendedor entrega al Comprador el vehiculo, las llaves y la documentacion relacionada.
- El Comprador reconoce la recepcion del vehiculo en su estado actual y asume la responsabilidad de inscripcion y tributos.
- Ambas partes se comprometen a firmar la documentacion adicional que exija {{state}} o el Departamento de Vehiculos Motorizados correspondiente.

---

## 7. Notario (si corresponde)

Estado de {{state}}
{{#if county}}Condado de {{county}}{{/if}}

El {{sale_date}} comparecieron ante mi, Notario Publico, {{seller_name}} y {{buyer_name}}, quienes reconocieron haber firmado este Contrato de Compraventa de Vehiculo para los fines aqui establecidos.

**Notario Publico:** ________________________________
Mi nombramiento vence el: ____________________________

---

## 8. Firmas

Las partes firman a continuacion para aceptar los terminos de este Contrato de Compraventa de Vehiculo.

| Vendedor | Firma | Fecha |
| -------- | ----- | ----- |
| {{seller_name}} | ________________________________ | {{sale_date}} |

{{#if seller2_name}}
| {{seller2_name}} | ________________________________ | {{sale_date}} |
{{/if}}

| Comprador | Firma | Fecha |
| --------- | ----- | ----- |
| {{buyer_name}} | ________________________________ | {{sale_date}} |

{{#if buyer2_name}}
| {{buyer2_name}} | ________________________________ | {{sale_date}} |
{{/if}}

---

**Recordatorio:** Conserve una copia de este documento y complete los tramites obligatorios ante la autoridad de vehiculos motorizados sin demora.

---

Plantilla generada por 123LegalDoc. Este contenido no constituye asesoramiento legal. Terminos: 123LegalDoc.com/terms

