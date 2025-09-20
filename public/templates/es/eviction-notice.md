# Aviso de Desalojo

---

**AVISO PARA DESOCUPAR Y ENTREGAR LA POSESIÓN DEL INMUEBLE**

**PARA:** {{tenant_names}} y cualquier otro ocupante del inmueble descrito a continuación:

**DIRECCIÓN DEL INMUEBLE:** {{property_address}}  
**CIUDAD:** {{city}}, **ESTADO:** {{state}}, **CÓDIGO POSTAL:** {{zip_code}}

---

## 1. Información del Aviso

**Fecha del Aviso:** {{notice_date}}  
**Propietario/Arrendador:** {{landlord_name}}  
**Domicilio del Arrendador:** {{landlord_address}}  
**Administrador de la Propiedad:** {{#if property_manager}}{{property_manager_name}}{{else}}N/A{{/if}}

**Tipo de Aviso:** {{notice_type}}

- [ ] Pagar la renta o desocupar
- [ ] Corregir la infracción o desocupar
- [ ] Desocupar sin condición
- [ ] Aviso de terminación de la tenencia

---

## 2. Motivo del Aviso

{{#if pay_rent_or_quit}}

### AVISO PARA PAGAR LA RENTA O DESOCUPAR

Por medio del presente se le notifica que usted se encuentra en incumplimiento del pago de la renta correspondiente al inmueble descrito. El periodo y los montos adeudados son los siguientes:

**Periodo de renta:** {{rental_period_start}} a {{rental_period_end}}  
**Renta mensual:** ${{monthly_rent}}  
**Monto adeudado:** ${{amount_due}}  
**Recargos por mora:** ${{late_fees}}  
**Otros cargos:** ${{other_charges}}  
**TOTAL ADEUDADO:** ${{total_amount_due}}

Deberá pagar el total adeudado dentro de los **{{pay_or_quit_days}}** días siguientes a la entrega de este aviso o entregar la posesión del inmueble al arrendador.
{{/if}}

{{#if cure_or_quit}}

### AVISO PARA CORREGIR LA INFRACCIÓN O DESOCUPAR

Se le notifica que ha incumplido los términos de su contrato de arrendamiento de la siguiente manera:

**Incumplimientos del contrato:**
{{lease_violations}}

Deberá subsanar las infracciones señaladas dentro de los **{{cure_period_days}}** días siguientes a la entrega de este aviso o entregar la posesión del inmueble al arrendador.
{{/if}}

{{#if unconditional_quit}}

### AVISO DE DESALOJO SIN CONDICIÓN

Se le requiere que desocupe y entregue la posesión del inmueble descrito al arrendador dentro de los **{{quit_days}}** días siguientes a la entrega de este aviso.

**Motivo del aviso sin condición:**
{{unconditional_reason}}
{{/if}}

{{#if end_tenancy}}

### AVISO DE TERMINACIÓN DE TENENCIA

Se le notifica que su tenencia del inmueble descrito terminará el **{{termination_date}}**. Deberá desocupar y entregar la posesión del inmueble al arrendador a más tardar en esa fecha.

**Motivo de la terminación:**
{{termination_reason}}
{{/if}}

---

## 3. Cantidad Adeudada y Detalles de Pago

{{#if pay_rent_or_quit}}
**Monto total adeudado:** ${{total_amount_due}}  
**Forma de pago aceptada:** {{payment_instructions}}  
**Lugar de pago:** {{payment_location}}
{{else}}
No se requiere pago adicional para este aviso salvo que se indique lo contrario en la sección correspondiente.
{{/if}}

---

## 4. Instrucciones para la Entrega de la Posesión

1. Devuelva todas las llaves, tarjetas de acceso y controles de estacionamiento a {{return_location}}.  
2. Retire todas sus pertenencias del inmueble antes de la fecha límite indicada.  
3. Limpie el inmueble y repare daños ocasionados más allá del desgaste normal.  
4. Coordine una inspección final con {{inspection_contact}} llamando al {{inspection_phone}} o escribiendo a {{inspection_email}}.

---

## 5. Derechos del Arrendador en Caso de Incumplimiento

Si no paga el monto adeudado o no desocupa el inmueble en el plazo señalado, el arrendador podrá iniciar acciones legales, incluyendo:

- Presentar una demanda de desalojo (acción de posesión) ante el tribunal correspondiente.
- Solicitar el cobro de rentas atrasadas, daños, costas judiciales y honorarios legales permitidos.
- Reportar el incumplimiento a agencias de crédito o autoridades de vivienda según lo permita la ley.

---

## 6. Información Adicional Requerida por la Ley

{{#if legal_requirements}}
{{legal_requirements}}
{{else}}
En esta jurisdicción no se requieren avisos adicionales más allá de los contenidos en el presente documento.
{{/if}}

---

## 7. Declaración del Arrendador o Representante

Yo, {{landlord_or_agent_name}}, certifico que este aviso se entrega conforme a las leyes aplicables y a las cláusulas del contrato de arrendamiento vigente.

**Firma:** _______________________________  
**Fecha:** {{notice_date}}  
**Cargo:** {{landlord_or_agent_title}}

---

## 8. Prueba de Entrega

Yo, {{server_name}}, declaro bajo pena de perjurio que entregué este aviso el **{{service_date}}** de la siguiente manera:

- [ ] Entrega personal al arrendatario
- [ ] Entrega a un adulto residente en el inmueble
- [ ] Servicio por correo certificado
- [ ] Publicación y envío por correo (donde esté permitido)

**Dirección donde se entregó o envió el aviso:** {{service_address}}

**Firma de quien entrega el aviso:** _______________________________  
**Fecha de la entrega:** {{service_date}}

---

## 9. Información de Contacto del Arrendador

**Nombre:** {{landlord_contact_name}}  
**Teléfono:** {{landlord_contact_phone}}  
**Correo electrónico:** {{landlord_contact_email}}  
**Horario de oficina:** {{office_hours}}

---

**AVISO LEGAL IMPORTANTE:** Este aviso de desalojo se emite conforme a la legislación estatal y local aplicable. El incumplimiento de los plazos señalados puede resultar en acciones judiciales y costos adicionales. Si tiene preguntas, consulte con un abogado o con los servicios de asesoría legal disponibles en su comunidad.

## _Aviso generado por 123LegalDoc - Plataforma Profesional de Documentos Legales_

(c) 2025 123LegalDoc · Documento de autoayuda · No constituye asesoría legal · Términos: 123LegalDoc.com/terms
