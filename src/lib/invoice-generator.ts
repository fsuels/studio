// Professional Invoice Generation System
// Creates PDF invoices and manages billing documents

interface InvoiceData {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  
  // Company information
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
    taxId: string;
  };
  
  // Customer information
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
    company?: string;
  };
  
  // Invoice items
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxable: boolean;
    category: 'document' | 'subscription' | 'service' | 'addon';
  }>;
  
  // Totals and tax
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  discountPercentage?: number;
  total: number;
  
  // Payment information
  paymentTerms: string;
  paymentMethods: string[];
  notes?: string;
  
  // Metadata
  metadata: {
    subscriptionId?: string;
    paymentIntentId?: string;
    generatedBy: string;
    lastModified: string;
  };
}

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'modern' | 'classic' | 'minimal' | 'professional';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    size: {
      header: number;
      body: number;
      small: number;
    };
  };
}

export class InvoiceGenerator {
  private static instance: InvoiceGenerator;
  private invoices: Map<string, InvoiceData> = new Map();
  private templates: Map<string, InvoiceTemplate> = new Map();
  private companyInfo: InvoiceData['company'];

  constructor() {
    this.initializeCompanyInfo();
    this.initializeTemplates();
  }

  static getInstance(): InvoiceGenerator {
    if (!InvoiceGenerator.instance) {
      InvoiceGenerator.instance = new InvoiceGenerator();
    }
    return InvoiceGenerator.instance;
  }

  // Initialize company information
  private initializeCompanyInfo() {
    this.companyInfo = {
      name: '123LegalDoc',
      address: '123 Legal Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '+1 (555) 123-4567',
      email: 'billing@123legaldoc.com',
      website: 'https://123legaldoc.com',
      taxId: '12-3456789'
    };
  }

  // Initialize invoice templates
  private initializeTemplates() {
    // Modern template
    this.templates.set('modern', {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with bold headers',
      layout: 'modern',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        text: '#1e293b',
        background: '#ffffff'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'system-ui',
        size: { header: 24, body: 14, small: 12 }
      }
    });

    // Professional template
    this.templates.set('professional', {
      id: 'professional',
      name: 'Professional',
      description: 'Traditional business invoice design',
      layout: 'professional',
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#059669',
        text: '#374151',
        background: '#ffffff'
      },
      fonts: {
        primary: 'Arial',
        secondary: 'Helvetica',
        size: { header: 22, body: 13, small: 11 }
      }
    });

    // Minimal template
    this.templates.set('minimal', {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean design with minimal styling',
      layout: 'minimal',
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#000000',
        text: '#333333',
        background: '#ffffff'
      },
      fonts: {
        primary: 'Helvetica',
        secondary: 'Arial',
        size: { header: 20, body: 12, small: 10 }
      }
    });
  }

  // Create new invoice
  async createInvoice(
    customerId: string,
    customerData: InvoiceData['customer'],
    items: InvoiceData['items'],
    options?: {
      paymentTerms?: string;
      notes?: string;
      dueInDays?: number;
      discountPercentage?: number;
      taxRate?: number;
    }
  ): Promise<InvoiceData> {
    console.log(`📄 Creating invoice for customer ${customerId}`);

    const invoiceId = this.generateInvoiceId();
    const invoiceNumber = this.generateInvoiceNumber();
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + (options?.dueInDays || 30));

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = options?.discountPercentage ? 
      (subtotal * (options.discountPercentage / 100)) : 0;
    const taxableAmount = subtotal - discountAmount;
    const taxRate = options?.taxRate || 0.085; // Default 8.5% sales tax
    const taxAmount = taxableAmount * taxRate;
    const total = taxableAmount + taxAmount;

    const invoice: InvoiceData = {
      id: invoiceId,
      number: invoiceNumber,
      date: now.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'draft',
      company: { ...this.companyInfo },
      customer: customerData,
      items: items.map(item => ({
        ...item,
        id: item.id || this.generateItemId()
      })),
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      discountPercentage: options?.discountPercentage,
      total,
      paymentTerms: options?.paymentTerms || 'Net 30',
      paymentMethods: [
        'Credit Card (Visa, MasterCard, American Express)',
        'ACH Bank Transfer',
        'Wire Transfer',
        'Check'
      ],
      notes: options?.notes,
      metadata: {
        generatedBy: 'system',
        lastModified: now.toISOString()
      }
    };

    this.invoices.set(invoiceId, invoice);

    console.log(`✅ Invoice created: ${invoiceNumber} ($${total.toFixed(2)})`);
    return invoice;
  }

  // Generate PDF invoice
  async generatePDF(
    invoiceId: string,
    templateId: string = 'modern'
  ): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
    console.log(`📋 Generating PDF for invoice ${invoiceId}`);

    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    const template = this.templates.get(templateId);
    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    try {
      // Generate HTML content
      const htmlContent = this.generateInvoiceHTML(invoice, template);
      
      // In production, this would use a PDF generation library like Puppeteer or PDFKit
      const pdfBuffer = await this.convertHTMLToPDF(htmlContent);
      
      // Save PDF and return URL
      const pdfUrl = await this.savePDFFile(invoiceId, pdfBuffer);

      console.log(`✅ PDF generated: ${pdfUrl}`);
      return { success: true, pdfUrl };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return { success: false, error: 'PDF generation failed' };
    }
  }

  // Generate HTML invoice
  private generateInvoiceHTML(invoice: InvoiceData, template: InvoiceTemplate): string {
    const { colors, fonts } = template;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.number}</title>
    <style>
        body {
            font-family: ${fonts.primary}, sans-serif;
            color: ${colors.text};
            background: ${colors.background};
            margin: 0;
            padding: 40px;
            line-height: 1.5;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 40px;
            border-bottom: 2px solid ${colors.primary};
            padding-bottom: 20px;
        }
        .company-info h1 {
            color: ${colors.primary};
            font-size: ${fonts.size.header}px;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .company-info p {
            margin: 2px 0;
            font-size: ${fonts.size.body}px;
            color: ${colors.secondary};
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-details h2 {
            color: ${colors.primary};
            font-size: 28px;
            margin: 0 0 10px 0;
        }
        .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        .customer-info h3, .payment-info h3 {
            color: ${colors.primary};
            font-size: 16px;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .customer-info p, .payment-info p {
            margin: 3px 0;
            font-size: ${fonts.size.body}px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: ${colors.primary};
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            font-size: ${fonts.size.body}px;
        }
        .items-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
            font-size: ${fonts.size.body}px;
        }
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        .text-right {
            text-align: right;
        }
        .totals-section {
            max-width: 300px;
            margin-left: auto;
            border: 1px solid ${colors.secondary};
            border-radius: 8px;
            overflow: hidden;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .totals-row:last-child {
            border-bottom: none;
            background: ${colors.primary};
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        .payment-terms {
            margin-top: 40px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid ${colors.accent};
        }
        .payment-terms h4 {
            color: ${colors.primary};
            margin: 0 0 10px 0;
        }
        .payment-methods {
            margin-top: 20px;
        }
        .payment-methods ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        .notes {
            margin-top: 30px;
            padding: 20px;
            background: #fffbeb;
            border-radius: 8px;
            border: 1px solid #fbbf24;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: ${fonts.size.small}px;
            color: ${colors.secondary};
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-sent { background: #dbeafe; color: #1d4ed8; }
        .status-overdue { background: #fee2e2; color: #dc2626; }
        .status-draft { background: #f3f4f6; color: #374151; }
    </style>
</head>
<body>
    <div class="invoice-header">
        <div class="company-info">
            <h1>${invoice.company.name}</h1>
            <p>${invoice.company.address}</p>
            <p>${invoice.company.city}, ${invoice.company.state} ${invoice.company.zipCode}</p>
            <p>Phone: ${invoice.company.phone}</p>
            <p>Email: ${invoice.company.email}</p>
            <p>Tax ID: ${invoice.company.taxId}</p>
        </div>
        <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoice.number}</p>
            <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><span class="status-badge status-${invoice.status}">${invoice.status}</span></p>
        </div>
    </div>

    <div class="invoice-meta">
        <div class="customer-info">
            <h3>Bill To</h3>
            <p><strong>${invoice.customer.name}</strong></p>
            ${invoice.customer.company ? `<p>${invoice.customer.company}</p>` : ''}
            <p>${invoice.customer.address}</p>
            <p>${invoice.customer.city}, ${invoice.customer.state} ${invoice.customer.zipCode}</p>
            <p>${invoice.customer.email}</p>
            ${invoice.customer.phone ? `<p>${invoice.customer.phone}</p>` : ''}
        </div>
        <div class="payment-info">
            <h3>Payment Terms</h3>
            <p><strong>Terms:</strong> ${invoice.paymentTerms}</p>
            <p><strong>Currency:</strong> USD</p>
            <p><strong>Amount Due:</strong> $${invoice.total.toFixed(2)}</p>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items.map(item => `
            <tr>
                <td>
                    <strong>${item.description}</strong>
                    <br><small style="color: ${colors.secondary};">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</small>
                </td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                <td class="text-right">$${item.totalPrice.toFixed(2)}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
        </div>
        ${invoice.discountAmount ? `
        <div class="totals-row">
            <span>Discount (${invoice.discountPercentage}%):</span>
            <span>-$${invoice.discountAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="totals-row">
            <span>Tax (${(invoice.taxRate * 100).toFixed(1)}%):</span>
            <span>$${invoice.taxAmount.toFixed(2)}</span>
        </div>
        <div class="totals-row">
            <span>Total:</span>
            <span>$${invoice.total.toFixed(2)}</span>
        </div>
    </div>

    <div class="payment-terms">
        <h4>Payment Information</h4>
        <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
        <div class="payment-methods">
            <p><strong>Accepted Payment Methods:</strong></p>
            <ul>
                ${invoice.paymentMethods.map(method => `<li>${method}</li>`).join('')}
            </ul>
        </div>
        <p><small>Please include invoice number ${invoice.number} with your payment.</small></p>
    </div>

    ${invoice.notes ? `
    <div class="notes">
        <h4>Notes</h4>
        <p>${invoice.notes}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Questions about this invoice? Contact us at ${invoice.company.email} or ${invoice.company.phone}</p>
        <p style="margin-top: 20px;">
            <strong>${invoice.company.name}</strong> | ${invoice.company.website}
        </p>
    </div>
</body>
</html>`;
  }

  // Convert HTML to PDF (simulated)
  private async convertHTMLToPDF(html: string): Promise<Buffer> {
    // In production, this would use Puppeteer, PDFKit, or similar
    console.log('🔄 Converting HTML to PDF...');
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return simulated PDF buffer
    return Buffer.from(`PDF content for invoice: ${html.length} bytes`);
  }

  // Save PDF file (simulated)
  private async savePDFFile(invoiceId: string, pdfBuffer: Buffer): Promise<string> {
    // In production, this would save to cloud storage (AWS S3, Google Cloud, etc.)
    const filename = `invoice-${invoiceId}-${Date.now()}.pdf`;
    const url = `/api/invoices/${invoiceId}/pdf/${filename}`;
    
    console.log(`💾 PDF saved: ${filename}`);
    return url;
  }

  // Send invoice via email
  async sendInvoice(
    invoiceId: string,
    options?: {
      subject?: string;
      message?: string;
      ccEmails?: string[];
      attachPDF?: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> {
    console.log(`📧 Sending invoice ${invoiceId}`);

    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    // Generate PDF if needed
    let pdfUrl: string | undefined;
    if (options?.attachPDF !== false) {
      const pdfResult = await this.generatePDF(invoiceId);
      if (pdfResult.success) {
        pdfUrl = pdfResult.pdfUrl;
      }
    }

    // Prepare email content
    const subject = options?.subject || `Invoice ${invoice.number} from ${invoice.company.name}`;
    const message = options?.message || this.getDefaultEmailMessage(invoice);

    // Simulate email sending
    await this.simulateEmailSending(invoice.customer.email, subject, message, pdfUrl);

    // Update invoice status
    invoice.status = 'sent';
    invoice.metadata.lastModified = new Date().toISOString();

    console.log(`✅ Invoice sent to ${invoice.customer.email}`);
    return { success: true };
  }

  // Get default email message
  private getDefaultEmailMessage(invoice: InvoiceData): string {
    return `
Dear ${invoice.customer.name},

Please find attached invoice ${invoice.number} for $${invoice.total.toFixed(2)}.

Invoice Details:
- Invoice Date: ${new Date(invoice.date).toLocaleDateString()}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
- Amount Due: $${invoice.total.toFixed(2)}
- Payment Terms: ${invoice.paymentTerms}

You can pay this invoice online at: ${invoice.company.website}/pay/${invoice.id}

If you have any questions about this invoice, please contact us at ${invoice.company.email} or ${invoice.company.phone}.

Thank you for your business!

Best regards,
${invoice.company.name}
    `.trim();
  }

  // Simulate email sending
  private async simulateEmailSending(
    to: string,
    subject: string,
    message: string,
    attachmentUrl?: string
  ): Promise<void> {
    console.log(`📤 Email sent to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    if (attachmentUrl) {
      console.log(`📎 Attachment: ${attachmentUrl}`);
    }
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Mark invoice as paid
  async markAsPaid(
    invoiceId: string,
    paymentDate?: string,
    paymentMethod?: string,
    transactionId?: string
  ): Promise<InvoiceData> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = 'paid';
    invoice.metadata.lastModified = new Date().toISOString();
    
    // Add payment metadata
    invoice.metadata = {
      ...invoice.metadata,
      paymentDate: paymentDate || new Date().toISOString(),
      paymentMethod: paymentMethod || 'unknown',
      transactionId: transactionId || 'manual'
    };

    console.log(`💰 Invoice ${invoice.number} marked as paid`);
    return invoice;
  }

  // Get invoice by ID
  getInvoice(invoiceId: string): InvoiceData | undefined {
    return this.invoices.get(invoiceId);
  }

  // Get invoices by customer
  getCustomerInvoices(customerId: string): InvoiceData[] {
    return Array.from(this.invoices.values())
      .filter(invoice => invoice.customer.id === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get overdue invoices
  getOverdueInvoices(): InvoiceData[] {
    const now = new Date();
    return Array.from(this.invoices.values())
      .filter(invoice => 
        invoice.status === 'sent' && 
        new Date(invoice.dueDate) < now
      )
      .map(invoice => {
        invoice.status = 'overdue';
        return invoice;
      });
  }

  // Get invoice analytics
  getInvoiceAnalytics(): {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    overdueAmount: number;
    averageInvoiceValue: number;
    paymentSuccessRate: number;
    averagePaymentTime: number; // days
  } {
    const allInvoices = Array.from(this.invoices.values());
    const paidInvoices = allInvoices.filter(inv => inv.status === 'paid');
    const overdueInvoices = this.getOverdueInvoices();
    const outstandingInvoices = allInvoices.filter(inv => 
      ['sent', 'overdue'].includes(inv.status)
    );

    const totalAmount = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const outstandingAmount = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const averageInvoiceValue = allInvoices.length > 0 ? totalAmount / allInvoices.length : 0;
    const paymentSuccessRate = allInvoices.length > 0 ? 
      (paidInvoices.length / allInvoices.length) * 100 : 0;

    // Calculate average payment time
    let totalPaymentDays = 0;
    let paymentCount = 0;
    
    paidInvoices.forEach(invoice => {
      if (invoice.metadata.paymentDate) {
        const invoiceDate = new Date(invoice.date);
        const paymentDate = new Date(invoice.metadata.paymentDate);
        const daysDiff = (paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);
        totalPaymentDays += daysDiff;
        paymentCount++;
      }
    });

    const averagePaymentTime = paymentCount > 0 ? totalPaymentDays / paymentCount : 0;

    return {
      totalInvoices: allInvoices.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidAmount: Math.round(paidAmount * 100) / 100,
      outstandingAmount: Math.round(outstandingAmount * 100) / 100,
      overdueAmount: Math.round(overdueAmount * 100) / 100,
      averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
      paymentSuccessRate: Math.round(paymentSuccessRate * 100) / 100,
      averagePaymentTime: Math.round(averagePaymentTime * 10) / 10
    };
  }

  // Utility functions
  private generateInvoiceId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(this.invoices.size + 1).padStart(4, '0');
    return `${year}-${month}-${sequence}`;
  }

  private generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
}

// Export singleton instance
export const invoiceGenerator = InvoiceGenerator.getInstance();