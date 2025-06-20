'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Table, 
  Play, 
  Save, 
  Download,
  Plus,
  Trash2,
  Database,
  Filter,
  Eye
} from 'lucide-react';
import { ReportChart } from './ReportChart';
import { ReportTable } from './ReportTable';

interface DataSource {
  id: string;
  name: string;
  description: string;
  fields: DataField[];
  endpoint: string;
}

interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  label: string;
  description?: string;
}

interface Filter {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'starts_with' | 'between';
  value: any;
  value2?: any; // For 'between' operator
}

interface ReportConfig {
  id?: string;
  name: string;
  description: string;
  dataSource: string;
  filters: Filter[];
  groupBy: string[];
  aggregations: { field: string; function: 'count' | 'sum' | 'avg' | 'min' | 'max' }[];
  chartType: 'bar' | 'line' | 'pie' | 'table';
  timeRange?: {
    start: string;
    end: string;
  };
}

const DATA_SOURCES: DataSource[] = [
  {
    id: 'documents',
    name: 'Documents',
    description: 'Document creation, updates, and lifecycle data',
    endpoint: '/api/admin/reports/documents',
    fields: [
      { name: 'id', type: 'string', label: 'Document ID' },
      { name: 'type', type: 'string', label: 'Document Type' },
      { name: 'status', type: 'string', label: 'Status' },
      { name: 'created_at', type: 'date', label: 'Created Date' },
      { name: 'updated_at', type: 'date', label: 'Updated Date' },
      { name: 'user_id', type: 'string', label: 'User ID' },
      { name: 'is_signed', type: 'boolean', label: 'Is Signed' },
      { name: 'page_count', type: 'number', label: 'Page Count' }
    ]
  },
  {
    id: 'users',
    name: 'Users',
    description: 'User registration, activity, and engagement data',
    endpoint: '/api/admin/reports/users',
    fields: [
      { name: 'id', type: 'string', label: 'User ID' },
      { name: 'email', type: 'string', label: 'Email' },
      { name: 'created_at', type: 'date', label: 'Registration Date' },
      { name: 'last_login', type: 'date', label: 'Last Login' },
      { name: 'plan', type: 'string', label: 'Subscription Plan' },
      { name: 'document_count', type: 'number', label: 'Documents Created' },
      { name: 'is_verified', type: 'boolean', label: 'Email Verified' },
      { name: 'state', type: 'string', label: 'State' }
    ]
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'Payment transactions, revenue, and billing data',
    endpoint: '/api/admin/reports/payments',
    fields: [
      { name: 'id', type: 'string', label: 'Payment ID' },
      { name: 'amount', type: 'number', label: 'Amount' },
      { name: 'currency', type: 'string', label: 'Currency' },
      { name: 'status', type: 'string', label: 'Status' },
      { name: 'created_at', type: 'date', label: 'Payment Date' },
      { name: 'user_id', type: 'string', label: 'User ID' },
      { name: 'subscription_id', type: 'string', label: 'Subscription ID' },
      { name: 'payment_method', type: 'string', label: 'Payment Method' }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Events',
    description: 'Audit trails, compliance checks, and regulatory events',
    endpoint: '/api/admin/reports/compliance',
    fields: [
      { name: 'id', type: 'string', label: 'Event ID' },
      { name: 'type', type: 'string', label: 'Event Type' },
      { name: 'severity', type: 'string', label: 'Severity' },
      { name: 'created_at', type: 'date', label: 'Event Date' },
      { name: 'user_id', type: 'string', label: 'User ID' },
      { name: 'resource', type: 'string', label: 'Resource' },
      { name: 'action', type: 'string', label: 'Action' },
      { name: 'state', type: 'string', label: 'State' }
    ]
  }
];

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
  { id: 'line', name: 'Line Chart', icon: LineChart },
  { id: 'pie', name: 'Pie Chart', icon: PieChart },
  { id: 'table', name: 'Data Table', icon: Table }
];

const AGGREGATION_FUNCTIONS = [
  { id: 'count', name: 'Count' },
  { id: 'sum', name: 'Sum' },
  { id: 'avg', name: 'Average' },
  { id: 'min', name: 'Minimum' },
  { id: 'max', name: 'Maximum' }
];

const FILTER_OPERATORS = [
  { id: 'equals', name: 'Equals' },
  { id: 'not_equals', name: 'Not Equals' },
  { id: 'greater_than', name: 'Greater Than' },
  { id: 'less_than', name: 'Less Than' },
  { id: 'contains', name: 'Contains' },
  { id: 'starts_with', name: 'Starts With' },
  { id: 'between', name: 'Between' }
];

export function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dataSource: '',
    filters: [],
    groupBy: [],
    aggregations: [],
    chartType: 'bar'
  });
  
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);

  const selectedDataSource = DATA_SOURCES.find(ds => ds.id === config.dataSource);

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      // In a real implementation, this would load from the backend
      const mockReports: ReportConfig[] = [
        {
          id: 'report_1',
          name: 'Document Creation Trends',
          description: 'Track document creation over time by type',
          dataSource: 'documents',
          filters: [],
          groupBy: ['type', 'created_at'],
          aggregations: [{ field: 'id', function: 'count' }],
          chartType: 'line'
        },
        {
          id: 'report_2', 
          name: 'Revenue by Plan',
          description: 'Monthly revenue breakdown by subscription plan',
          dataSource: 'payments',
          filters: [{ id: '1', field: 'status', operator: 'equals', value: 'succeeded' }],
          groupBy: ['subscription_id'],
          aggregations: [{ field: 'amount', function: 'sum' }],
          chartType: 'pie'
        }
      ];
      setSavedReports(mockReports);
    } catch (err) {
      console.error('Error loading saved reports:', err);
    }
  };

  const executeReport = async () => {
    if (!config.dataSource || config.aggregations.length === 0) {
      setError('Please select a data source and at least one aggregation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the backend API
      // const response = await fetch('/api/admin/reports/execute', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // });
      // const data = await response.json();

      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData(config);
      setReportData(mockData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (config: ReportConfig) => {
    // Generate realistic mock data based on the configuration
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        period: date.toISOString().substring(0, 7), // YYYY-MM format
        value: Math.floor(Math.random() * 1000) + 100,
        category: ['Category A', 'Category B', 'Category C'][i % 3]
      });
    }
    
    return data.reverse();
  };

  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: selectedDataSource?.fields[0]?.name || '',
      operator: 'equals',
      value: ''
    };
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (filterId: string, updates: Partial<Filter>) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map(f => 
        f.id === filterId ? { ...f, ...updates } : f
      )
    }));
  };

  const removeFilter = (filterId: string) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  const addAggregation = () => {
    const newAggregation = {
      field: selectedDataSource?.fields.find(f => f.type === 'number')?.name || 'id',
      function: 'count' as const
    };
    setConfig(prev => ({
      ...prev,
      aggregations: [...prev.aggregations, newAggregation]
    }));
  };

  const updateAggregation = (index: number, updates: any) => {
    setConfig(prev => ({
      ...prev,
      aggregations: prev.aggregations.map((agg, i) => 
        i === index ? { ...agg, ...updates } : agg
      )
    }));
  };

  const removeAggregation = (index: number) => {
    setConfig(prev => ({
      ...prev,
      aggregations: prev.aggregations.filter((_, i) => i !== index)
    }));
  };

  const saveReport = async () => {
    if (!config.name) {
      setError('Please provide a report name');
      return;
    }

    try {
      // In a real implementation, this would save to the backend
      const reportWithId = {
        ...config,
        id: config.id || `report_${Date.now()}`
      };
      
      setSavedReports(prev => {
        const existing = prev.findIndex(r => r.id === reportWithId.id);
        if (existing >= 0) {
          return prev.map((r, i) => i === existing ? reportWithId : r);
        }
        return [...prev, reportWithId];
      });

      alert('Report saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadReport = (report: ReportConfig) => {
    setConfig(report);
    setReportData(null);
  };

  const exportReport = () => {
    if (!reportData) return;

    const csv = [
      ['Period', 'Value', 'Category'].join(','),
      ...reportData.map((row: any) => [row.period, row.value, row.category].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name || 'report'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Report Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create custom reports and visualizations from your data
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter report name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this report shows"
                  rows={2}
                />
              </div>

              {/* Data Source */}
              <div className="space-y-2">
                <Label>Data Source</Label>
                <Select value={config.dataSource} onValueChange={(value) => 
                  setConfig(prev => ({ ...prev, dataSource: value, filters: [], groupBy: [], aggregations: [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_SOURCES.map(source => (
                      <SelectItem key={source.id} value={source.id}>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">{source.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Type */}
              <div className="space-y-2">
                <Label>Chart Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CHART_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={config.chartType === type.id ? 'default' : 'outline'}
                        className="h-auto p-3 flex flex-col gap-1"
                        onClick={() => setConfig(prev => ({ ...prev, chartType: type.id as any }))}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{type.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{report.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadReport(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDataSource ? (
            <Tabs defaultValue="aggregations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="aggregations">Aggregations</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="grouping">Grouping</TabsTrigger>
              </TabsList>

              <TabsContent value="aggregations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Data Aggregations</CardTitle>
                      <Button variant="outline" size="sm" onClick={addAggregation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Aggregation
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {config.aggregations.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No aggregations configured. Add at least one to generate a report.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {config.aggregations.map((agg, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded">
                            <Select
                              value={agg.function}
                              onValueChange={(value) => updateAggregation(index, { function: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AGGREGATION_FUNCTIONS.map(func => (
                                  <SelectItem key={func.id} value={func.id}>
                                    {func.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={agg.field}
                              onValueChange={(value) => updateAggregation(index, { field: value })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedDataSource.fields.map(field => (
                                  <SelectItem key={field.name} value={field.name}>
                                    {field.label} ({field.type})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAggregation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Data Filters
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addFilter}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {config.filters.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No filters configured. Add filters to narrow down your data.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {config.filters.map(filter => (
                          <div key={filter.id} className="flex items-center gap-3 p-3 border rounded">
                            <Select
                              value={filter.field}
                              onValueChange={(value) => updateFilter(filter.id, { field: value })}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedDataSource.fields.map(field => (
                                  <SelectItem key={field.name} value={field.name}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={filter.operator}
                              onValueChange={(value) => updateFilter(filter.id, { operator: value as any })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FILTER_OPERATORS.map(op => (
                                  <SelectItem key={op.id} value={op.id}>
                                    {op.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              placeholder="Filter value"
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilter(filter.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grouping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Grouping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label>Group By Fields</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedDataSource.fields.map(field => (
                          <div key={field.name} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`group-${field.name}`}
                              checked={config.groupBy.includes(field.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    groupBy: [...prev.groupBy, field.name]
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    groupBy: prev.groupBy.filter(g => g !== field.name)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`group-${field.name}`} className="text-sm">
                              {field.label} ({field.type})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a data source to begin configuring your report</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={executeReport}
              disabled={loading || !config.dataSource || config.aggregations.length === 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Report...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Report
                </>
              )}
            </Button>
            <Button variant="outline" onClick={saveReport} disabled={!config.name}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {reportData && (
              <Button variant="outline" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
            {config.description && (
              <p className="text-sm text-muted-foreground">{config.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {config.chartType === 'table' ? (
              <ReportTable data={reportData} />
            ) : (
              <ReportChart data={reportData} type={config.chartType} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}