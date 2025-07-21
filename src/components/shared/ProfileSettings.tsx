'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const [active, setActive] = useState<
    'personal' | 'security' | 'notifications'
  >('personal');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { password, ...rest } = form;

      // Update user profile data
      updateUser(rest);

      // Update password separately if provided
      if (password) {
        updateUser({ password });
      }

      // Show success toast
      toast({
        title: t('Changes saved successfully', 'Changes saved successfully'),
        description: t(
          'Your profile has been updated',
          'Your profile has been updated',
        ),
      });

      // Clear password field after successful save
      if (password) {
        setForm((prev) => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('Error saving changes', 'Error saving changes'),
        description: t('Please try again', 'Please try again'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm bg-card border-border">
      <CardHeader>
        <CardTitle>{t('Profile Settings', 'Profile Settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={active === 'personal' ? 'secondary' : 'ghost'}
            onClick={() => setActive('personal')}
          >
            {t('Personal Information', 'Personal Information')}
          </Button>
          <Button
            variant={active === 'security' ? 'secondary' : 'ghost'}
            onClick={() => setActive('security')}
          >
            {t('Security', 'Security')}
          </Button>
          <Button
            variant={active === 'notifications' ? 'secondary' : 'ghost'}
            onClick={() => setActive('notifications')}
          >
            {t('Notifications', 'Notifications')}
          </Button>
        </div>

        {active === 'personal' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Name', 'Name')}
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Email', 'Email')}
              </Label>
              <Input
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Phone', 'Phone')}
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Shipping address', 'Shipping address')}
              </Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
        )}

        {active === 'security' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Password', 'Password')}
              </Label>
              <Input
                type="password"
                placeholder={t('New password', 'New password')}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('2-step verification', '2-step verification')}
              </span>
              <Switch
                checked={form.twoStep}
                onCheckedChange={(v) => handleChange('twoStep', v)}
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {t('Authorized contacts', 'Authorized contacts')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t(
                  'You currently have no authorized contacts.',
                  'You currently have no authorized contacts.',
                )}
              </p>
            </div>
          </div>
        )}

        {active === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t(
                  'Receive text updates for your order and account.',
                  'Receive text updates for your order and account.',
                )}
              </span>
              <Switch
                checked={form.textUpdates}
                onCheckedChange={(v) => handleChange('textUpdates', v)}
                disabled={isSaving}
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('Save Changes', 'Save Changes')}
        </Button>
      </CardContent>
    </Card>
  );
}
