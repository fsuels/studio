// Purchase Order API Endpoint
// Handles B2B purchase order workflows for enterprise customers

import { NextRequest, NextResponse } from 'next/server';
import { smartPricingEngine } from '@/lib/smart-pricing-engine';

export async function POST(req: NextRequest) {
  try {
    const {
      purchaseOrderId,
      companyName,
      contactName,
      contactEmail,
      billingAddress,
      poNumber,
      paymentTerms = 'net30',
    } = await req.json();

    if (!purchaseOrderId || !companyName || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would update the purchase order in your database
    // For now, we'll simulate the process
    
    const dueDate = new Date();
    const daysToAdd = paymentTerms === 'net15' ? 15 :
                     paymentTerms === 'net30' ? 30 :
                     paymentTerms === 'net45' ? 45 : 60;
    dueDate.setDate(dueDate.getDate() + daysToAdd);

    const updatedPO = {
      id: purchaseOrderId,
      companyName,
      contactName,
      contactEmail,
      billingAddress,
      poNumber,
      paymentTerms,
      status: 'pending',
      dueDate: dueDate.toISOString(),
      invoiceUrl: null, // Will be generated after approval
      createdAt: new Date().toISOString(),
    };

    // Send confirmation email (in production)
    console.log('✅ Purchase order submitted:', {
      purchaseOrderId,
      companyName,
      contactEmail,
      paymentTerms,
    });

    // Send notification to admin for approval
    // await sendPurchaseOrderNotification(updatedPO);

    return NextResponse.json({
      success: true,
      purchaseOrder: updatedPO,
      message: 'Purchase order submitted successfully. You will receive an invoice within 1-2 business days.',
    });

  } catch (error: any) {
    console.error('Purchase order submission failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit purchase order' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve purchase order status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const purchaseOrderId = searchParams.get('id');
    
    if (!purchaseOrderId) {
      return NextResponse.json(
        { error: 'Purchase order ID is required' },
        { status: 400 }
      );
    }

    // In production, fetch from database
    // For now, return mock data
    const mockPO = {
      id: purchaseOrderId,
      status: 'pending',
      companyName: 'Example Corp',
      totalAmount: 199,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(mockPO);

  } catch (error: any) {
    console.error('Failed to get purchase order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get purchase order' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update purchase order status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const {
      purchaseOrderId,
      status,
      adminNote,
    } = await req.json();

    if (!purchaseOrderId || !status) {
      return NextResponse.json(
        { error: 'Purchase order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'paid'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // In production, this would require admin authentication
    // and update the database

    const updatedPO = {
      id: purchaseOrderId,
      status,
      adminNote,
      updatedAt: new Date().toISOString(),
    };

    // If approved, generate invoice
    if (status === 'approved') {
      // Generate invoice URL
      updatedPO.invoiceUrl = `/invoices/${purchaseOrderId}.pdf`;
      
      // Send invoice email to customer
      console.log('✅ Sending invoice email for PO:', purchaseOrderId);
    }

    // Send status update email to customer
    // await sendPurchaseOrderStatusUpdate(updatedPO);

    return NextResponse.json({
      success: true,
      purchaseOrder: updatedPO,
    });

  } catch (error: any) {
    console.error('Failed to update purchase order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update purchase order' },
      { status: 500 }
    );
  }
}