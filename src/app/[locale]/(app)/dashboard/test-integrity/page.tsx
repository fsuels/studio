// src/app/[locale]/(app)/dashboard/test-integrity/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Info,
  Download
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface TestResponse {
  testSuite: string;
  executedAt: string;
  userId: string;
  testType: string;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    overallPassed: boolean;
    successRate: string;
  };
  results: TestResult[];
  recommendations: string[];
}

interface TestInfo {
  availableTests: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  recommendations: string[];
}

export default function TestIntegrityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [testResults, setTestResults] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState('full');

  useEffect(() => {
    fetchTestInfo();
  }, []);

  const fetchTestInfo = async () => {
    try {
      const response = await fetch('/api/compliance/test-integrity');
      if (response.ok) {
        const info = await response.json();
        setTestInfo(info);
      } else {
        throw new Error('Failed to fetch test information');
      }
    } catch (error) {
      console.error('Error fetching test info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test information',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runIntegrityTests = async () => {
    if (!user) return;

    setIsRunning(true);
    try {
      const response = await fetch('/api/compliance/test-integrity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testType: selectedTestType
        })
      });

      if (response.ok) {
        const results = await response.json();
        setTestResults(results);
        
        toast({
          title: results.summary.overallPassed ? 'Tests Passed' : 'Tests Failed',
          description: `${results.summary.passedTests}/${results.summary.totalTests} tests passed (${results.summary.successRate})`,
          variant: results.summary.overallPassed ? 'default' : 'destructive'
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Test execution failed');
      }
    } catch (error) {
      console.error('Error running tests:', error);
      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Failed to run integrity tests',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const downloadTestReport = () => {
    if (!testResults) return;

    const blob = new Blob([JSON.stringify(testResults, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrity-test-report-${testResults.executedAt}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Report Downloaded',
      description: 'Test report has been saved to your downloads'
    });
  };

  const getTestIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getTestBadgeColor = (passed: boolean) => {
    return passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Integrity Testing</h1>
        </div>
        
        {testResults && (
          <Button variant="outline" onClick={downloadTestReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        )}
      </div>

      <p className="text-muted-foreground">
        Test the integrity and functionality of your audit trail system. These tests verify that 
        audit events are being created, stored, and verified correctly.
      </p>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Run Integrity Tests</span>
          </CardTitle>
          <CardDescription>
            Choose which tests to run and verify your audit trail integrity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Type</label>
            <Select value={selectedTestType} onValueChange={setSelectedTestType}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {testInfo?.availableTests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {testInfo?.availableTests.find(t => t.id === selectedTestType)?.description && (
              <p className="text-sm text-muted-foreground">
                {testInfo.availableTests.find(t => t.id === selectedTestType)?.description}
              </p>
            )}
          </div>

          <Button 
            onClick={runIntegrityTests} 
            disabled={isRunning}
            className="w-full md:w-auto"
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <>
          {/* Summary */}
          <Card className={`border-l-4 ${testResults.summary.overallPassed ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {testResults.summary.overallPassed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Test Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{testResults.summary.totalTests}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testResults.summary.passedTests}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{testResults.summary.failedTests}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{testResults.summary.successRate}</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Executed at: {new Date(testResults.executedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Individual Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results for each integrity test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.results.map((result, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getTestIcon(result.passed)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.testName}</h3>
                      <Badge className={getTestBadgeColor(result.passed)}>
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                    
                    {result.details && (
                      <details className="text-sm text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">
                          View details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          {testResults.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testResults.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* General Recommendations */}
      {testInfo?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {testInfo.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}