export interface FaqItem {
  questionEn: string;
  answerEn: string;
  questionEs: string;
  answerEs: string;
}

export const vehicleBillOfSaleFaqs: FaqItem[] = [
  {
    questionEn: 'What is a vehicle bill of sale?',
    answerEn:
      'It is a legal document that records the sale and transfer of a vehicle from seller to buyer.',
    questionEs: '¿Qué es un contrato de compraventa de vehículo?',
    answerEs:
      'Es un documento legal que registra la venta y transferencia de un vehículo del vendedor al comprador.',
  },
  {
    questionEn: 'What does “as-is” mean?',
    answerEn:
      'The buyer accepts the vehicle in its current condition without warranties.',
    questionEs: '¿Qué significa "tal como está"?',
    answerEs:
      'El comprador acepta el vehículo en su estado actual sin garantías.',
  },
  {
    questionEn: 'Why use one even when gifting?',
    answerEn:
      'It documents the transfer for tax and title purposes even if no money is exchanged.',
    questionEs: '¿Por qué usarlo incluso al regalar?',
    answerEs:
      'Documenta la transferencia para propósitos fiscales y de titularidad aunque no se pague dinero.',
  },
  {
    questionEn: 'What’s legally required in my state?',
    answerEn:
      'Requirements vary, but most states need buyer, seller, vehicle details, and price.',
    questionEs: '¿Qué se requiere legalmente en mi estado?',
    answerEs:
      'Los requisitos varían, pero la mayoría de los estados necesitan datos del comprador, vendedor, vehículo y precio.',
  },
  {
    questionEn: 'Can I sell without the title?',
    answerEn:
      'Generally no; most states require a title to transfer ownership.',
    questionEs: '¿Puedo vender sin el título?',
    answerEs:
      'Generalmente no; la mayoría de los estados requieren el título para transferir la propiedad.',
  },
  {
    questionEn: 'Does it need to be notarized?',
    answerEn:
      'Some states require notarization. Our tool will alert you if yours does.',
    questionEs: '¿Se necesita notarizar?',
    answerEs:
      'Algunos estados lo requieren. Nuestra herramienta te avisará si es necesario.',
  },
  {
    questionEn: 'What documents are required?',
    answerEn: 'Typically the title, bill of sale, and sometimes a valid ID.',
    questionEs: '¿Qué documentos se requieren?',
    answerEs:
      'Normalmente el título, el contrato de compraventa y a veces una identificación válida.',
  },
  {
    questionEn: 'Who signs it? Seller, buyer, both?',
    answerEn:
      'Both parties usually sign, and notarization may be needed depending on state.',
    questionEs: '¿Quién lo firma? ¿Vendedor, comprador, ambos?',
    answerEs:
      'Normalmente lo firman ambas partes, y puede requerir notarización dependiendo del estado.',
  },
];
