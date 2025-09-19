from pathlib import Path
import re

summaries = {
    'docs/legal/disclaimer.md': "**Spanish Summary (Resumen en Español)**  \r\n123LegalDoc no es un bufete de abogados y la información que proporcionamos no constituye asesoría legal. No se forma una relación abogado-cliente al usar nuestros servicios. Las leyes varían según el estado; consulte a un abogado con licencia en su jurisdicción antes de utilizar cualquier documento generado.\r\n",
    'docs/legal/terms-of-service.md': "**Spanish Summary (Resumen en Español)**  \r\nAl usar 123LegalDoc, usted acepta estos Términos. 123LegalDoc no es un bufete de abogados y el servicio se proporciona \"tal cual\". Consulte el Aviso de Privacidad y la Política de Reembolsos para conocer cómo manejamos sus datos y cuándo están disponibles los reembolsos.\r\n",
    'docs/legal/privacy-notice.md': "**Spanish Summary (Resumen en Español)**  \r\nRecopilamos información personal para ofrecer y mejorar nuestros servicios. Puede solicitar acceso, corrección o eliminación de sus datos, u optar por no compartirlos con fines publicitarios, escribiendo a privacy@123legaldoc.com.\r\n\r\n",
    'docs/legal/refund-policy.md': "**Spanish Summary (Resumen en Español)**  \r\nOfrecemos un reembolso completo dentro de los 30 días para compras iniciales si no ha descargado más de dos documentos y el producto no cumplió con sus expectativas. Envíe un correo electrónico a billing@123legaldoc.com con su número de pedido.\r\n",
}

pattern = re.compile(r"\*\*Spanish Summary[\s\S]*$", re.DOTALL)

for rel_path, replacement in summaries.items():
    path = Path(rel_path)
    text = path.read_text(encoding='utf8')
    if '**Spanish Summary' not in text:
        raise SystemExit(f"Summary header missing in {rel_path}")
    new_text = pattern.sub(replacement, text)
    path.write_text(new_text, encoding='utf8')

refund_path = Path('docs/legal/refund-policy.md')
refund_text = refund_path.read_text(encoding='utf8').replace('5?10', '5–10')
refund_path.write_text(refund_text, encoding='utf8')

terms_path = Path('docs/legal/terms-of-service.md')
terms_text = terms_path.read_text(encoding='utf8').replace('Legal Operations ? Terms Questions', 'Legal Operations – Terms Questions')
terms_path.write_text(terms_text, encoding='utf8')
