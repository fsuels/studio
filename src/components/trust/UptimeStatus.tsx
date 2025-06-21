'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  TrendingUp
} from 'lucide-react';

interface StatusData {
  status: {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
  };
  incidents: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    impact: string;
  }>;
  overall_uptime: {
    uptime_percentage: number;
  };
  components: Array<{
    id: string;
    name: string;
    status: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage';
  }>;
}

export function UptimeStatus() {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatusData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatusData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatusData = async () => {
    try {
      // For demo purposes, we'll use mock data
      // In production, you would fetch from your actual Statuspage API
      // const response = await fetch('https://123legaldoc.statuspage.io/api/v2/summary.json');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: StatusData = {
        status: {
          indicator: 'none',
          description: 'All Systems Operational'
        },
        incidents: [],
        overall_uptime: {
          uptime_percentage: 99.97
        },
        components: [
          { id: '1', name: 'Website', status: 'operational' },
          { id: '2', name: 'Document Generation API', status: 'operational' },
          { id: '3', name: 'User Authentication', status: 'operational' },
          { id: '4', name: 'Payment Processing', status: 'operational' },
          { id: '5', name: 'AI Services', status: 'operational' }
        ]
      };

      setStatusData(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch status data');
      console.error('Status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'none':
        return 'text-green-600 bg-green-100';
      case 'degraded_performance':
      case 'minor':
        return 'text-yellow-600 bg-yellow-100';
      case 'partial_outage':
      case 'major':
        return 'text-orange-600 bg-orange-100';
      case 'major_outage':
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'none':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'degraded_performance':
      case 'minor':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse" />
            <CardTitle>System Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !statusData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>System Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load status data. Please check our status page directly.
          </p>
          <Button variant="outline" size="sm" className="mt-3">
            <ExternalLink className="h-4 w-4" />
            View Status Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>System Status</CardTitle>
          </div>
          <Badge className={getStatusColor(statusData.status.indicator)}>
            {getStatusIcon(statusData.status.indicator)}
            {statusData.status.description}
          </Badge>
        </div>
        <CardDescription>
          Real-time status of all 123LegalDoc services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Uptime */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium">30-Day Uptime</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            {statusData.overall_uptime.uptime_percentage}%
          </span>
        </div>

        {/* Component Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Service Components</h4>
          {statusData.components.map((component) => (
            <div key={component.id} className="flex items-center justify-between py-2">
              <span className="text-sm">{component.name}</span>
              <Badge variant="secondary" className={getStatusColor(component.status)}>
                {getStatusIcon(component.status)}
                {component.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>

        {/* Recent Incidents */}
        {statusData.incidents.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Incidents</h4>
            {statusData.incidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{incident.name}</span>
                  <Badge variant="outline" className={getStatusColor(incident.impact)}>
                    {incident.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(incident.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No incidents in the past 30 days
            </p>
          </div>
        )}

        {/* Status Page Link */}
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="h-4 w-4" />
          View Full Status Page
        </Button>
      </CardContent>
    </Card>
  );
}