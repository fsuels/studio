// Order management and fraud detection system
import { getLocationFromIP } from './geolocation';

export interface CustomerInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  ipLocation: {
    ip: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
    provider: string;
    confidence: string;
  };
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  lastOrderAt?: string;
  totalOrders: number;
  totalSpent: number;
  // Customer 360 enhancements
  churnRisk: 'low' | 'medium' | 'high';
  churnScore: number;
  lifetimeValue: number;
  planTier: 'free' | 'basic' | 'premium' | 'enterprise';
  lastActivityAt: string;
  averageNPS?: number;
  supportTickets: number;
  documentDownloads: number;
  lastSupportTicket?: string;
  acquisitionChannel?: string;
  customerSegment?: 'new' | 'growing' | 'established' | 'at_risk' | 'churned';
}

export interface OrderItem {
  id: string;
  documentType: string;
  documentName: string;
  price: number;
  quantity: number;
  stateCode?: string;
  customizations?: Record<string, any>;
}

export interface PaymentInfo {
  method: 'stripe' | 'paypal' | 'credit_card';
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processorFee?: number;
  netAmount: number;
  paymentDate: string;
  cardLast4?: string;
  cardBrand?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  payment: PaymentInfo;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  complianceCheck: {
    allowed: boolean;
    riskLevel: 'green' | 'amber' | 'red';
    stateCode: string;
    disclaimerLevel: string;
  };
  fraudAnalysis: {
    score: number;
    factors: string[];
    recommendation: 'approve' | 'review' | 'decline';
    distanceAlert: boolean;
    ipVsAddressDistance?: number;
  };
  timeline: OrderEvent[];
  documents: GeneratedDocument[];
  refunds: Refund[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  tags: string[];
  notes?: string;
}

export interface OrderEvent {
  id: string;
  type: 'created' | 'payment_received' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'fraud_review';
  description: string;
  timestamp: string;
  data?: Record<string, any>;
}

export interface GeneratedDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  downloadCount: number;
  createdAt: string;
  signedAt?: string;
  signatureProvider?: string;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  processedAt?: string;
  transactionId?: string;
}

// Customer 360 interfaces
export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'legal' | 'feature_request' | 'general';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
  customerSatisfaction?: number; // 1-5 rating
  tags: string[];
  relatedOrderId?: string;
  relatedDocumentId?: string;
}

export interface NPSResponse {
  id: string;
  customerId: string;
  score: number; // 0-10 NPS score
  feedback?: string;
  campaign: string;
  createdAt: string;
  followUpRequired: boolean;
  category: 'detractor' | 'passive' | 'promoter';
}

export interface CustomerTimelineEvent {
  id: string;
  customerId: string;
  type: 'order' | 'payment' | 'document_download' | 'support_ticket' | 'nps_response' | 
        'login' | 'document_created' | 'plan_change' | 'refund' | 'email_sent' | 'call' | 'note';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  relatedEntityId?: string; // ID of order, ticket, document, etc.
  relatedEntityType?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  source: 'system' | 'manual' | 'api' | 'webhook';
  actor?: {
    type: 'customer' | 'admin' | 'system';
    id: string;
    name?: string;
  };
}

export interface Customer360Data {
  customer: CustomerInfo;
  orders: Order[];
  supportTickets: SupportTicket[];
  npsResponses: NPSResponse[];
  timeline: CustomerTimelineEvent[];
  documents: GeneratedDocument[];
  metrics: {
    totalLifetimeValue: number;
    averageOrderValue: number;
    daysAsCustomer: number;
    lastActivityDays: number;
    documentDownloads: number;
    supportTicketResolutionTime: number; // average in hours
    npsScore: number;
    churnProbability: number; // 0-1 probability
    healthScore: number; // 0-100 customer health score
  };
  healthIndicators: {
    isChurnRisk: boolean;
    hasOpenTickets: boolean;
    hasRecentActivity: boolean;
    isHighValue: boolean;
    needsAttention: boolean;
    recentNPS?: 'detractor' | 'passive' | 'promoter';
  };
}

// Fraud detection utilities
export function calculateGeographicDistance(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function analyzeOrderFraud(order: Partial<Order>): Promise<{
  score: number;
  factors: string[];
  recommendation: 'approve' | 'review' | 'decline';
  distanceAlert: boolean;
  ipVsAddressDistance?: number;
}> {
  const factors: string[] = [];
  let score = 0;

  if (!order.customer || !order.payment) {
    return {
      score: 100,
      factors: ['Incomplete order data'],
      recommendation: 'decline',
      distanceAlert: false
    };
  }

  // Geographic distance check
  let distanceAlert = false;
  let ipVsAddressDistance: number | undefined;
  
  if (order.customer.ipLocation.latitude && order.customer.ipLocation.longitude) {
    // Get approximate coordinates for billing address (you'd use a geocoding service)
    const addressCoords = await getAddressCoordinates(order.customer.billingAddress);
    
    if (addressCoords) {
      ipVsAddressDistance = calculateGeographicDistance(
        order.customer.ipLocation.latitude,
        order.customer.ipLocation.longitude,
        addressCoords.lat,
        addressCoords.lng
      );

      if (ipVsAddressDistance > 100) {
        score += 30;
        factors.push(`IP location ${ipVsAddressDistance.toFixed(0)} miles from billing address`);
        distanceAlert = true;
      }

      if (ipVsAddressDistance > 500) {
        score += 20;
        factors.push('Extreme geographic distance detected');
      }
    }
  }

  // Country mismatch
  if (order.customer.ipLocation.country !== order.customer.billingAddress.country) {
    score += 25;
    factors.push('IP country differs from billing country');
  }

  // High-value first order
  if (order.customer.totalOrders === 0 && order.payment.amount > 200) {
    score += 15;
    factors.push('High-value first-time purchase');
  }

  // Payment method risk
  if (order.payment.method === 'credit_card') {
    // Add checks for known risky patterns
    if (order.payment.cardLast4 && isKnownRiskyCard(order.payment.cardLast4)) {
      score += 20;
      factors.push('Payment method flagged');
    }
  }

  // Velocity checks
  if (order.customer.totalOrders > 5 && order.customer.lastOrderAt) {
    const timeSinceLastOrder = Date.now() - new Date(order.customer.lastOrderAt).getTime();
    if (timeSinceLastOrder < 60 * 60 * 1000) { // Less than 1 hour
      score += 10;
      factors.push('Multiple orders in short timeframe');
    }
  }

  // IP quality check
  if (order.customer.ipLocation.confidence === 'low') {
    score += 10;
    factors.push('Low confidence IP geolocation');
  }

  // Email domain checks
  if (isSuspiciousEmailDomain(order.customer.email)) {
    score += 15;
    factors.push('Suspicious email domain');
  }

  // Determine recommendation
  let recommendation: 'approve' | 'review' | 'decline';
  if (score >= 70) {
    recommendation = 'decline';
  } else if (score >= 30) {
    recommendation = 'review';
  } else {
    recommendation = 'approve';
  }

  return {
    score,
    factors,
    recommendation,
    distanceAlert,
    ipVsAddressDistance
  };
}

// Helper functions
async function getAddressCoordinates(address: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): Promise<{ lat: number; lng: number } | null> {
  // In production, use a geocoding service like Google Maps API
  // For demo, return approximate coordinates for major cities
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'new york': { lat: 40.7128, lng: -74.0060 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'phoenix': { lat: 33.4484, lng: -112.0740 },
    // Add more cities as needed
  };

  const cityKey = address.city.toLowerCase();
  return cityCoords[cityKey] || null;
}

function isKnownRiskyCard(last4: string): boolean {
  // In production, check against known fraud databases
  const riskyCards = ['0000', '1111', '2222', '3333'];
  return riskyCards.includes(last4);
}

function isSuspiciousEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  const suspiciousDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'throwaway.email'
  ];
  return suspiciousDomains.includes(domain);
}

// Order management utilities
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `LD${timestamp}${random}`;
}

export function calculateOrderSummary(orders: Order[]): {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  refundRate: number;
  fraudRate: number;
} {
  const totalRevenue = orders.reduce((sum, order) => sum + order.payment.netAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const refundedOrders = orders.filter(o => o.status === 'refunded').length;
  const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0;
  
  const fraudOrders = orders.filter(o => o.fraudAnalysis.recommendation === 'decline').length;
  const fraudRate = totalOrders > 0 ? (fraudOrders / totalOrders) * 100 : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    refundRate,
    fraudRate
  };
}

// Mock data generator for demo
export function generateMockOrders(count: number): Order[] {
  const orders: Order[] = [];
  const documentTypes = [
    'LLC Operating Agreement',
    'Lease Agreement', 
    'Promissory Note',
    'Bill of Sale',
    'Power of Attorney',
    'Employment Contract',
    'NDA Agreement'
  ];
  
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  const cities = ['San Francisco', 'New York', 'Austin', 'Miami', 'Chicago'];
  
  for (let i = 0; i < count; i++) {
    const orderId = crypto.randomUUID();
    const customerId = crypto.randomUUID();
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    orders.push({
      id: orderId,
      orderNumber: generateOrderNumber(),
      customer: generateMockCustomer(customerId),
      items: [
        {
          id: crypto.randomUUID(),
          documentType: documentTypes[Math.floor(Math.random() * documentTypes.length)],
          documentName: `Custom ${documentTypes[Math.floor(Math.random() * documentTypes.length)]}`,
          price: 35,
          quantity: 1,
          stateCode: states[Math.floor(Math.random() * states.length)]
        }
      ],
      payment: generateMockPayment(),
      status: ['completed', 'processing', 'pending'][Math.floor(Math.random() * 3)] as any,
      complianceCheck: {
        allowed: Math.random() > 0.1,
        riskLevel: ['green', 'amber', 'red'][Math.floor(Math.random() * 3)] as any,
        stateCode: states[Math.floor(Math.random() * states.length)],
        disclaimerLevel: 'enhanced'
      },
      fraudAnalysis: {
        score: Math.floor(Math.random() * 100),
        factors: ['Geographic distance check passed', 'Payment method verified'],
        recommendation: ['approve', 'review', 'decline'][Math.floor(Math.random() * 3)] as any,
        distanceAlert: Math.random() > 0.8,
        ipVsAddressDistance: Math.floor(Math.random() * 1000)
      },
      timeline: [],
      documents: [],
      refunds: [],
      createdAt,
      updatedAt: createdAt,
      tags: ['online', 'automated'],
    });
  }
  
  return orders;
}

function generateMockCustomer(id: string): CustomerInfo {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const states = ['CA', 'NY', 'TX', 'FL', 'IL'];
  const cities = ['San Francisco', 'New York', 'Austin', 'Miami', 'Chicago'];
  
  return {
    id,
    email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    billingAddress: {
      street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: 'US'
    },
    ipLocation: {
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      country: 'US',
      latitude: 37.7749 + (Math.random() - 0.5) * 10,
      longitude: -122.4194 + (Math.random() - 0.5) * 10,
      provider: 'mock',
      confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
    },
    fraudScore: Math.floor(Math.random() * 100),
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    createdAt: new Date().toISOString(),
    totalOrders: Math.floor(Math.random() * 10) + 1,
    totalSpent: Math.floor(Math.random() * 500) + 35
  };
}

function generateMockPayment(): PaymentInfo {
  const amount = 35;
  return {
    method: ['stripe', 'paypal', 'credit_card'][Math.floor(Math.random() * 3)] as any,
    transactionId: `txn_${crypto.randomUUID().slice(0, 8)}`,
    amount,
    currency: 'USD',
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
    processorFee: 1.75,
    netAmount: amount - 1.75,
    paymentDate: new Date().toISOString(),
    cardLast4: `${Math.floor(Math.random() * 9000) + 1000}`,
    cardBrand: ['visa', 'mastercard', 'amex'][Math.floor(Math.random() * 3)]
  };
}

// Customer 360 utility functions
export function calculateCustomerMetrics(
  customer: CustomerInfo,
  orders: Order[],
  supportTickets: SupportTicket[],
  npsResponses: NPSResponse[],
  documents: GeneratedDocument[]
): Customer360Data['metrics'] {
  const now = new Date();
  const customerSince = new Date(customer.createdAt);
  const daysAsCustomer = Math.floor((now.getTime() - customerSince.getTime()) / (1000 * 60 * 60 * 24));
  
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.payment.netAmount, 0);
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  
  const lastActivity = new Date(customer.lastActivityAt);
  const lastActivityDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadCount, 0);
  
  // Calculate average support ticket resolution time
  const resolvedTickets = supportTickets.filter(t => t.status === 'resolved' && t.resolvedAt);
  const avgResolutionTime = resolvedTickets.length > 0 
    ? resolvedTickets.reduce((sum, ticket) => {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.resolvedAt!);
        return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }, 0) / resolvedTickets.length
    : 0;
  
  // Calculate NPS score
  const npsScore = npsResponses.length > 0
    ? npsResponses.reduce((sum, response) => sum + response.score, 0) / npsResponses.length
    : 0;
  
  // Calculate churn probability (simplified algorithm)
  let churnProbability = 0;
  if (lastActivityDays > 90) churnProbability += 0.3;
  if (lastActivityDays > 180) churnProbability += 0.3;
  if (npsScore < 6) churnProbability += 0.2;
  if (supportTickets.filter(t => t.status === 'open').length > 2) churnProbability += 0.2;
  churnProbability = Math.min(churnProbability, 1);
  
  // Calculate health score (0-100)
  let healthScore = 100;
  if (lastActivityDays > 30) healthScore -= 20;
  if (lastActivityDays > 60) healthScore -= 20;
  if (npsScore < 7) healthScore -= 15;
  if (supportTickets.filter(t => t.status === 'open').length > 0) healthScore -= 10;
  if (totalRevenue < 100) healthScore -= 10;
  healthScore = Math.max(healthScore, 0);
  
  return {
    totalLifetimeValue: totalRevenue,
    averageOrderValue,
    daysAsCustomer,
    lastActivityDays,
    documentDownloads: totalDownloads,
    supportTicketResolutionTime: avgResolutionTime,
    npsScore,
    churnProbability,
    healthScore
  };
}

export function calculateHealthIndicators(
  customer: CustomerInfo,
  metrics: Customer360Data['metrics'],
  supportTickets: SupportTicket[],
  npsResponses: NPSResponse[]
): Customer360Data['healthIndicators'] {
  const hasOpenTickets = supportTickets.some(t => t.status === 'open' || t.status === 'in_progress');
  const hasRecentActivity = metrics.lastActivityDays <= 30;
  const isHighValue = metrics.totalLifetimeValue >= 500;
  const isChurnRisk = metrics.churnProbability > 0.4 || customer.churnRisk === 'high';
  
  const needsAttention = isChurnRisk || hasOpenTickets || metrics.lastActivityDays > 60 || metrics.npsScore < 6;
  
  let recentNPS: 'detractor' | 'passive' | 'promoter' | undefined;
  if (npsResponses.length > 0) {
    const latestNPS = npsResponses[npsResponses.length - 1];
    if (latestNPS.score <= 6) recentNPS = 'detractor';
    else if (latestNPS.score <= 8) recentNPS = 'passive';
    else recentNPS = 'promoter';
  }
  
  return {
    isChurnRisk,
    hasOpenTickets,
    hasRecentActivity,
    isHighValue,
    needsAttention,
    recentNPS
  };
}

export function generateCustomerTimeline(
  orders: Order[],
  supportTickets: SupportTicket[],
  npsResponses: NPSResponse[],
  documents: GeneratedDocument[]
): CustomerTimelineEvent[] {
  const timeline: CustomerTimelineEvent[] = [];
  
  // Add order events
  orders.forEach(order => {
    timeline.push({
      id: `order-${order.id}`,
      customerId: order.customer.id,
      type: 'order',
      title: `Order ${order.orderNumber}`,
      description: `Purchased ${order.items.map(item => item.documentName).join(', ')} for $${order.payment.amount}`,
      timestamp: order.createdAt,
      relatedEntityId: order.id,
      relatedEntityType: 'order',
      severity: 'success',
      source: 'system',
      metadata: {
        orderNumber: order.orderNumber,
        amount: order.payment.amount,
        status: order.status
      }
    });
    
    if (order.payment.status === 'completed') {
      timeline.push({
        id: `payment-${order.id}`,
        customerId: order.customer.id,
        type: 'payment',
        title: 'Payment Received',
        description: `Payment of $${order.payment.amount} processed successfully`,
        timestamp: order.payment.paymentDate,
        relatedEntityId: order.id,
        relatedEntityType: 'payment',
        severity: 'success',
        source: 'system',
        metadata: {
          method: order.payment.method,
          amount: order.payment.amount,
          transactionId: order.payment.transactionId
        }
      });
    }
  });
  
  // Add support ticket events
  supportTickets.forEach(ticket => {
    timeline.push({
      id: `ticket-${ticket.id}`,
      customerId: ticket.customerId,
      type: 'support_ticket',
      title: `Support Ticket: ${ticket.subject}`,
      description: ticket.description.substring(0, 100) + (ticket.description.length > 100 ? '...' : ''),
      timestamp: ticket.createdAt,
      relatedEntityId: ticket.id,
      relatedEntityType: 'support_ticket',
      severity: ticket.priority === 'urgent' ? 'error' : ticket.priority === 'high' ? 'warning' : 'info',
      source: 'manual',
      metadata: {
        priority: ticket.priority,
        category: ticket.category,
        status: ticket.status
      }
    });
    
    if (ticket.resolvedAt) {
      timeline.push({
        id: `ticket-resolved-${ticket.id}`,
        customerId: ticket.customerId,
        type: 'support_ticket',
        title: 'Support Ticket Resolved',
        description: `Ticket "${ticket.subject}" has been resolved`,
        timestamp: ticket.resolvedAt,
        relatedEntityId: ticket.id,
        relatedEntityType: 'support_ticket',
        severity: 'success',
        source: 'manual',
        metadata: {
          resolution: ticket.resolution,
          satisfaction: ticket.customerSatisfaction
        }
      });
    }
  });
  
  // Add NPS response events
  npsResponses.forEach(nps => {
    timeline.push({
      id: `nps-${nps.id}`,
      customerId: nps.customerId,
      type: 'nps_response',
      title: `NPS Response: ${nps.score}/10`,
      description: nps.feedback || `Customer rated us ${nps.score}/10 in ${nps.campaign} campaign`,
      timestamp: nps.createdAt,
      relatedEntityId: nps.id,
      relatedEntityType: 'nps_response',
      severity: nps.category === 'detractor' ? 'warning' : nps.category === 'promoter' ? 'success' : 'info',
      source: 'system',
      metadata: {
        score: nps.score,
        category: nps.category,
        campaign: nps.campaign
      }
    });
  });
  
  // Add document download events
  documents.forEach(doc => {
    if (doc.downloadCount > 0) {
      timeline.push({
        id: `doc-download-${doc.id}`,
        customerId: '', // Will be set by caller
        type: 'document_download',
        title: 'Document Downloaded',
        description: `Downloaded "${doc.name}" (${doc.downloadCount} times)`,
        timestamp: doc.createdAt,
        relatedEntityId: doc.id,
        relatedEntityType: 'document',
        severity: 'info',
        source: 'system',
        metadata: {
          documentType: doc.type,
          downloadCount: doc.downloadCount
        }
      });
    }
  });
  
  // Sort timeline by timestamp (most recent first)
  return timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Mock data generators for Customer 360
export function generateMockSupportTickets(customerId: string, count: number = 3): SupportTicket[] {
  const tickets: SupportTicket[] = [];
  const subjects = [
    'Unable to download document',
    'Billing question about recent charge',
    'Need help customizing contract',
    'Document template missing information',
    'Payment failed but order processed',
    'Request for legal advice',
    'Feature request: bulk document generation'
  ];
  
  const categories: SupportTicket['category'][] = ['technical', 'billing', 'legal', 'feature_request', 'general'];
  const priorities: SupportTicket['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const statuses: SupportTicket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    tickets.push({
      id: crypto.randomUUID(),
      customerId,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      description: 'Customer needs assistance with their legal document. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      assignedTo: Math.random() > 0.5 ? 'support@123legaldoc.com' : undefined,
      createdAt,
      updatedAt: createdAt,
      resolvedAt: status === 'resolved' || status === 'closed' 
        ? new Date(new Date(createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      resolution: status === 'resolved' || status === 'closed' 
        ? 'Issue has been resolved through email communication and documentation update.'
        : undefined,
      customerSatisfaction: status === 'resolved' || status === 'closed' 
        ? Math.floor(Math.random() * 3) + 3 // 3-5 rating
        : undefined,
      tags: ['email', 'priority'],
      relatedOrderId: Math.random() > 0.7 ? crypto.randomUUID() : undefined
    });
  }
  
  return tickets;
}

export function generateMockNPSResponses(customerId: string, count: number = 2): NPSResponse[] {
  const responses: NPSResponse[] = [];
  const campaigns = ['quarterly_survey', 'post_purchase', 'annual_review', 'feature_feedback'];
  const feedbacks = [
    'Great service! Very easy to use.',
    'Could use more document templates.',
    'Support team was very helpful.',
    'Interface is a bit confusing.',
    'Exactly what I needed for my business.',
    'Price is reasonable for the value.'
  ];
  
  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * 11); // 0-10
    let category: NPSResponse['category'];
    if (score <= 6) category = 'detractor';
    else if (score <= 8) category = 'passive';
    else category = 'promoter';
    
    responses.push({
      id: crypto.randomUUID(),
      customerId,
      score,
      feedback: Math.random() > 0.3 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : undefined,
      campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      followUpRequired: category === 'detractor' || (score <= 8 && Math.random() > 0.5),
      category
    });
  }
  
  return responses;
}

export function generateMockCustomer360Data(customerId?: string): Customer360Data {
  const id = customerId || crypto.randomUUID();
  const customer = generateMockCustomer(id);
  
  // Add Customer 360 fields to the mock customer
  const enhancedCustomer: CustomerInfo = {
    ...customer,
    churnRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    churnScore: Math.floor(Math.random() * 100),
    lifetimeValue: Math.floor(Math.random() * 2000) + 100,
    planTier: ['free', 'basic', 'premium', 'enterprise'][Math.floor(Math.random() * 4)] as any,
    lastActivityAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    averageNPS: Math.floor(Math.random() * 6) + 5, // 5-10
    supportTickets: Math.floor(Math.random() * 10),
    documentDownloads: Math.floor(Math.random() * 50) + 5,
    lastSupportTicket: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    acquisitionChannel: ['organic_search', 'paid_search', 'social_media', 'referral', 'direct'][Math.floor(Math.random() * 5)],
    customerSegment: ['new', 'growing', 'established', 'at_risk', 'churned'][Math.floor(Math.random() * 5)] as any
  };
  
  const orders = generateMockOrders(Math.floor(Math.random() * 8) + 2).map(order => ({
    ...order,
    customer: enhancedCustomer
  }));
  
  const supportTickets = generateMockSupportTickets(id, Math.floor(Math.random() * 5) + 1);
  const npsResponses = generateMockNPSResponses(id, Math.floor(Math.random() * 3) + 1);
  const documents = orders.flatMap(order => order.documents);
  
  const metrics = calculateCustomerMetrics(enhancedCustomer, orders, supportTickets, npsResponses, documents);
  const healthIndicators = calculateHealthIndicators(enhancedCustomer, metrics, supportTickets, npsResponses);
  const timeline = generateCustomerTimeline(orders, supportTickets, npsResponses, documents);
  
  return {
    customer: enhancedCustomer,
    orders,
    supportTickets,
    npsResponses,
    timeline,
    documents,
    metrics,
    healthIndicators
  };
}