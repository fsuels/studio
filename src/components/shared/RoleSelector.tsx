// src/components/shared/RoleSelector.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronDown, Check } from 'lucide-react';
import { taxonomy } from '@/config/taxonomy';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  onRoleChange?: (role: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  onRoleChange,
  className,
  size = 'md',
}) => {
  const { t } = useTranslation('common');
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Load saved role from localStorage on mount
  React.useEffect(() => {
    setMounted(true);
    try {
      const savedRole = localStorage.getItem('userRole');
      if (savedRole && taxonomy.roles[savedRole]) {
        setSelectedRole(savedRole);
      }
    } catch (_error) {
      console.warn('Could not access localStorage for user role');
    }
  }, []);

  // Save role to localStorage and notify parent
  const handleRoleSelect = React.useCallback(
    (role: string | null) => {
      setSelectedRole(role);

      try {
        if (role) {
          localStorage.setItem('userRole', role);
        } else {
          localStorage.removeItem('userRole');
        }
      } catch (_error) {
        console.warn('Could not save role to localStorage');
      }

      onRoleChange?.(role);
    },
    [onRoleChange],
  );

  // Get sorted roles by popularity (based on quickDocs count)
  const sortedRoles = React.useMemo(() => {
    return Object.entries(taxonomy.roles)
      .filter(([, role]) => role && typeof role === 'object')
      .sort(([, a], [, b]) => {
        const aQuickDocs = Object.keys(a.quickDocs || {}).length;
        const bQuickDocs = Object.keys(b.quickDocs || {}).length;
        return bQuickDocs - aQuickDocs; // Sort by number of quick docs descending
      });
  }, []);

  // Helper function to format role key into display name
  const formatRoleKey = (key: string): string => {
    return key
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn('opacity-50', className)}
        disabled
      >
        <Users className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            'gap-2 max-w-[200px]',
            selectedRole && 'border-primary bg-primary/5',
            className,
          )}
        >
          <Users className="h-4 w-4" />
          <span className="truncate">
            {selectedRole
              ? formatRoleKey(selectedRole)
              : t('roleSelector.selectRole', { defaultValue: 'Select Role' })}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t('roleSelector.yourRole', {
            defaultValue: 'What best describes you?',
          })}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Clear Selection */}
        {selectedRole && (
          <>
            <DropdownMenuItem
              onClick={() => handleRoleSelect(null)}
              className="text-muted-foreground"
            >
              {t('roleSelector.clearSelection', {
                defaultValue: 'Clear selection',
              })}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Role Options */}
        {sortedRoles.length > 0 ? (
          sortedRoles.map(([roleKey, role]) => {
            const isSelected = selectedRole === roleKey;
            const quickDocsCount = Object.keys(role.quickDocs || {}).length;

            return (
              <DropdownMenuItem
                key={roleKey}
                onClick={() => handleRoleSelect(roleKey)}
                className={cn(
                  'flex items-center justify-between p-3 cursor-pointer hover:bg-accent',
                  isSelected && 'bg-primary/10',
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatRoleKey(roleKey)}</span>
                    {isSelected && <Check className="h-3 w-3 text-primary" />}
                  </div>
                  {role.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {role.description}
                    </span>
                  )}
                </div>

                {quickDocsCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {quickDocsCount}
                  </Badge>
                )}
              </DropdownMenuItem>
            );
          })
        ) : (
          <div className="p-3 text-sm text-muted-foreground text-center">
            {t('roleSelector.noRoles', { defaultValue: 'No roles available' })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelector;
