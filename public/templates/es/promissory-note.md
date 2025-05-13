# PAGARÉ (Garantizado / No Garantizado)

**Fecha:** {{date}}  
**Lugar:** {{city}}, {{county}}, {{state}}

---

## Definiciones  
- **"Deudor"**: {{borrower_name}}, de {{borrower_address}}.  
- **"Prestamista"**: {{lender_name}}, de {{lender_address}}.  
- **"Garantía"**: (si es garantizado) {{collateral_description}}.  
- **"Pagaré"**: este Pagaré.  
- **"Estatuto Estatal"**: disposición de tasa de interés máxima permitida según las leyes de {{state}} (por ejemplo, {{usury_statute_citation}}).

---

## 1. Requisito de Escrituración y Promesa de Pago  
1. **Escritura**: Este Pagaré cumple con cualquier requisito legal de que el contrato conste por escrito para préstamos superiores a un año.  
2. **Promesa**: Por valor recibido, el Deudor promete incondicionalmente pagar al Prestamista la suma principal de **\${{principal_amount}}**, más intereses, conforme a lo establecido en este Pagaré.

---

## 2. Tasa de Interés  
1. **Tasa**: El saldo principal pendiente devengará intereses a una tasa anual de **{{interest_rate}}%**, sujeta al límite legal máximo del Estatuto Estatal. Si la tasa excede dicho límite, se reducirá automáticamente.  
2. **Cómputo**: Los intereses se calcularán sobre la base de un año de **{{day_count_basis}} días**, considerando los días efectivamente transcurridos; si no está permitido, se calcularán según el máximo legal permitido.

---

## 3. Condiciones de Pago  
1. **Esencialidad del Tiempo**: Los plazos son esenciales.  
2. **Calendario de Pagos (seleccionar uno):**  
   - **Pagos Parciales**: {{installment_count}} pagos iguales de **\${{installment_amount}}**, venciendo el día {{installment_day}} de cada mes, comenzando el **{{start_date}}**, con el último vencimiento el **{{maturity_date}}**.  
   - **Pago Único**: Todo el capital e intereses devengados vencen el **{{maturity_date}}**.  
3. **Cargo por Mora (opcional)**: Se podrá cobrar **\${{late_fee_amount}}** o el **{{late_fee_percent}}%** del monto vencido si el pago se retrasa más de **{{late_fee_days}}** días, según lo permita la ley.  
4. **Pago Anticipado**: Permitido en cualquier momento sin penalización. Se aplica primero a intereses, luego a capital.

---

## 4. Incumplimiento, Notificación y Recursos  
1. **Eventos de Incumplimiento**:  
   - Pago no realizado dentro de **{{grace_period}}** días después de su vencimiento.  
   - Insolvencia, quiebra o cesión de bienes por parte del Deudor.  
   - Incumplimiento sustancial no subsanado dentro de **{{cure_period}}** días tras notificación.  
2. **Notificación y Subsanación**: El Prestamista deberá notificar por escrito; el Deudor tendrá **{{cure_period}}** días desde la recepción para subsanar.  
3. **Aceleración**: El Prestamista podrá declarar vencido el total del monto adeudado.  
4. **Recursos Cumulativos**: Los recursos legales son acumulativos, no exclusivos.  
5. **Honorarios Legales**: El Deudor deberá cubrir los honorarios legales y costos razonables de cobranza.

---

## 5. Garantía (Solo si es Garantizado)  
> **Si se seleccionó "Garantizado", completar esta sección; de lo contrario, omitir.**  
1. **Constitución de Garantía**: El Deudor otorga garantía sobre los bienes descritos.  
2. **Perfeccionamiento**: El Prestamista puede registrar UCC-1 en {{state}} o tomar otras acciones legales para perfeccionar la garantía.  
3. **Declaraciones del Deudor**: Garantiza tener título libre de gravámenes sobre la Garantía y autoridad para constituirla.

---

## 6. Renuncias  
El Deudor renuncia a presentación, demanda, protesto, notificación de impago y cualquier otro aviso no obligatorio por ley.

---

## 7. Ley Aplicable, Jurisdicción y Notificación  
1. **Ley Aplicable**: Este Pagaré se rige por las leyes de {{state}}.  
2. **Jurisdicción**: Las partes se someten a los tribunales estatales y federales en {{county}}, {{state}}.  
3. **Notificación Judicial**: Vía correo certificado o agente registrado en {{state}}.

---

## 8. Cesión  
1. **Cesión por el Prestamista**: Permitida, previa notificación al Deudor dentro de **{{assignment_notice_days}}** días.  
2. **Cesión por el Deudor**: No permitida sin consentimiento escrito del Prestamista.

---

## 9. Notificaciones  
Las notificaciones deberán ser escritas y se considerarán recibidas:  
- Personalmente entregadas;  
- 3 días tras envío por correo certificado;  
- 1 día tras envío por mensajería; o  
- Tras confirmación por correo electrónico.

---

## 10. Integración y Modificación  
Este documento constituye el acuerdo total. Las modificaciones deben constar por escrito y firmadas por ambas partes.

---

## 11. Divisibilidad  
Si alguna cláusula es inválida, se reformará en lo posible y el resto seguirá vigente.

---

## 12. Firma Electrónica  
Este Pagaré puede firmarse electrónicamente conforme a la Ley E-Sign y UETA aplicables.

---

## 13. Arbitraje (Opcional)  
> **Si se desea arbitraje, reemplace esta sección por una cláusula específica.**

---

## 14. Notariado y Testigos  
Este Pagaré es válido sin notariado, salvo disposición legal contraria. Para mayor valor probatorio, puede ser notariado y firmado ante testigos:

> **Reconocimiento Notarial**  
> Estado de __________ )  
> Condado de _________ )  
> En esta fecha ___ de __________ de 20___, ante mí, __________________ (Notario Público), compareció __________________, acreditó su identidad y firmó este Pagaré.

---

**EN FE DE LO CUAL**, las partes firman este Pagaré en la fecha indicada.

| **PRESTAMISTA**                            | **DEUDOR**                                 |
|-------------------------------------------|--------------------------------------------|
| Firma: _________________________________ | Firma: ___________________________________ |
| Nombre: {{lender_name}}                   | Nombre: {{borrower_name}}                  |
| Título (si aplica): {{lender_title}}      |                                            |
| Fecha: __________                         | Fecha: __________                          |