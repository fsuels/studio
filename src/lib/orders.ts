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