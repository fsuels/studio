'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [active, setActive] = useState<
    'personal' | 'security' | 'notifications'
  >('personal');
  interface FormState {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    twoStep: boolean;
    textUpdates: boolean;
  }

  const [form, setForm] = useState<FormState>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
    twoStep: user?.twoStep || false,
    textUpdates: user?.textUpdates || false,
  });

  const handleChange = (
    field: keyof FormState,
    value: FormState[keyof FormState],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const { password, ...rest } = form;
    updateUser(rest);
    if (password) updateUser({ password });
  };

  return (
    <Card className="shadow-sm bg-card border-border">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={active === 'personal' ? 'secondary' : 'ghost'}
            onClick={() => setActive('personal')}
          >
            Personal Information
          </Button>
          <Button
            variant={active === 'security' ? 'secondary' : 'ghost'}
            onClick={() => setActive('security')}
          >
            Security
          </Button>
          <Button
            variant={active === 'notifications' ? 'secondary' : 'ghost'}
            onClick={() => setActive('notifications')}
          >
            Notifications
          </Button>
        </div>

        {active === 'personal' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Email
              </Label>
              <Input
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Phone
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Shipping address
              </Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        )}

        {active === 'security' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Password
              </Label>
              <Input
                type="password"
                placeholder="New password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                2-step verification
              </span>
              <Switch
                checked={form.twoStep}
                onCheckedChange={(v) => handleChange('twoStep', v)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Authorized contacts
              </Label>
              <p className="text-sm text-muted-foreground">
                You currently have no authorized contacts.
              </p>
            </div>
          </div>
        )}

        {active === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Receive text updates for your order and account.
              </span>
              <Switch
                checked={form.textUpdates}
                onCheckedChange={(v) => handleChange('textUpdates', v)}
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
