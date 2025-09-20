import type { Order } from './orders';

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  growth: {
    mrrGrowth: number;
    arrGrowth: number;
    monthOverMonth: number;
    quarterOverQuarter: number;
    yearOverYear: number;
  };
  trends: Array<{
    period: string;
    revenue: number;
    newCustomers: number;
    churnedRevenue: number;
    expansionRevenue: number;
  }>;
}

export type CustomerSegment = 'high_value' | 'medium_value' | 'low_value' | 'at_risk';

export interface CustomerLifetimeValue {
  customerId: string;
  email: string;
  ltv: number;
  segment: CustomerSegment;
  riskScore: number;
  [key: string]: unknown;
}

export interface CohortRetention {
  month1: number;
  month3: number;
  month6: number;
  month12: number;
  month24: number;
}

export interface CohortAnalysis {
  cohortMonth: string;
  cohortSize: number;
  retentionRates: CohortRetention;
  revenueRetention: CohortRetention;
  totalRevenue: number;
  [key: string]: unknown;
}

export interface ChurnPrediction {
  customerId: string;
  email: string;
  churnProbability: number;
  churnRisk: 'low' | 'medium' | 'high' | 'critical';
  [key: string]: unknown;
}

export interface RevenueLeakage {
  type: 'churn' | 'downgrades' | 'failed_payments' | 'refunds';
  amount: number;
  percentage: number;
  affectedCustomers: number;
  [key: string]: unknown;
}

export interface RevenueIntelligenceSnapshot {
  revenueMetrics: RevenueMetrics;
  customerLTV: CustomerLifetimeValue[];
  cohortAnalysis: CohortAnalysis[];
  churnPredictions: ChurnPrediction[];
  revenueLeakage: RevenueLeakage[];
}

export declare function generateRevenueIntelligence(
  orders: Order[],
): RevenueIntelligenceSnapshot;
