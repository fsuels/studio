'use client';

import React from 'react';
import { ChartCard } from '../../shared';
import { Calendar, TrendingUp } from 'lucide-react';

interface CohortAnalysisTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export function CohortAnalysisTab({ data: cohortAnalysis, loading }: CohortAnalysisTabProps) {
  if (loading || !cohortAnalysis) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChartCard
        title="Cohort Retention Analysis"
        icon={Calendar}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Cohort</th>
                <th className="text-center p-2">Month 0</th>
                <th className="text-center p-2">Month 1</th>
                <th className="text-center p-2">Month 3</th>
                <th className="text-center p-2">Month 6</th>
                <th className="text-center p-2">Month 12</th>
              </tr>
            </thead>
            <tbody>
              {cohortAnalysis.cohorts.map((cohort: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{cohort.period}</td>
                  <td className="text-center p-2">100%</td>
                  <td className="text-center p-2">{formatPercentage(cohort.month1)}</td>
                  <td className="text-center p-2">{formatPercentage(cohort.month3)}</td>
                  <td className="text-center p-2">{formatPercentage(cohort.month6)}</td>
                  <td className="text-center p-2">{formatPercentage(cohort.month12)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <ChartCard
        title="Retention Insights"
        icon={TrendingUp}
      >
        <div className="space-y-3">
          {cohortAnalysis.insights.map((insight: string, index: number) => (
            <div key={index} className="p-3 bg-blue-50 rounded border border-blue-200">
              {insight}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}