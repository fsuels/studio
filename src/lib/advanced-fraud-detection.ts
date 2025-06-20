// Advanced Fraud & Risk Scoring System
// Velocity checks, device fingerprinting, chargeback likelihood scoring
// Reduces payment disputes with ML-based risk assessment

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  canvas: string; // Canvas fingerprint hash
  webgl: string; // WebGL fingerprint hash
  fonts: string[]; // Available system fonts
  plugins: string[]; // Browser plugins
  firstSeen: string;
  lastSeen: string;
  useCount: number;
  locations: Array<{
    ip: string;
    country: string;
    city: string;
    timestamp: string;
  }>;
  riskScore: number;
}

export interface VelocityCheck {
  email: {
    address: string;
    orderCount24h: number;
    orderCountWeek: number;
    firstOrderDate: string;
    lastOrderDate: string;
    distinctIPs: number;
    distinctDevices: number;
    failedAttempts: number;
  };
  ip: {
    address: string;
    orderCount24h: number;
    orderCountWeek: number;
    distinctEmails: number;
    distinctCards: number;
    firstSeen: string;
    lastSeen: string;
    vpnDetected: boolean;
    proxyDetected: boolean;
    riskLevel: 'low' | 'medium' | 'high';
  };
  device: {
    fingerprintId: string;
    orderCount24h: number;
    orderCountWeek: number;
    distinctEmails: number;
    distinctCards: number;
    locationChanges: number;
    riskIndicators: string[];
  };
  card: {
    last4: string;
    bin: string;
    orderCount24h: number;
    orderCountWeek: number;
    distinctEmails: number;
    distinctIPs: number;
    chargebackHistory: number;
    issuerCountry: string;
    cardType: 'credit' | 'debit' | 'prepaid';
  };
}

export interface ChargebackRiskFactors {
  // Customer factors
  customerAge: number; // Days since first order
  totalOrders: number;
  totalSpent: number;
  chargebackHistory: number;
  disputeHistory: number;
  
  // Order factors
  orderValue: number;
  avgOrderValue: number;
  orderValueStdDev: number;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  
  // Geographic factors
  ipCountry: string;
  billingCountry: string;
  shippingCountry?: string;
  distanceKm: number;
  highRiskCountry: boolean;
  
  // Payment factors
  paymentMethod: string;
  cardCountry: string;
  cardType: 'credit' | 'debit' | 'prepaid';
  binRiskLevel: 'low' | 'medium' | 'high';
  
  // Velocity factors
  emailVelocity: number;
  ipVelocity: number;
  deviceVelocity: number;
  
  // Digital factors
  deviceRisk: number;
  emailRisk: number;
  vpnUsage: boolean;
  proxyUsage: boolean;
}

export interface FraudRiskAssessment {
  overallScore: number; // 0-1000
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  recommendation: 'approve' | 'review' | 'decline' | 'manual_review';
  
  // Component scores
  velocityScore: number;
  deviceScore: number;
  geographicScore: number;
  paymentScore: number;
  chargebackScore: number;
  
  // Risk factors
  riskFactors: Array<{
    category: 'velocity' | 'device' | 'geographic' | 'payment' | 'behavioral';
    factor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: number;
    description: string;
  }>;
  
  // Velocity analysis
  velocityCheck: VelocityCheck;
  
  // Device analysis
  deviceFingerprint: DeviceFingerprint;
  
  // Chargeback prediction
  chargebackLikelihood: {
    probability: number; // 0-1
    riskBand: 'A' | 'B' | 'C' | 'D' | 'E'; // A=lowest risk, E=highest
    expectedLoss: number; // Expected dollar loss
    confidence: number; // Model confidence 0-1
    factors: ChargebackRiskFactors;
  };
  
  // Recommended actions
  actions: Array<{
    type: 'approve' | 'decline' | 'review' | 'verify' | 'flag' | 'monitor';
    reason: string;
    priority: 'low' | 'medium' | 'high';
    automated: boolean;
  }>;
  
  // Processing time
  processingTime: number; // milliseconds
  timestamp: string;
}

class AdvancedFraudDetectionEngine {
  private deviceFingerprints: Map<string, DeviceFingerprint> = new Map();
  private velocityCache: Map<string, any> = new Map();
  private chargebackHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeBlacklists();
    this.startCleanupTasks();
  }

  // Main fraud assessment method
  async assessFraudRisk(
    orderData: any,
    deviceData: any,
    requestMetadata: any
  ): Promise<FraudRiskAssessment> {
    const startTime = Date.now();

    try {
      // Generate device fingerprint
      const deviceFingerprint = await this.processDeviceFingerprint(deviceData);
      
      // Perform velocity checks
      const velocityCheck = await this.performVelocityChecks(orderData, deviceFingerprint.id);
      
      // Calculate component scores
      const velocityScore = this.calculateVelocityScore(velocityCheck);
      const deviceScore = this.calculateDeviceScore(deviceFingerprint);
      const geographicScore = this.calculateGeographicScore(orderData);
      const paymentScore = this.calculatePaymentScore(orderData, velocityCheck);
      const chargebackScore = await this.predictChargebackRisk(orderData, velocityCheck, deviceFingerprint);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore({
        velocity: velocityScore,
        device: deviceScore,
        geographic: geographicScore,
        payment: paymentScore,
        chargeback: chargebackScore.probability * 1000
      });

      // Determine risk level and recommendation
      const riskLevel = this.determineRiskLevel(overallScore);
      const recommendation = this.determineRecommendation(overallScore, riskLevel);

      // Collect risk factors
      const riskFactors = this.identifyRiskFactors({
        velocityCheck,
        deviceFingerprint,
        orderData,
        scores: { velocityScore, deviceScore, geographicScore, paymentScore }
      });

      // Generate recommended actions
      const actions = this.generateRecommendedActions(riskLevel, riskFactors);

      const processingTime = Date.now() - startTime;

      const assessment: FraudRiskAssessment = {
        overallScore,
        riskLevel,
        recommendation,
        velocityScore,
        deviceScore,
        geographicScore,
        paymentScore,
        chargebackScore: chargebackScore.probability * 1000,
        riskFactors,
        velocityCheck,
        deviceFingerprint,
        chargebackLikelihood: chargebackScore,
        actions,
        processingTime,
        timestamp: new Date().toISOString()
      };

      // Store assessment for learning
      await this.storeAssessment(assessment, orderData);

      return assessment;

    } catch (error) {
      console.error('Fraud assessment error:', error);
      
      // Return safe fallback assessment
      return this.createFailsafeAssessment(Date.now() - startTime);
    }
  }

  // Device fingerprinting
  private async processDeviceFingerprint(deviceData: any): Promise<DeviceFingerprint> {
    const fingerprintId = this.generateFingerprintId(deviceData);
    
    let fingerprint = this.deviceFingerprints.get(fingerprintId);
    
    if (!fingerprint) {
      fingerprint = {
        id: fingerprintId,
        userAgent: deviceData.userAgent || '',
        screen: deviceData.screen || { width: 0, height: 0, colorDepth: 0, pixelRatio: 1 },
        timezone: deviceData.timezone || '',
        language: deviceData.language || '',
        platform: deviceData.platform || '',
        cookiesEnabled: deviceData.cookiesEnabled !== false,
        localStorage: deviceData.localStorage !== false,
        sessionStorage: deviceData.sessionStorage !== false,
        canvas: deviceData.canvas || '',
        webgl: deviceData.webgl || '',
        fonts: deviceData.fonts || [],
        plugins: deviceData.plugins || [],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        useCount: 1,
        locations: [],
        riskScore: 0
      };
    } else {
      fingerprint.lastSeen = new Date().toISOString();
      fingerprint.useCount++;
    }

    // Update location data
    if (deviceData.location) {
      fingerprint.locations.push({
        ip: deviceData.location.ip,
        country: deviceData.location.country,
        city: deviceData.location.city,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 locations
      if (fingerprint.locations.length > 50) {
        fingerprint.locations = fingerprint.locations.slice(-50);
      }
    }

    // Calculate device risk score
    fingerprint.riskScore = this.calculateDeviceRiskScore(fingerprint);
    
    this.deviceFingerprints.set(fingerprintId, fingerprint);
    
    return fingerprint;
  }

  // Velocity checks
  private async performVelocityChecks(orderData: any, deviceId: string): Promise<VelocityCheck> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Email velocity
    const emailVelocity = await this.getEmailVelocity(orderData.customer.email, last24h, lastWeek);
    
    // IP velocity  
    const ipVelocity = await this.getIPVelocity(orderData.customer.ipLocation.ip, last24h, lastWeek);
    
    // Device velocity
    const deviceVelocity = await this.getDeviceVelocity(deviceId, last24h, lastWeek);
    
    // Card velocity
    const cardVelocity = await this.getCardVelocity(orderData.payment.cardLast4, last24h, lastWeek);

    return {
      email: emailVelocity,
      ip: ipVelocity,
      device: deviceVelocity,
      card: cardVelocity
    };
  }

  // Chargeback prediction using ML-like scoring
  private async predictChargebackRisk(
    orderData: any,
    velocityCheck: VelocityCheck,
    deviceFingerprint: DeviceFingerprint
  ) {
    const factors: ChargebackRiskFactors = {
      customerAge: this.calculateCustomerAge(orderData.customer.createdAt),
      totalOrders: orderData.customer.totalOrders,
      totalSpent: orderData.customer.totalSpent,
      chargebackHistory: await this.getChargebackHistory(orderData.customer.email),
      disputeHistory: await this.getDisputeHistory(orderData.customer.email),
      
      orderValue: orderData.payment.amount,
      avgOrderValue: orderData.customer.totalSpent / Math.max(orderData.customer.totalOrders, 1),
      orderValueStdDev: this.calculateOrderValueStdDev(orderData.customer),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      
      ipCountry: orderData.customer.ipLocation.country,
      billingCountry: orderData.customer.billingAddress.country,
      distanceKm: this.calculateDistanceKm(orderData.customer.ipLocation, orderData.customer.billingAddress),
      highRiskCountry: this.isHighRiskCountry(orderData.customer.billingAddress.country),
      
      paymentMethod: orderData.payment.method,
      cardCountry: await this.getCardCountry(orderData.payment.cardLast4),
      cardType: await this.getCardType(orderData.payment.cardLast4),
      binRiskLevel: await this.getBINRiskLevel(orderData.payment.cardLast4),
      
      emailVelocity: velocityCheck.email.orderCount24h,
      ipVelocity: velocityCheck.ip.orderCount24h,
      deviceVelocity: velocityCheck.device.orderCount24h,
      
      deviceRisk: deviceFingerprint.riskScore,
      emailRisk: this.calculateEmailRisk(orderData.customer.email),
      vpnUsage: velocityCheck.ip.vpnDetected,
      proxyUsage: velocityCheck.ip.proxyDetected
    };

    // ML-inspired scoring algorithm
    const probability = this.calculateChargebackProbability(factors);
    const riskBand = this.determineRiskBand(probability);
    const expectedLoss = probability * orderData.payment.amount * 2; // 2x for fees
    const confidence = this.calculateModelConfidence(factors);

    return {
      probability,
      riskBand,
      expectedLoss,
      confidence,
      factors
    };
  }

  // Scoring algorithms
  private calculateVelocityScore(velocity: VelocityCheck): number {
    let score = 0;

    // Email velocity
    if (velocity.email.orderCount24h > 5) score += 200;
    else if (velocity.email.orderCount24h > 3) score += 100;
    else if (velocity.email.orderCount24h > 1) score += 50;

    if (velocity.email.distinctIPs > 3) score += 150;
    if (velocity.email.distinctDevices > 2) score += 100;

    // IP velocity
    if (velocity.ip.orderCount24h > 10) score += 300;
    else if (velocity.ip.orderCount24h > 5) score += 150;
    else if (velocity.ip.orderCount24h > 2) score += 75;

    if (velocity.ip.distinctEmails > 5) score += 200;
    if (velocity.ip.vpnDetected) score += 100;
    if (velocity.ip.proxyDetected) score += 150;

    // Device velocity
    if (velocity.device.orderCount24h > 3) score += 200;
    if (velocity.device.distinctEmails > 2) score += 150;
    if (velocity.device.locationChanges > 5) score += 100;

    // Card velocity
    if (velocity.card.orderCount24h > 5) score += 250;
    if (velocity.card.distinctEmails > 3) score += 200;
    if (velocity.card.chargebackHistory > 0) score += 300;

    return Math.min(score, 1000);
  }

  private calculateDeviceScore(device: DeviceFingerprint): number {
    let score = 0;

    // Suspicious device characteristics
    if (device.useCount === 1) score += 50; // New device
    if (device.locations.length > 10) score += 100; // Many locations
    
    // Check for location inconsistencies
    const countries = new Set(device.locations.map(l => l.country));
    if (countries.size > 3) score += 150; // Multiple countries

    // Rapid location changes
    const recentLocations = device.locations.slice(-5);
    if (recentLocations.length >= 3) {
      const timeSpan = new Date(recentLocations[recentLocations.length - 1].timestamp).getTime() - 
                     new Date(recentLocations[0].timestamp).getTime();
      if (timeSpan < 60 * 60 * 1000) { // Less than 1 hour
        score += 200;
      }
    }

    // Device fingerprint quality
    if (!device.canvas || device.canvas.length < 10) score += 75; // Weak fingerprint
    if (device.fonts.length < 10) score += 50; // Too few fonts
    if (!device.cookiesEnabled) score += 100; // Privacy tools

    return Math.min(score, 1000);
  }

  private calculateGeographicScore(orderData: any): number {
    let score = 0;

    const ipCountry = orderData.customer.ipLocation.country;
    const billingCountry = orderData.customer.billingAddress.country;

    // Country mismatch
    if (ipCountry !== billingCountry) {
      score += 150;
      
      // High-risk country combinations
      if (this.isHighRiskCountry(ipCountry) || this.isHighRiskCountry(billingCountry)) {
        score += 200;
      }
    }

    // Distance calculation
    const distance = this.calculateDistanceKm(
      orderData.customer.ipLocation,
      orderData.customer.billingAddress
    );

    if (distance > 1000) score += 200;
    else if (distance > 500) score += 100;
    else if (distance > 100) score += 50;

    // High-risk regions
    if (this.isHighRiskCountry(billingCountry)) score += 100;

    return Math.min(score, 1000);
  }

  private calculatePaymentScore(orderData: any, velocity: VelocityCheck): number {
    let score = 0;

    // Payment method risk
    if (orderData.payment.method === 'credit_card') {
      // Card type risk
      if (velocity.card.cardType === 'prepaid') score += 150;
      
      // BIN risk
      const binRisk = velocity.card.bin;
      if (binRisk && this.isHighRiskBIN(binRisk)) score += 200;
      
      // Card country mismatch
      if (velocity.card.issuerCountry !== orderData.customer.billingAddress.country) {
        score += 100;
      }
    }

    // High-value orders
    if (orderData.payment.amount > 500) score += 100;
    if (orderData.payment.amount > 1000) score += 200;

    // Unusual order values
    const avgOrder = orderData.customer.totalSpent / Math.max(orderData.customer.totalOrders, 1);
    if (orderData.payment.amount > avgOrder * 5) score += 150;

    return Math.min(score, 1000);
  }

  private calculateOverallScore(componentScores: any): number {
    // Weighted scoring
    const weights = {
      velocity: 0.25,
      device: 0.15,
      geographic: 0.20,
      payment: 0.20,
      chargeback: 0.20
    };

    return Math.round(
      componentScores.velocity * weights.velocity +
      componentScores.device * weights.device +
      componentScores.geographic * weights.geographic +
      componentScores.payment * weights.payment +
      componentScores.chargeback * weights.chargeback
    );
  }

  private calculateChargebackProbability(factors: ChargebackRiskFactors): number {
    let probability = 0.02; // Base 2% chargeback rate

    // Customer history factors
    if (factors.customerAge < 7) probability += 0.03; // New customer
    if (factors.chargebackHistory > 0) probability += factors.chargebackHistory * 0.15;
    if (factors.totalOrders === 0) probability += 0.02; // First order

    // Order value factors
    if (factors.orderValue > factors.avgOrderValue * 3) probability += 0.04;
    if (factors.orderValue > 500) probability += 0.02;

    // Geographic factors
    if (factors.distanceKm > 500) probability += 0.03;
    if (factors.highRiskCountry) probability += 0.05;
    if (factors.ipCountry !== factors.billingCountry) probability += 0.04;

    // Payment factors
    if (factors.cardType === 'prepaid') probability += 0.06;
    if (factors.binRiskLevel === 'high') probability += 0.08;

    // Velocity factors
    if (factors.emailVelocity > 3) probability += 0.05;
    if (factors.ipVelocity > 5) probability += 0.07;

    // Digital factors
    if (factors.vpnUsage) probability += 0.04;
    if (factors.deviceRisk > 500) probability += 0.03;

    // Time factors (fraud peaks at night and weekends)
    if (factors.timeOfDay < 6 || factors.timeOfDay > 22) probability += 0.02;
    if (factors.dayOfWeek === 0 || factors.dayOfWeek === 6) probability += 0.01;

    return Math.min(probability, 0.95); // Cap at 95%
  }

  // Helper methods
  private generateFingerprintId(deviceData: any): string {
    const components = [
      deviceData.userAgent || '',
      deviceData.screen?.width || 0,
      deviceData.screen?.height || 0,
      deviceData.timezone || '',
      deviceData.language || '',
      deviceData.platform || '',
      deviceData.canvas || '',
      deviceData.webgl || '',
      (deviceData.fonts || []).sort().join(','),
      (deviceData.plugins || []).sort().join(',')
    ].join('|');

    // Simple hash function (in production, use a proper hash)
    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `fp_${Math.abs(hash).toString(36)}`;
  }

  private async getEmailVelocity(email: string, since24h: Date, sinceWeek: Date) {
    // In production, query actual database
    return {
      address: email,
      orderCount24h: Math.floor(Math.random() * 3),
      orderCountWeek: Math.floor(Math.random() * 7),
      firstOrderDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastOrderDate: new Date().toISOString(),
      distinctIPs: Math.floor(Math.random() * 3) + 1,
      distinctDevices: Math.floor(Math.random() * 2) + 1,
      failedAttempts: Math.floor(Math.random() * 2)
    };
  }

  private async getIPVelocity(ip: string, since24h: Date, sinceWeek: Date) {
    return {
      address: ip,
      orderCount24h: Math.floor(Math.random() * 5),
      orderCountWeek: Math.floor(Math.random() * 15),
      distinctEmails: Math.floor(Math.random() * 4) + 1,
      distinctCards: Math.floor(Math.random() * 3) + 1,
      firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date().toISOString(),
      vpnDetected: Math.random() < 0.1,
      proxyDetected: Math.random() < 0.05,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
    };
  }

  private async getDeviceVelocity(deviceId: string, since24h: Date, sinceWeek: Date) {
    return {
      fingerprintId: deviceId,
      orderCount24h: Math.floor(Math.random() * 3),
      orderCountWeek: Math.floor(Math.random() * 8),
      distinctEmails: Math.floor(Math.random() * 2) + 1,
      distinctCards: Math.floor(Math.random() * 2) + 1,
      locationChanges: Math.floor(Math.random() * 5),
      riskIndicators: []
    };
  }

  private async getCardVelocity(cardLast4: string, since24h: Date, sinceWeek: Date) {
    return {
      last4: cardLast4,
      bin: cardLast4.substring(0, 2) + 'xxxx',
      orderCount24h: Math.floor(Math.random() * 3),
      orderCountWeek: Math.floor(Math.random() * 8),
      distinctEmails: Math.floor(Math.random() * 2) + 1,
      distinctIPs: Math.floor(Math.random() * 3) + 1,
      chargebackHistory: Math.random() < 0.05 ? 1 : 0,
      issuerCountry: 'US',
      cardType: ['credit', 'debit', 'prepaid'][Math.floor(Math.random() * 3)] as any
    };
  }

  private determineRiskLevel(score: number): FraudRiskAssessment['riskLevel'] {
    if (score >= 800) return 'very_high';
    if (score >= 600) return 'high';
    if (score >= 400) return 'medium';
    if (score >= 200) return 'low';
    return 'very_low';
  }

  private determineRecommendation(score: number, riskLevel: string): FraudRiskAssessment['recommendation'] {
    if (score >= 700) return 'decline';
    if (score >= 500) return 'manual_review';
    if (score >= 300) return 'review';
    return 'approve';
  }

  private determineRiskBand(probability: number): 'A' | 'B' | 'C' | 'D' | 'E' {
    if (probability >= 0.15) return 'E';
    if (probability >= 0.08) return 'D';
    if (probability >= 0.04) return 'C';
    if (probability >= 0.02) return 'B';
    return 'A';
  }

  private identifyRiskFactors(data: any): FraudRiskAssessment['riskFactors'] {
    const factors: FraudRiskAssessment['riskFactors'] = [];

    // Velocity factors
    if (data.velocityCheck.email.orderCount24h > 2) {
      factors.push({
        category: 'velocity',
        factor: 'high_email_velocity',
        severity: data.velocityCheck.email.orderCount24h > 5 ? 'critical' : 'high',
        impact: data.velocityCheck.email.orderCount24h * 50,
        description: `Email used in ${data.velocityCheck.email.orderCount24h} orders in 24h`
      });
    }

    if (data.velocityCheck.ip.vpnDetected) {
      factors.push({
        category: 'device',
        factor: 'vpn_detected',
        severity: 'medium',
        impact: 100,
        description: 'VPN or proxy usage detected'
      });
    }

    // Device factors
    if (data.deviceFingerprint.useCount === 1) {
      factors.push({
        category: 'device',
        factor: 'new_device',
        severity: 'low',
        impact: 50,
        description: 'First time seeing this device'
      });
    }

    // Geographic factors
    const countries = new Set(data.deviceFingerprint.locations.map((l: any) => l.country));
    if (countries.size > 2) {
      factors.push({
        category: 'geographic',
        factor: 'multiple_countries',
        severity: 'high',
        impact: 150,
        description: `Device used from ${countries.size} different countries`
      });
    }

    return factors.sort((a, b) => b.impact - a.impact);
  }

  private generateRecommendedActions(riskLevel: string, riskFactors: any[]): FraudRiskAssessment['actions'] {
    const actions: FraudRiskAssessment['actions'] = [];

    switch (riskLevel) {
      case 'very_high':
        actions.push({
          type: 'decline',
          reason: 'Extremely high fraud risk detected',
          priority: 'high',
          automated: true
        });
        break;

      case 'high':
        actions.push({
          type: 'manual_review',
          reason: 'High risk transaction requires manual review',
          priority: 'high',
          automated: false
        });
        break;

      case 'medium':
        actions.push({
          type: 'review',
          reason: 'Additional verification recommended',
          priority: 'medium',
          automated: false
        });
        break;

      case 'low':
        actions.push({
          type: 'monitor',
          reason: 'Low risk but continue monitoring',
          priority: 'low',
          automated: true
        });
        break;

      default:
        actions.push({
          type: 'approve',
          reason: 'Very low fraud risk',
          priority: 'low',
          automated: true
        });
    }

    // Add specific actions based on risk factors
    const criticalFactors = riskFactors.filter(f => f.severity === 'critical');
    if (criticalFactors.length > 0) {
      actions.push({
        type: 'flag',
        reason: `Critical risk factors detected: ${criticalFactors.map(f => f.factor).join(', ')}`,
        priority: 'high',
        automated: true
      });
    }

    return actions;
  }

  // Utility methods
  private calculateCustomerAge(createdAt: string): number {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000));
  }

  private calculateDistanceKm(location1: any, location2: any): number {
    // Simplified distance calculation
    return Math.floor(Math.random() * 1000);
  }

  private isHighRiskCountry(country: string): boolean {
    const highRiskCountries = ['NG', 'GH', 'PK', 'BD', 'MM', 'KH'];
    return highRiskCountries.includes(country);
  }

  private isHighRiskBIN(bin: string): boolean {
    const highRiskBINs = ['4000', '4111', '5555'];
    return highRiskBINs.some(risk => bin.startsWith(risk));
  }

  private calculateDeviceRiskScore(device: DeviceFingerprint): number {
    let risk = 0;
    
    if (device.useCount === 1) risk += 20;
    if (device.locations.length > 10) risk += 40;
    
    const countries = new Set(device.locations.map(l => l.country));
    if (countries.size > 3) risk += 60;
    
    return Math.min(risk, 100);
  }

  private calculateOrderValueStdDev(customer: any): number {
    return customer.totalSpent * 0.3; // Simplified
  }

  private async getChargebackHistory(email: string): Promise<number> {
    return Math.random() < 0.02 ? 1 : 0;
  }

  private async getDisputeHistory(email: string): Promise<number> {
    return Math.random() < 0.05 ? 1 : 0;
  }

  private async getCardCountry(cardLast4: string): Promise<string> {
    return 'US'; // Simplified
  }

  private async getCardType(cardLast4: string): Promise<'credit' | 'debit' | 'prepaid'> {
    return ['credit', 'debit', 'prepaid'][Math.floor(Math.random() * 3)] as any;
  }

  private async getBINRiskLevel(cardLast4: string): Promise<'low' | 'medium' | 'high'> {
    return ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any;
  }

  private calculateEmailRisk(email: string): number {
    const domain = email.split('@')[1]?.toLowerCase();
    const suspiciousDomains = ['tempmail.org', '10minutemail.com'];
    return suspiciousDomains.includes(domain) ? 80 : 10;
  }

  private calculateModelConfidence(factors: ChargebackRiskFactors): number {
    // Higher confidence with more complete data
    let confidence = 0.6;
    
    if (factors.totalOrders > 0) confidence += 0.1;
    if (factors.chargebackHistory >= 0) confidence += 0.1;
    if (factors.distanceKm >= 0) confidence += 0.1;
    if (factors.customerAge > 0) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private createFailsafeAssessment(processingTime: number): FraudRiskAssessment {
    return {
      overallScore: 500,
      riskLevel: 'medium',
      recommendation: 'review',
      velocityScore: 250,
      deviceScore: 250,
      geographicScore: 0,
      paymentScore: 0,
      chargebackScore: 0,
      riskFactors: [{
        category: 'behavioral',
        factor: 'assessment_error',
        severity: 'medium',
        impact: 500,
        description: 'Unable to complete full fraud assessment'
      }],
      velocityCheck: {} as any,
      deviceFingerprint: {} as any,
      chargebackLikelihood: {
        probability: 0.05,
        riskBand: 'C',
        expectedLoss: 0,
        confidence: 0.3,
        factors: {} as any
      },
      actions: [{
        type: 'review',
        reason: 'Manual review required due to assessment error',
        priority: 'medium',
        automated: false
      }],
      processingTime,
      timestamp: new Date().toISOString()
    };
  }

  private initializeBlacklists(): void {
    // Initialize fraud detection blacklists and rules
    console.log('Initializing fraud detection blacklists...');
  }

  private startCleanupTasks(): void {
    // Clean up old data periodically
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }

  private cleanupOldData(): void {
    // Remove old device fingerprints and velocity data
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days
    
    for (const [id, device] of this.deviceFingerprints.entries()) {
      if (new Date(device.lastSeen).getTime() < cutoff) {
        this.deviceFingerprints.delete(id);
      }
    }
  }

  private async storeAssessment(assessment: FraudRiskAssessment, orderData: any): Promise<void> {
    // In production, store in database for ML training
    console.log(`Stored fraud assessment ${assessment.overallScore} for order`);
  }
}

// Singleton instance
export const advancedFraudDetection = new AdvancedFraudDetectionEngine();

// Utility functions
export function generateDeviceFingerprint(options: {
  includeCanvas?: boolean;
  includeWebGL?: boolean;
  includeFonts?: boolean;
} = {}): Promise<any> {
  return new Promise((resolve) => {
    const deviceData: any = {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage
    };

    // Canvas fingerprinting
    if (options.includeCanvas !== false) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillText('Device fingerprinting test 123!@#', 2, 2);
          deviceData.canvas = canvas.toDataURL().slice(-50); // Last 50 chars
        }
      } catch (e) {
        deviceData.canvas = '';
      }
    }

    // WebGL fingerprinting
    if (options.includeWebGL !== false) {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const info = gl.getExtension('WEBGL_debug_renderer_info');
          if (info) {
            deviceData.webgl = (gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '').slice(0, 50);
          }
        }
      } catch (e) {
        deviceData.webgl = '';
      }
    }

    // Font detection
    if (options.includeFonts !== false) {
      deviceData.fonts = [
        'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana',
        'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
      ]; // Simplified font list
    }

    // Plugin detection
    deviceData.plugins = Array.from(navigator.plugins || []).map(p => p.name).slice(0, 10);

    resolve(deviceData);
  });
}

export function createFraudAssessmentSummary(assessment: FraudRiskAssessment): string {
  const risk = assessment.riskLevel.replace('_', ' ').toUpperCase();
  const score = assessment.overallScore;
  const factors = assessment.riskFactors.length;
  
  return `${risk} RISK (${score}/1000) - ${factors} risk factors identified`;
}