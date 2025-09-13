import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { BillOfSaleData } from '@/lib/documents/us/vehicle-bill-of-sale/schema';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';

export async function generateVehicleBillOfSalePDF(data: BillOfSaleData): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add a page
  const page = pdfDoc.addPage([612, 792]); // Standard letter size
  const { width, height } = page.getSize();

  // Get compliance info
  const compliance = getVehicleBillOfSaleCompliance(data.state);

  // Helper function to draw text
  const drawText = (text: string, x: number, y: number, options?: { font?: any; size?: number; color?: any }) => {
    page.drawText(text, {
      x,
      y,
      size: options?.size || 12,
      font: options?.font || font,
      color: options?.color || rgb(0, 0, 0),
    });
  };

  // Title
  drawText('VEHICLE BILL OF SALE', width / 2 - 120, height - 60, { font: boldFont, size: 18 });

  // State compliance notice
  if (compliance?.requiresNotary) {
    drawText('⚠️ NOTARIZATION REQUIRED IN ' + data.state.toUpperCase(), width / 2 - 100, height - 85, {
      font: boldFont,
      size: 10,
      color: rgb(0.8, 0, 0)
    });
  }

  let currentY = height - 120;
  const lineHeight = 20;
  const sectionSpacing = 30;

  // Seller Information
  drawText('SELLER INFORMATION', 50, currentY, { font: boldFont, size: 14 });
  currentY -= lineHeight;
  drawText(`Name: ${data.seller_name}`, 50, currentY);
  currentY -= lineHeight;
  drawText(`Address: ${data.seller_address}`, 50, currentY);
  if (data.seller_phone) {
    currentY -= lineHeight;
    drawText(`Phone: ${data.seller_phone}`, 50, currentY);
  }

  // Second seller if exists
  if (data.seller2_name) {
    currentY -= lineHeight;
    drawText(`Second Seller: ${data.seller2_name}`, 50, currentY);
    if (data.seller2_phone) {
      currentY -= lineHeight;
      drawText(`Phone: ${data.seller2_phone}`, 50, currentY);
    }
  }

  currentY -= sectionSpacing;

  // Buyer Information
  drawText('BUYER INFORMATION', 50, currentY, { font: boldFont, size: 14 });
  currentY -= lineHeight;
  drawText(`Name: ${data.buyer_name}`, 50, currentY);
  currentY -= lineHeight;
  drawText(`Address: ${data.buyer_address}`, 50, currentY);
  if (data.buyer_phone) {
    currentY -= lineHeight;
    drawText(`Phone: ${data.buyer_phone}`, 50, currentY);
  }

  // Second buyer if exists
  if (data.buyer2_name) {
    currentY -= lineHeight;
    drawText(`Second Buyer: ${data.buyer2_name}`, 50, currentY);
    if (data.buyer2_phone) {
      currentY -= lineHeight;
      drawText(`Phone: ${data.buyer2_phone}`, 50, currentY);
    }
  }

  currentY -= sectionSpacing;

  // Vehicle Information
  drawText('VEHICLE INFORMATION', 50, currentY, { font: boldFont, size: 14 });
  currentY -= lineHeight;
  drawText(`Year: ${data.year}`, 50, currentY);
  drawText(`Make: ${data.make || 'N/A'}`, 200, currentY);
  drawText(`Model: ${data.model || 'N/A'}`, 350, currentY);
  currentY -= lineHeight;
  drawText(`Color: ${data.color || 'N/A'}`, 50, currentY);
  drawText(`Body Type: ${data.body_type || 'N/A'}`, 200, currentY);
  currentY -= lineHeight;
  drawText(`VIN: ${data.vin}`, 50, currentY);
  currentY -= lineHeight;
  drawText(`Odometer: ${data.odometer.toLocaleString()} miles (${data.odo_status})`, 50, currentY);

  currentY -= sectionSpacing;

  // Sale Information
  drawText('SALE INFORMATION', 50, currentY, { font: boldFont, size: 14 });
  currentY -= lineHeight;
  drawText(`Sale Price: $${data.price.toLocaleString()}`, 50, currentY);
  if (data.payment_method) {
    drawText(`Payment Method: ${data.payment_method}`, 200, currentY);
  }
  currentY -= lineHeight;
  drawText(`Sale Date: ${data.sale_date.toLocaleDateString()}`, 50, currentY);
  currentY -= lineHeight;
  drawText(`Sold As-Is: ${data.as_is ? 'YES' : 'NO'}`, 50, currentY);

  if (!data.as_is && data.warranty_text) {
    currentY -= lineHeight;
    drawText(`Warranty: ${data.warranty_text}`, 50, currentY);
  }

  if (data.existing_liens) {
    currentY -= lineHeight;
    drawText(`Existing Liens: ${data.existing_liens}`, 50, currentY);
  }

  if (data.title_number) {
    currentY -= lineHeight;
    drawText(`Title Number: ${data.title_number}`, 50, currentY);
  }

  currentY -= sectionSpacing;

  // Legal Statement
  drawText('LEGAL STATEMENT', 50, currentY, { font: boldFont, size: 14 });
  currentY -= lineHeight;
  const legalText = `I/We, the seller(s), certify that I/we am/are the legal owner(s) of the above vehicle and have the right to sell it. The vehicle is sold in its present condition. The buyer acknowledges receiving the vehicle in the condition described above.`;

  // Word wrap for legal text
  const maxWidth = width - 100;
  const words = legalText.split(' ');
  let line = '';

  for (const word of words) {
    const testLine = line + word + ' ';
    const textWidth = font.widthOfTextAtSize(testLine, 11);

    if (textWidth > maxWidth && line !== '') {
      drawText(line.trim(), 50, currentY, { size: 11 });
      currentY -= 15;
      line = word + ' ';
    } else {
      line = testLine;
    }
  }

  if (line.trim() !== '') {
    drawText(line.trim(), 50, currentY, { size: 11 });
  }

  currentY -= sectionSpacing;

  // Signature lines
  drawText('SIGNATURES', 50, currentY, { font: boldFont, size: 14 });
  currentY -= 30;

  // Seller signature
  page.drawLine({
    start: { x: 50, y: currentY },
    end: { x: 250, y: currentY },
    thickness: 1,
  });
  drawText('Seller Signature', 50, currentY - 15, { size: 10 });
  drawText('Date: ___________', 260, currentY - 5, { size: 10 });

  // Second seller signature if exists
  if (data.seller2_name) {
    currentY -= 30;
    page.drawLine({
      start: { x: 50, y: currentY },
      end: { x: 250, y: currentY },
      thickness: 1,
    });
    drawText('Second Seller Signature', 50, currentY - 15, { size: 10 });
    drawText('Date: ___________', 260, currentY - 5, { size: 10 });
  }

  currentY -= 40;

  // Buyer signature
  page.drawLine({
    start: { x: 50, y: currentY },
    end: { x: 250, y: currentY },
    thickness: 1,
  });
  drawText('Buyer Signature', 50, currentY - 15, { size: 10 });
  drawText('Date: ___________', 260, currentY - 5, { size: 10 });

  // Second buyer signature if exists
  if (data.buyer2_name) {
    currentY -= 30;
    page.drawLine({
      start: { x: 50, y: currentY },
      end: { x: 250, y: currentY },
      thickness: 1,
    });
    drawText('Second Buyer Signature', 50, currentY - 15, { size: 10 });
    drawText('Date: ___________', 260, currentY - 5, { size: 10 });
  }

  // Notary section if required
  if (compliance?.requiresNotary) {
    currentY -= 50;
    drawText('NOTARY ACKNOWLEDGMENT', 50, currentY, { font: boldFont, size: 12, color: rgb(0.8, 0, 0) });
    currentY -= 20;
    drawText('This document must be notarized in the state of ' + data.state.toUpperCase(), 50, currentY, { size: 10 });

    currentY -= 40;
    page.drawLine({
      start: { x: 50, y: currentY },
      end: { x: 300, y: currentY },
      thickness: 1,
    });
    drawText('Notary Public Signature', 50, currentY - 15, { size: 10 });

    currentY -= 30;
    drawText('Notary Seal:', 50, currentY, { size: 10 });
    page.drawRectangle({
      x: 150,
      y: currentY - 30,
      width: 80,
      height: 40,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }

  // Footer
  const footerY = 50;
  drawText(`Generated by 123LegalDoc.com - ${new Date().toLocaleDateString()}`, 50, footerY, { size: 8, color: rgb(0.5, 0.5, 0.5) });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  // Convert to blob and create URL
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}