'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '../../shared';
import {
  Users,
  Globe,
  Smartphone,
  CreditCard,
} from 'lucide-react';

interface VelocityAnalysisTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export function VelocityAnalysisTab({ data: velocityAnalytics, loading }: VelocityAnalysisTabProps) {
  if (loading || !velocityAnalytics) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Velocity */}
        <StatCard
          title="Email Velocity Analysis"
          icon={Users}
          stats={[
            {
              label: "High Velocity Emails",
              value: velocityAnalytics.emailVelocity.highVelocityEmails
            },
            {
              label: "Avg Orders per Email",
              value: velocityAnalytics.emailVelocity.avgOrdersPerEmail
            },
            {
              label: "Max Orders per Email",
              value: velocityAnalytics.emailVelocity.maxOrdersPerEmail,
              highlight: true
            }
          ]}
        >
          <div className="mt-4">
            <h4 className="font-medium mb-2">Suspicious Patterns</h4>
            <div className="space-y-2">
              {velocityAnalytics.emailVelocity.suspiciousPatterns.map(
                (pattern: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 bg-red-50 rounded border border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {pattern.email}
                      </span>
                      <Badge variant="destructive">
                        {pattern.riskScore}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.orderCount24h} orders,{' '}
                      {pattern.distinctIPs} IPs
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </StatCard>

        {/* IP Velocity */}
        <StatCard
          title="IP Velocity Analysis"
          icon={Globe}
          stats={[
            {
              label: "High Velocity IPs",
              value: velocityAnalytics.ipVelocity.highVelocityIPs
            },
            {
              label: "VPN Detections",
              value: velocityAnalytics.ipVelocity.vpnDetections,
              className: "text-orange-600"
            },
            {
              label: "Proxy Detections",
              value: velocityAnalytics.ipVelocity.proxyDetections,
              highlight: true
            }
          ]}
        >
          <div className="mt-4">
            <h4 className="font-medium mb-2">Suspicious Patterns</h4>
            <div className="space-y-2">
              {velocityAnalytics.ipVelocity.suspiciousPatterns.map(
                (pattern: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 bg-red-50 rounded border border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {pattern.ip}
                      </span>
                      <div className="flex items-center gap-2">
                        {pattern.vpnDetected && (
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200 text-xs"
                          >
                            VPN
                          </Badge>
                        )}
                        <Badge variant="destructive">
                          {pattern.riskScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.orderCount24h} orders,{' '}
                      {pattern.distinctEmails} emails
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </StatCard>

        {/* Device Velocity */}
        <StatCard
          title="Device Velocity Analysis"
          icon={Smartphone}
          stats={[
            {
              label: "High Velocity Devices",
              value: velocityAnalytics.deviceVelocity.highVelocityDevices
            },
            {
              label: "New Device Rate",
              value: formatPercentage(velocityAnalytics.deviceVelocity.newDeviceRate)
            }
          ]}
        >
          <div className="mt-4">
            <h4 className="font-medium mb-2">Suspicious Patterns</h4>
            <div className="space-y-2">
              {velocityAnalytics.deviceVelocity.suspiciousPatterns.map(
                (pattern: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 bg-yellow-50 rounded border border-yellow-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {pattern.deviceId}
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {pattern.riskScore}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.orderCount24h} orders,{' '}
                      {pattern.locationChanges} location changes
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </StatCard>

        {/* Card Velocity */}
        <StatCard
          title="Card Velocity Analysis"
          icon={CreditCard}
          stats={[
            {
              label: "High Velocity Cards",
              value: velocityAnalytics.cardVelocity.highVelocityCards
            },
            {
              label: "Chargeback Cards",
              value: velocityAnalytics.cardVelocity.chargebackCards,
              highlight: true
            }
          ]}
        >
          <div className="mt-4">
            <h4 className="font-medium mb-2">Suspicious Patterns</h4>
            <div className="space-y-2">
              {velocityAnalytics.cardVelocity.suspiciousPatterns.map(
                (pattern: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 bg-red-50 rounded border border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        ****{pattern.cardLast4}
                      </span>
                      <div className="flex items-center gap-2">
                        {pattern.chargebackHistory > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs"
                          >
                            CB History
                          </Badge>
                        )}
                        <Badge variant="destructive">
                          {pattern.riskScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.orderCount24h} orders
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </StatCard>
      </div>
    </div>
  );
}