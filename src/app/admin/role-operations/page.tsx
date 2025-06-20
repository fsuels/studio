'use client';

import React, { useState, useEffect } from 'react';
import RoleManagementDashboard from '@/components/admin/RoleManagementDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { UserRole } from '@/types/roles';

export default function RoleOperationsPage() {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');
  const [currentUserId, setCurrentUserId] = useState('admin-user-1');
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication check
  useEffect(() => {
    // In production, get actual user role from authentication context
    const mockUserRole: UserRole = 'admin';
    const mockUserId = 'admin-user-1';
    
    setCurrentUserRole(mockUserRole);
    setCurrentUserId(mockUserId);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleGoBack = () => {
    window.close(); // Close the popup window
    // Or navigate back if opened in same tab
    // window.history.back();
  };

  const canAccessRoleOps = ['super_admin', 'admin'].includes(currentUserRole);

  if (!canAccessRoleOps) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You don't have permission to access Role Operations. This feature requires Administrator privileges.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700">
                Current Role: {currentUserRole.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button 
              onClick={handleGoBack}
              className="w-full mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation & Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Role Operations Center</h1>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                ADMIN ACCESS
              </Badge>
            </div>

            {/* Right side - Actions & User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Admin Dashboard</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Activity className="h-3 w-3" />
                  <span>Role: {currentUserRole.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Security Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                <strong>Security Notice:</strong> You are accessing role management operations. 
                All actions are logged and audited for compliance purposes.
              </p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RoleManagementDashboard 
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>© 2024 123LegalDoc</span>
              <span>•</span>
              <span>Role Operations v1.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Audit Trail: Enabled</span>
              <span>•</span>
              <span>Compliance: SOX, GDPR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}