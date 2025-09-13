import { NextRequest, NextResponse } from 'next/server';
// Dynamic imports for optimization
import { auditService } from '@/services/firebase-audit-service';
// PDF library will be imported dynamically
import { z } from 'zod';

const dpaRequestSchema = z.object({
  companyName: z.string().min(2),
  legalEntityName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  jobTitle: z.string().min(2),
  companyAddress: z.string().min(10),
  country: z.string().min(2),
  dataTypes: z.array(z.string()).min(1),
  processingPurpose: z.string().min(10),
  effectiveDate: z.string(),
  timestamp: z.string(),
  userAgent: z.string(),
});

const dataTypeLabels: Record<string, string> = {
  personal_identifiers: 'Personal Identifiers (name, email, phone)',
  financial_data: 'Financial Data (payment info, billing)',
  document_content: 'Document Content and Metadata',
  usage_analytics: 'Usage Analytics and Logs',
  authentication_data: 'Authentication Data',
  business_data: 'Business Information and Records',
};

async function generateDPAPDF(data: any): Promise<Buffer> {
  // Dynamically import PDF library
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  const { width, height } = page.getSize();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPosition = height - 50;
  const leftMargin = 50;
  const rightMargin = 50;
  const lineHeight = 20;

  // Helper function to add text
  const addText = (
    text: string,
    font = helveticaFont,
    fontSize = 12,
    x = leftMargin,
  ) => {
    page.drawText(text, {
      x,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;
  };

  // Helper function to add wrapped text
  const addWrappedText = (
    text: string,
    font = helveticaFont,
    fontSize = 12,
  ) => {
    const words = text.split(' ');
    let line = '';
    const maxWidth = width - leftMargin - rightMargin;

    for (const word of words) {
      const testLine = line + word + ' ';
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth && line !== '') {
        addText(line.trim(), font, fontSize);
        line = word + ' ';
      } else {
        line = testLine;
      }
    }

    if (line.trim() !== '') {
      addText(line.trim(), font, fontSize);
    }
  };

  // Title
  addText('DATA PROCESSING AGREEMENT', helveticaBoldFont, 18, leftMargin + 150);
  yPosition -= 10;

  // Header information
  addText(
    `Generated on: ${new Date().toLocaleDateString()}`,
    helveticaFont,
    10,
  );
  addText(
    `Effective Date: ${new Date(data.effectiveDate).toLocaleDateString()}`,
    helveticaFont,
    10,
  );
  yPosition -= 20;

  // Parties section
  addText('PARTIES', helveticaBoldFont, 14);
  yPosition -= 5;

  addText('Data Controller:', helveticaBoldFont, 12);
  addText(`Company: ${data.companyName}`, helveticaFont, 11);
  addText(`Legal Entity: ${data.legalEntityName}`, helveticaFont, 11);
  addText(`Contact: ${data.contactName} (${data.jobTitle})`, helveticaFont, 11);
  addText(`Email: ${data.email}`, helveticaFont, 11);
  addWrappedText(`Address: ${data.companyAddress}`, helveticaFont, 11);
  addText(`Country: ${data.country}`, helveticaFont, 11);
  yPosition -= 10;

  addText('Data Processor:', helveticaBoldFont, 12);
  addText('123LegalDoc Inc.', helveticaFont, 11);
  addText('Legal Document Automation Platform', helveticaFont, 11);
  addText('Email: compliance@123legaldoc.com', helveticaFont, 11);
  addText('Address: [123LegalDoc Business Address]', helveticaFont, 11);
  yPosition -= 20;

  // Data Processing Details
  addText('DATA PROCESSING DETAILS', helveticaBoldFont, 14);
  yPosition -= 5;

  addText('Categories of Personal Data:', helveticaBoldFont, 12);
  data.dataTypes.forEach((dataType: string) => {
    const label = dataTypeLabels[dataType] || dataType;
    addText(`• ${label}`, helveticaFont, 11);
  });
  yPosition -= 10;

  addText('Purpose of Processing:', helveticaBoldFont, 12);
  addWrappedText(data.processingPurpose, helveticaFont, 11);
  yPosition -= 10;

  // Legal framework
  addText('LEGAL FRAMEWORK', helveticaBoldFont, 14);
  yPosition -= 5;

  const legalText = `This Data Processing Agreement ("DPA") is entered into pursuant to Article 28 of the General Data Protection Regulation (EU) 2016/679 ("GDPR") and supplements the terms of service between the parties. This DPA establishes the terms under which 123LegalDoc processes personal data on behalf of the Data Controller.`;
  addWrappedText(legalText, helveticaFont, 11);
  yPosition -= 10;

  // Security measures
  addText('SECURITY MEASURES', helveticaBoldFont, 14);
  yPosition -= 5;

  const securityMeasures = [
    'AES-256 encryption for data at rest and in transit',
    'Multi-factor authentication and access controls',
    'Regular security audits and vulnerability assessments',
    'SOC 2 Type II certified security controls',
    'Incident response and breach notification procedures',
    'Data backup and disaster recovery protocols',
  ];

  securityMeasures.forEach((measure) => {
    addText(`• ${measure}`, helveticaFont, 11);
  });
  yPosition -= 10;

  // Data subject rights
  addText('DATA SUBJECT RIGHTS', helveticaBoldFont, 14);
  yPosition -= 5;

  const rightsText = `123LegalDoc will assist the Data Controller in responding to data subject requests including access, rectification, erasure, portability, and objection to processing as required under GDPR Articles 15-22.`;
  addWrappedText(rightsText, helveticaFont, 11);
  yPosition -= 10;

  // International transfers
  addText('INTERNATIONAL TRANSFERS', helveticaBoldFont, 14);
  yPosition -= 5;

  const transferText = `Any international transfers of personal data will be conducted in accordance with GDPR Chapter V, utilizing appropriate safeguards such as Standard Contractual Clauses or adequacy decisions.`;
  addWrappedText(transferText, helveticaFont, 11);
  yPosition -= 10;

  // Subprocessors
  addText('SUBPROCESSORS', helveticaBoldFont, 14);
  yPosition -= 5;

  const subprocessorText = `123LegalDoc may engage subprocessors as listed in our public subprocessor register available at https://123legaldoc.com/trust. The Data Controller will be notified of any changes to subprocessors with appropriate notice period.`;
  addWrappedText(subprocessorText, helveticaFont, 11);
  yPosition -= 20;

  // Signature lines
  addText('SIGNATURES', helveticaBoldFont, 14);
  yPosition -= 5;

  addText('Data Controller:', helveticaBoldFont, 12);
  addText('_________________________', helveticaFont, 11);
  addText(`${data.contactName}, ${data.jobTitle}`, helveticaFont, 10);
  addText(`Date: ___________`, helveticaFont, 10);
  yPosition -= 20;

  addText('Data Processor (123LegalDoc):', helveticaBoldFont, 12);
  addText('_________________________', helveticaFont, 11);
  addText('Compliance Officer', helveticaFont, 10);
  addText(`Date: ${new Date().toLocaleDateString()}`, helveticaFont, 10);

  return Buffer.from(await pdfDoc.save());
}

async function uploadToFirebaseStorage(
  pdfBuffer: Buffer,
  filename: string,
): Promise<string> {
  const { getStorage } = await import('@/lib/firebase-admin-optimized');
  const storage = await getStorage();
  const bucket = storage.bucket();
  const file = bucket.file(`dpa-agreements/${filename}`);

  await file.save(pdfBuffer, {
    metadata: {
      contentType: 'application/pdf',
      metadata: {
        generated: new Date().toISOString(),
        source: 'trust_center_dpa_generator',
      },
    },
  });

  // Generate signed URL valid for 24 hours
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  return signedUrl;
}

async function generateDPAId(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `DPA-${timestamp}-${random.toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = dpaRequestSchema.parse(body);

    // Generate unique DPA ID
    const dpaId = await generateDPAId();
    const filename = `${dpaId}-${validatedData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // Generate PDF
    const pdfBuffer = await generateDPAPDF(validatedData);

    // Upload to Firebase Storage and get signed URL
    const downloadUrl = await uploadToFirebaseStorage(pdfBuffer, filename);

    // Store DPA generation record in Firestore
    const dpaRecord = {
      dpaId,
      companyName: validatedData.companyName,
      legalEntityName: validatedData.legalEntityName,
      contactName: validatedData.contactName,
      email: validatedData.email,
      jobTitle: validatedData.jobTitle,
      companyAddress: validatedData.companyAddress,
      country: validatedData.country,
      dataTypes: validatedData.dataTypes,
      processingPurpose: validatedData.processingPurpose,
      effectiveDate: new Date(validatedData.effectiveDate),
      filename,
      downloadUrl,
      downloadExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      ipAddress:
        request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: validatedData.userAgent,
      status: 'generated',
    };

    const { getFirestore } = await import('@/lib/firebase-admin-optimized');
    const firestore = await getFirestore();
    const docRef = await firestore.collection('dpa_agreements').add(dpaRecord);

    // Log audit event
    await auditService.logComplianceEvent('dpa_generated', {
      dpaId,
      companyName: validatedData.companyName,
      email: validatedData.email,
      filename,
      firestoreDocId: docRef.id,
      ipAddress: dpaRecord.ipAddress,
      userAgent: validatedData.userAgent,
      dataTypes: validatedData.dataTypes,
    });

    return NextResponse.json({
      success: true,
      dpaId,
      downloadUrl,
      filename,
      expiresAt: dpaRecord.downloadExpires.toISOString(),
      message: 'Data Processing Agreement generated successfully',
    });
  } catch (error) {
    console.error('DPA generation API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate DPA' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Get DPA generation statistics for admin dashboard
  try {
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('admin_token');

    // Simple admin authentication (in production, use proper auth)
    if (adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { getFirestore } = await import('@/lib/firebase-admin-optimized');
    const firestore = await getFirestore();
    const recentDPAsSnapshot = await firestore
      .collection('dpa_agreements')
      .where('createdAt', '>=', thirtyDaysAgo)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const dpas = recentDPAsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      effectiveDate: doc.data().effectiveDate.toDate().toISOString(),
      downloadExpires: doc.data().downloadExpires.toDate().toISOString(),
    }));

    const stats = {
      totalGenerated: dpas.length,
      topCountries: getTopCountries(dpas),
      dataTypeDistribution: getDataTypeDistribution(dpas),
      dailyGeneration: getDailyGeneration(dpas),
    };

    return NextResponse.json({
      success: true,
      stats,
      recentDPAs: dpas.slice(0, 10), // Return 10 most recent
    });
  } catch (error) {
    console.error('DPA stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 },
    );
  }
}

function getTopCountries(dpas: any[]): { country: string; count: number }[] {
  const countryCounts = dpas.reduce(
    (acc, dpa) => {
      acc[dpa.country] = (acc[dpa.country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getDataTypeDistribution(
  dpas: any[],
): { dataType: string; count: number }[] {
  const dataTypeCounts: Record<string, number> = {};

  dpas.forEach((dpa) => {
    dpa.dataTypes.forEach((dataType: string) => {
      dataTypeCounts[dataType] = (dataTypeCounts[dataType] || 0) + 1;
    });
  });

  return Object.entries(dataTypeCounts)
    .map(([dataType, count]) => ({ dataType, count }))
    .sort((a, b) => b.count - a.count);
}

function getDailyGeneration(dpas: any[]): { date: string; count: number }[] {
  const dailyCounts = dpas.reduce(
    (acc, dpa) => {
      const date = new Date(dpa.createdAt).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
