'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsCard, StatCard } from '../../shared';
import {
  Smartphone,
  Activity,
  AlertTriangle,
  Lock,
  Database,
  Flag,
  MapPin,
  Timer,
} from 'lucide-react';

interface DeviceAnalyticsTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export function DeviceAnalyticsTab({ data: deviceAnalytics, loading }: DeviceAnalyticsTabProps) {
  if (loading || !deviceAnalytics) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Device Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Devices"
          value={deviceAnalytics.overview.totalDevices}
          icon={Smartphone}
          iconColor="text-blue-600"
        />
        
        <MetricsCard
          title="New Devices"
          value={deviceAnalytics.overview.newDevices}
          subtitle={formatPercentage(
            (deviceAnalytics.overview.newDevices /
              deviceAnalytics.overview.totalDevices) *
              100,
          )}
          icon={Activity}
          iconColor="text-green-600"
        />
        
        <MetricsCard
          title="High Risk Devices"
          value={deviceAnalytics.overview.highRiskDevices}
          subtitle={formatPercentage(
            (deviceAnalytics.overview.highRiskDevices /
              deviceAnalytics.overview.totalDevices) *
              100,
          )}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        
        <MetricsCard
          title="Blocked Devices"
          value={deviceAnalytics.overview.blockedDevices}
          subtitle="Auto-blocked"
          icon={Lock}
          iconColor="text-gray-600"
        />
      </div>

      {/* Fingerprinting Quality & Risk Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Fingerprint Quality"
          icon={Database}
          stats={[
            {
              label: "High Quality",
              value: deviceAnalytics.fingerprinting.fingerprintQuality.high,
              className: "text-green-600"
            },
            {
              label: "Medium Quality",
              value: deviceAnalytics.fingerprinting.fingerprintQuality.medium,
              className: "text-yellow-600"
            },
            {
              label: "Low Quality",
              value: deviceAnalytics.fingerprinting.fingerprintQuality.low,
              className: "text-red-600"
            },
            {
              label: "Duplicate Fingerprints",
              value: deviceAnalytics.fingerprinting.duplicateFingerprints,
              className: "text-orange-600"
            }
          ]}
        />

        <StatCard
          title="Risk Patterns"
          icon={Flag}
          stats={[
            {
              label: "Multiple Locations",
              value: deviceAnalytics.patterns.multipleLocations
            },
            {
              label: "Rapid Location Changes",
              value: deviceAnalytics.patterns.rapidLocationChanges,
              highlight: true
            },
            {
              label: "Suspicious User Agents",
              value: deviceAnalytics.patterns.suspiciousUserAgents,
              className: "text-orange-600"
            },
            {
              label: "Tampering Attempts",
              value: deviceAnalytics.patterns.tamperingAttempts,
              highlight: true
            }
          ]}
        />
      </div>

      {/* Top Risky Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Top Risky Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deviceAnalytics.topRiskyDevices.map(
              (device: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">
                        {device.riskScore}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Device {device.deviceId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {device.userAgent}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {device.orderCount} orders
                      </div>
                      <div className="text-muted-foreground">
                        {device.lastSeen}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {device.isVPN && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                          VPN
                        </Badge>
                      )}
                      {device.isProxy && (
                        <Badge variant="destructive" className="text-xs">
                          Proxy
                        </Badge>
                      )}
                      {device.locationChanges > 3 && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {device.locationChanges}
                        </Badge>
                      )}
                      {device.isHighVelocity && (
                        <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                          <Timer className="h-3 w-3 mr-1" />
                          High Velocity
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}