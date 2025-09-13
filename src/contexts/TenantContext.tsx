'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tenant, TenantUser, TenantPermission } from '@/types/tenant';

interface TenantContextValue {
  tenant: Tenant | null;
  tenantUser: TenantUser | null;
  permissions: TenantPermission[];
  hasPermission: (permission: TenantPermission) => boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  updateTenant: (updates: Partial<Tenant>) => Promise<void>;
  refreshTenantData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  children: React.ReactNode;
  tenant: Tenant;
  initialTenantUser?: TenantUser | null;
}

export function TenantProvider({
  children,
  tenant,
  initialTenantUser,
}: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(tenant);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(
    initialTenantUser || null,
  );
  const [permissions, setPermissions] = useState<TenantPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTenantUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch current user's tenant membership and permissions
      const response = await fetch(`/api/tenants/${tenant.id}/current-user`);

      if (response.ok) {
        const data = await response.json();
        setTenantUser(data.tenantUser);
        setPermissions(data.permissions || []);
      } else if (response.status === 404) {
        // User is not a member of this tenant (guest access)
        setTenantUser(null);
        setPermissions([]);
      } else {
        throw new Error('Failed to load tenant user data');
      }
    } catch (err) {
      console.error('Error loading tenant user data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [tenant.id]);

  // Load tenant user data and permissions
  useEffect(() => {
    loadTenantUserData();
  }, [loadTenantUserData]);

  const hasPermission = (permission: TenantPermission): boolean => {
    if (!tenantUser) return false;
    return permissions.includes(permission);
  };

  const updateTenant = async (updates: Partial<Tenant>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update tenant');
      }

      const updatedTenant = await response.json();
      setCurrentTenant(updatedTenant);
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenantData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const [tenantResponse, _userData] = await Promise.all([
        fetch(`/api/tenants/${tenant.id}`),
        loadTenantUserData(),
      ]);

      if (tenantResponse.ok) {
        const tenantData = await tenantResponse.json();
        setCurrentTenant(tenantData);
      }
    } catch (err) {
      console.error('Error refreshing tenant data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const value: TenantContextValue = {
    tenant: currentTenant,
    tenantUser,
    permissions,
    hasPermission,
    isLoading,
    error,
    updateTenant,
    refreshTenantData,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Convenience hooks
export function useTenantPermissions() {
  const { permissions, hasPermission } = useTenant();
  return { permissions, hasPermission };
}

export function useTenantUser() {
  const { tenantUser } = useTenant();
  return tenantUser;
}

export function useTenantData() {
  const { tenant, isLoading, error, refreshTenantData } = useTenant();
  return { tenant, isLoading, error, refreshTenantData };
}
