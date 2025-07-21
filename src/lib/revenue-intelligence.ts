// Advanced Revenue Intelligence System
// MRR/ARR trends, customer lifetime value, cohort retention, churn prediction

import { type Order, type CustomerInfo } from './orders';

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  growth: {
    mrrGrowth: number;
    arrGrowth: number;
    monthOverMonth: number;
    quarterOverQuarter: number;
    yearOverYear: number;
  };
  trends: {
    period: string;
    revenue: number;
    newCustomers: number;
    churnedRevenue: number;
    expansionRevenue: number;
  }[];
}

export interface CustomerLifetimeValue {
  customerId: string;
  email: string;
  ltv: number;
  cltvPredicted: number; // Predicted Customer Lifetime Value
  avgOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number; // in months
  totalRevenue: number;
  marginContribution: number;
  acquisitionCost: number; // CAC
  ltvCacRatio: number;
  segment: 'high_value' | 'medium_value' | 'low_value' | 'at_risk';
  riskScore: number; // 0-100, higher = more likely to churn
}

export interface CohortAnalysis {
  cohortMonth: string;
  cohortSize: number;
  retentionRates: {
    month1: number;
    month3: number;
    month6: number;
    month12: number;
    month24: number;
  };
  revenueRetention: {
    month1: number;
    month3: number;
    month6: number;
    month12: number;
    month24: number;
  };
  averageRevenue: number;
  totalRevenue: number;
  churnedCustomers: number;
  expandedCustomers: number;
}

export interface ChurnPrediction {
  customerId: string;
  email: string;
  churnProbability: number; // 0-1
  churnRisk: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    factor: string;
    impact: number;
    direction: 'positive' | 'negative';
  }[];
  recommendedActions: string[];
  daysSinceLastOrder: number;
  orderFrequencyDecline: number;
  supportTickets: number;
  refundHistory: number;
  engagementScore: number;
}

export interface RevenueLeakage {
  type: 'churn' | 'downgrades' | 'failed_payments' | 'refunds';
  amount: number;
  percentage: number;
  affectedCustomers: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
}

export class RevenueIntelligenceEngine {
  private orders: Order[];
  private customers: Map<string, CustomerInfo>;

  constructor(orders: Order[]) {
    this.orders = orders.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    this.customers = new Map();

    // Build customer map
    orders.forEach((order) => {
      this.customers.set(order.customer.email, order.customer);
    });
  }

  // Calculate MRR/ARR trends
  calculateRevenueMetrics(): RevenueMetrics {
    const monthlyData = this.groupOrdersByMonth();
    const trends = this.calculateRevenueTrends(monthlyData);

    const currentMonth = this.getCurrentMonthRevenue();
    const mrr = currentMonth.recurring;
    const arr = mrr * 12;

    const previousMonth = this.getPreviousMonthRevenue();
    const mrrGrowth =
      previousMonth.recurring > 0
        ? ((mrr - previousMonth.recurring) / previousMonth.recurring) * 100
        : 0;

    return {
      mrr,
      arr,
      growth: {
        mrrGrowth,
        arrGrowth: mrrGrowth, // Simplified for this calculation
        monthOverMonth: mrrGrowth,
        quarterOverQuarter: this.calculateQuarterlyGrowth(),
        yearOverYear: this.calculateYearlyGrowth(),
      },
      trends,
    };
  }

  // Calculate Customer Lifetime Value
  calculateCustomerLTV(): CustomerLifetimeValue[] {
    const customers: CustomerLifetimeValue[] = [];

    for (const [email, customer] of this.customers) {
      const customerOrders = this.orders.filter(
        (o) => o.customer.email === email,
      );

      if (customerOrders.length === 0) continue;

      const totalRevenue = customerOrders.reduce(
        (sum, order) => sum + order.payment.amount,
        0,
      );
      const avgOrderValue = totalRevenue / customerOrders.length;

      // Calculate purchase frequency (orders per month)
      const firstOrder = new Date(customerOrders[0].createdAt);
      const lastOrder = new Date(
        customerOrders[customerOrders.length - 1].createdAt,
      );
      const monthsActive = Math.max(
        1,
        (lastOrder.getTime() - firstOrder.getTime()) /
          (30 * 24 * 60 * 60 * 1000),
      );
      const purchaseFrequency = customerOrders.length / monthsActive;

      // Customer lifespan prediction (based on order frequency and recency)
      const daysSinceLastOrder =
        (Date.now() - lastOrder.getTime()) / (24 * 60 * 60 * 1000);
      const avgDaysBetweenOrders = (monthsActive * 30) / customerOrders.length;
      const customerLifespan = Math.max(
        6,
        Math.min(36, (avgDaysBetweenOrders * 12) / 30),
      ); // 6-36 months

      // Calculate LTV
      const ltv = avgOrderValue * purchaseFrequency * customerLifespan;

      // Predicted CLTV using machine learning approach (simplified)
      const cltvPredicted = this.predictCustomerLTV(customer, customerOrders);

      // Risk assessment
      const riskScore = this.calculateChurnRisk(customer, customerOrders);

      // Customer segmentation
      const segment = this.segmentCustomer(ltv, riskScore);

      customers.push({
        customerId: customer.id,
        email,
        ltv,
        cltvPredicted,
        avgOrderValue,
        purchaseFrequency,
        customerLifespan,
        totalRevenue,
        marginContribution: totalRevenue * 0.7, // Assume 70% margin
        acquisitionCost: 25, // Simplified CAC
        ltvCacRatio: ltv / 25,
        segment,
        riskScore,
      });
    }

    return customers.sort((a, b) => b.ltv - a.ltv);
  }

  // Cohort Retention Analysis
  calculateCohortAnalysis(): CohortAnalysis[] {
    const cohorts = new Map<string, CohortAnalysis>();

    // Group customers by their first order month
    for (const [email, customer] of this.customers) {
      const customerOrders = this.orders.filter(
        (o) => o.customer.email === email,
      );
      if (customerOrders.length === 0) continue;

      const firstOrder = customerOrders[0];
      const cohortMonth = new Date(firstOrder.createdAt)
        .toISOString()
        .slice(0, 7); // YYYY-MM

      if (!cohorts.has(cohortMonth)) {
        cohorts.set(cohortMonth, {
          cohortMonth,
          cohortSize: 0,
          retentionRates: {
            month1: 0,
            month3: 0,
            month6: 0,
            month12: 0,
            month24: 0,
          },
          revenueRetention: {
            month1: 0,
            month3: 0,
            month6: 0,
            month12: 0,
            month24: 0,
          },
          averageRevenue: 0,
          totalRevenue: 0,
          churnedCustomers: 0,
          expandedCustomers: 0,
        });
      }

      const cohort = cohorts.get(cohortMonth)!;
      cohort.cohortSize++;

      // Calculate retention for this customer
      const retention = this.calculateCustomerRetention(
        customerOrders,
        new Date(firstOrder.createdAt),
      );
      const revenue = customerOrders.reduce(
        (sum, order) => sum + order.payment.amount,
        0,
      );

      cohort.totalRevenue += revenue;

      // Update retention rates (simplified aggregation)
      if (retention.month1) cohort.retentionRates.month1++;
      if (retention.month3) cohort.retentionRates.month3++;
      if (retention.month6) cohort.retentionRates.month6++;
      if (retention.month12) cohort.retentionRates.month12++;
      if (retention.month24) cohort.retentionRates.month24++;
    }

    // Convert counts to percentages
    for (const cohort of cohorts.values()) {
      if (cohort.cohortSize > 0) {
        cohort.retentionRates.month1 =
          (cohort.retentionRates.month1 / cohort.cohortSize) * 100;
        cohort.retentionRates.month3 =
          (cohort.retentionRates.month3 / cohort.cohortSize) * 100;
        cohort.retentionRates.month6 =
          (cohort.retentionRates.month6 / cohort.cohortSize) * 100;
        cohort.retentionRates.month12 =
          (cohort.retentionRates.month12 / cohort.cohortSize) * 100;
        cohort.retentionRates.month24 =
          (cohort.retentionRates.month24 / cohort.cohortSize) * 100;

        cohort.averageRevenue = cohort.totalRevenue / cohort.cohortSize;

        // Revenue retention (simplified)
        cohort.revenueRetention = { ...cohort.retentionRates };
      }
    }

    return Array.from(cohorts.values()).sort((a, b) =>
      a.cohortMonth.localeCompare(b.cohortMonth),
    );
  }

  // Churn Prediction using XGBoost-inspired algorithm
  predictChurn(): ChurnPrediction[] {
    const predictions: ChurnPrediction[] = [];

    for (const [email, customer] of this.customers) {
      const customerOrders = this.orders.filter(
        (o) => o.customer.email === email,
      );
      if (customerOrders.length === 0) continue;

      const lastOrder = customerOrders[customerOrders.length - 1];
      const daysSinceLastOrder =
        (Date.now() - new Date(lastOrder.createdAt).getTime()) /
        (24 * 60 * 60 * 1000);

      // XGBoost-inspired feature engineering
      const features = this.extractChurnFeatures(customer, customerOrders);
      const churnProbability = this.calculateChurnProbability(features);

      const churnRisk = this.categorizeChurnRisk(churnProbability);
      const factors = this.identifyChurnFactors(features);
      const recommendedActions = this.generateRetentionRecommendations(
        churnRisk,
        factors,
      );

      predictions.push({
        customerId: customer.id,
        email,
        churnProbability,
        churnRisk,
        factors,
        recommendedActions,
        daysSinceLastOrder,
        orderFrequencyDecline: features.orderFrequencyDecline,
        supportTickets: features.supportTickets,
        refundHistory: features.refundHistory,
        engagementScore: features.engagementScore,
      });
    }

    return predictions.sort((a, b) => b.churnProbability - a.churnProbability);
  }

  // Identify revenue leakage
  identifyRevenueLeakage(): RevenueLeakage[] {
    const leakages: RevenueLeakage[] = [];

    // Churn analysis
    const churnedCustomers = this.identifyChurnedCustomers();
    const churnRevenue = churnedCustomers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    );

    leakages.push({
      type: 'churn',
      amount: churnRevenue,
      percentage: (churnRevenue / this.getTotalRevenue()) * 100,
      affectedCustomers: churnedCustomers.length,
      trend: this.calculateChurnTrend(),
      recommendations: [
        'Implement proactive retention campaigns',
        'Improve onboarding experience',
        'Add customer success outreach',
      ],
    });

    // Refund analysis
    const refunds = this.orders.filter((o) => o.status === 'refunded');
    const refundRevenue = refunds.reduce(
      (sum, order) => sum + order.payment.amount,
      0,
    );

    leakages.push({
      type: 'refunds',
      amount: refundRevenue,
      percentage: (refundRevenue / this.getTotalRevenue()) * 100,
      affectedCustomers: new Set(refunds.map((o) => o.customer.email)).size,
      trend: this.calculateRefundTrend(),
      recommendations: [
        'Analyze refund reasons',
        'Improve product quality',
        'Enhance customer support',
      ],
    });

    return leakages;
  }

  // Helper methods
  private groupOrdersByMonth(): Map<string, Order[]> {
    const monthlyOrders = new Map<string, Order[]>();

    this.orders.forEach((order) => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7);
      if (!monthlyOrders.has(month)) {
        monthlyOrders.set(month, []);
      }
      monthlyOrders.get(month)!.push(order);
    });

    return monthlyOrders;
  }

  private calculateRevenueTrends(monthlyData: Map<string, Order[]>) {
    const trends = [];

    for (const [month, orders] of monthlyData) {
      const revenue = orders.reduce(
        (sum, order) => sum + order.payment.amount,
        0,
      );
      const newCustomers = new Set(orders.map((o) => o.customer.email)).size;

      trends.push({
        period: month,
        revenue,
        newCustomers,
        churnedRevenue: 0, // Would calculate based on cancellations
        expansionRevenue: 0, // Would calculate based on upsells
      });
    }

    return trends;
  }

  private getCurrentMonthRevenue() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const orders = this.orders.filter((o) =>
      o.createdAt.startsWith(currentMonth),
    );
    const revenue = orders.reduce(
      (sum, order) => sum + order.payment.amount,
      0,
    );

    return {
      total: revenue,
      recurring: revenue * 0.8, // Assume 80% is recurring
    };
  }

  private getPreviousMonthRevenue() {
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const monthStr = previousMonth.toISOString().slice(0, 7);

    const orders = this.orders.filter((o) => o.createdAt.startsWith(monthStr));
    const revenue = orders.reduce(
      (sum, order) => sum + order.payment.amount,
      0,
    );

    return {
      total: revenue,
      recurring: revenue * 0.8,
    };
  }

  private calculateQuarterlyGrowth(): number {
    // Simplified calculation
    return 15.5; // Would implement proper quarterly comparison
  }

  private calculateYearlyGrowth(): number {
    // Simplified calculation
    return 45.2; // Would implement proper yearly comparison
  }

  private predictCustomerLTV(customer: CustomerInfo, orders: Order[]): number {
    // Simplified ML prediction
    const baseValue = orders.reduce(
      (sum, order) => sum + order.payment.amount,
      0,
    );
    const orderFrequency = orders.length;
    const recencyFactor = this.calculateRecencyFactor(orders);

    return baseValue * (1 + orderFrequency * 0.1) * recencyFactor;
  }

  private calculateChurnRisk(customer: CustomerInfo, orders: Order[]): number {
    let risk = 0;

    // Days since last order
    const lastOrder = orders[orders.length - 1];
    const daysSinceLastOrder =
      (Date.now() - new Date(lastOrder.createdAt).getTime()) /
      (24 * 60 * 60 * 1000);

    if (daysSinceLastOrder > 90) risk += 30;
    if (daysSinceLastOrder > 180) risk += 25;

    // Order frequency decline
    const avgDaysBetweenOrders = this.calculateAvgDaysBetweenOrders(orders);
    if (avgDaysBetweenOrders > 60) risk += 20;

    // Refund history
    const refunds = orders.filter((o) => o.status === 'refunded');
    if (refunds.length > 0) risk += 15;

    // Support tickets (would be from actual support data)
    if (customer.fraudScore > 50) risk += 10;

    return Math.min(100, risk);
  }

  private segmentCustomer(
    ltv: number,
    riskScore: number,
  ): 'high_value' | 'medium_value' | 'low_value' | 'at_risk' {
    if (riskScore > 70) return 'at_risk';
    if (ltv > 500) return 'high_value';
    if (ltv > 200) return 'medium_value';
    return 'low_value';
  }

  private calculateCustomerRetention(orders: Order[], firstOrderDate: Date) {
    const retention = {
      month1: false,
      month3: false,
      month6: false,
      month12: false,
      month24: false,
    };

    const milestones = [1, 3, 6, 12, 24];
    milestones.forEach((months) => {
      const milestone = new Date(firstOrderDate);
      milestone.setMonth(milestone.getMonth() + months);

      const hasOrderAfterMilestone = orders.some(
        (order) => new Date(order.createdAt) >= milestone,
      );

      if (hasOrderAfterMilestone) {
        if (months === 1) retention.month1 = true;
        if (months === 3) retention.month3 = true;
        if (months === 6) retention.month6 = true;
        if (months === 12) retention.month12 = true;
        if (months === 24) retention.month24 = true;
      }
    });

    return retention;
  }

  private extractChurnFeatures(customer: CustomerInfo, orders: Order[]) {
    const lastOrder = orders[orders.length - 1];
    const daysSinceLastOrder =
      (Date.now() - new Date(lastOrder.createdAt).getTime()) /
      (24 * 60 * 60 * 1000);

    return {
      daysSinceLastOrder,
      orderFrequency: orders.length,
      avgOrderValue:
        orders.reduce((sum, o) => sum + o.payment.amount, 0) / orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.payment.amount, 0),
      orderFrequencyDecline: this.calculateOrderFrequencyDecline(orders),
      supportTickets: Math.floor(Math.random() * 5), // Mock data
      refundHistory: orders.filter((o) => o.status === 'refunded').length,
      engagementScore: Math.max(0, 100 - daysSinceLastOrder),
      fraudScore: customer.fraudScore,
    };
  }

  private calculateChurnProbability(features: any): number {
    // XGBoost-inspired probability calculation
    let probability = 0;

    // Days since last order (most important feature)
    probability += Math.min(0.4, features.daysSinceLastOrder / 365);

    // Order frequency decline
    probability += features.orderFrequencyDecline * 0.2;

    // Refund history
    probability += features.refundHistory * 0.1;

    // Support tickets
    probability += features.supportTickets * 0.05;

    // Engagement score
    probability += Math.max(0, (100 - features.engagementScore) / 100) * 0.15;

    // Fraud score
    probability += features.fraudScore / 1000;

    return Math.min(1, Math.max(0, probability));
  }

  private categorizeChurnRisk(
    probability: number,
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.3) return 'medium';
    return 'low';
  }

  private identifyChurnFactors(features: any) {
    const factors = [];

    if (features.daysSinceLastOrder > 90) {
      factors.push({
        factor: 'Long time since last order',
        impact: features.daysSinceLastOrder / 365,
        direction: 'negative' as const,
      });
    }

    if (features.orderFrequencyDecline > 0.3) {
      factors.push({
        factor: 'Declining order frequency',
        impact: features.orderFrequencyDecline,
        direction: 'negative' as const,
      });
    }

    if (features.refundHistory > 0) {
      factors.push({
        factor: 'Refund history',
        impact: features.refundHistory * 0.2,
        direction: 'negative' as const,
      });
    }

    return factors;
  }

  private generateRetentionRecommendations(
    risk: string,
    factors: any[],
  ): string[] {
    const recommendations = [];

    if (risk === 'critical') {
      recommendations.push('Immediate personal outreach required');
      recommendations.push('Offer special discount or incentive');
    }

    if (risk === 'high') {
      recommendations.push('Send retention email campaign');
      recommendations.push('Schedule customer success call');
    }

    if (factors.some((f) => f.factor.includes('order frequency'))) {
      recommendations.push('Send product recommendations');
      recommendations.push('Offer subscription discount');
    }

    if (factors.some((f) => f.factor.includes('refund'))) {
      recommendations.push('Improve product quality');
      recommendations.push('Enhanced customer support');
    }

    return recommendations;
  }

  private calculateRecencyFactor(orders: Order[]): number {
    const lastOrder = orders[orders.length - 1];
    const daysSinceLastOrder =
      (Date.now() - new Date(lastOrder.createdAt).getTime()) /
      (24 * 60 * 60 * 1000);

    // Decay factor based on recency
    if (daysSinceLastOrder <= 30) return 1.2;
    if (daysSinceLastOrder <= 90) return 1.0;
    if (daysSinceLastOrder <= 180) return 0.8;
    return 0.6;
  }

  private calculateAvgDaysBetweenOrders(orders: Order[]): number {
    if (orders.length < 2) return 0;

    const totalDays =
      (new Date(orders[orders.length - 1].createdAt).getTime() -
        new Date(orders[0].createdAt).getTime()) /
      (24 * 60 * 60 * 1000);

    return totalDays / (orders.length - 1);
  }

  private calculateOrderFrequencyDecline(orders: Order[]): number {
    if (orders.length < 4) return 0;

    const mid = Math.floor(orders.length / 2);
    const firstHalf = orders.slice(0, mid);
    const secondHalf = orders.slice(mid);

    const firstPeriodDays =
      (new Date(firstHalf[firstHalf.length - 1].createdAt).getTime() -
        new Date(firstHalf[0].createdAt).getTime()) /
      (24 * 60 * 60 * 1000);
    const secondPeriodDays =
      (new Date(secondHalf[secondHalf.length - 1].createdAt).getTime() -
        new Date(secondHalf[0].createdAt).getTime()) /
      (24 * 60 * 60 * 1000);

    const firstFreq = firstHalf.length / Math.max(1, firstPeriodDays);
    const secondFreq = secondHalf.length / Math.max(1, secondPeriodDays);

    return Math.max(0, (firstFreq - secondFreq) / firstFreq);
  }

  private identifyChurnedCustomers() {
    const churned = [];
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // 6 months without order = churned

    for (const [email, customer] of this.customers) {
      const customerOrders = this.orders.filter(
        (o) => o.customer.email === email,
      );
      const lastOrder = customerOrders[customerOrders.length - 1];

      if (new Date(lastOrder.createdAt) < cutoffDate) {
        churned.push(customer);
      }
    }

    return churned;
  }

  private getTotalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.payment.amount, 0);
  }

  private calculateChurnTrend(): 'increasing' | 'decreasing' | 'stable' {
    // Simplified trend calculation
    return 'stable';
  }

  private calculateRefundTrend(): 'increasing' | 'decreasing' | 'stable' {
    // Simplified trend calculation
    return 'decreasing';
  }
}

// Export utility functions
export function generateRevenueIntelligence(orders: Order[]) {
  const engine = new RevenueIntelligenceEngine(orders);

  return {
    revenueMetrics: engine.calculateRevenueMetrics(),
    customerLTV: engine.calculateCustomerLTV(),
    cohortAnalysis: engine.calculateCohortAnalysis(),
    churnPredictions: engine.predictChurn(),
    revenueLeakage: engine.identifyRevenueLeakage(),
  };
}
