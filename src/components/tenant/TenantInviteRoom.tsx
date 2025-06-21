'use client';

import React, { useState } from 'react';
import { Tenant, TenantInvite } from '@/types/tenant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Building,
  FileText,
  MessageCircle,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TenantInviteRoomProps {
  tenant: Tenant;
  invitation: TenantInvite;
  token: string;
}

export function TenantInviteRoom({ tenant, invitation, token }: TenantInviteRoomProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    password: '',
    acceptTerms: false,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAcceptInvitation = async () => {
    try {
      setIsAccepting(true);

      const response = await fetch(`/api/invites/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }

      const result = await response.json();
      
      toast({
        title: 'Welcome aboard!',
        description: 'Your invitation has been accepted successfully.',
      });

      // Redirect to tenant dashboard
      router.push(`/tenant/${tenant.slug}`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getExpirationTime = () => {
    const now = new Date();
    const expires = new Date(invitation.expiresAt);
    const diffHours = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours > 24) {
      return `${Math.ceil(diffHours / 24)} days`;
    }
    return `${diffHours} hours`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </h1>
          <p className="text-lg text-gray-600">
            Join {tenant.branding?.companyName || tenant.name} to collaborate on legal documents
          </p>
        </div>

        {/* Invitation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Invitation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Organization</Label>
                <p className="text-lg font-semibold">{tenant.branding?.companyName || tenant.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Your Role</Label>
                <Badge variant="secondary" className="text-sm">
                  {formatRole(invitation.role)}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Invited Email</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{invitation.email}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Expires In</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{getExpirationTime()}</span>
                </div>
              </div>
            </div>

            {invitation.inviteMessage && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Personal Message</Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <p className="text-gray-700 italic">"{invitation.inviteMessage}"</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What You'll Get Access To */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              What You'll Get Access To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium">Document Creation</h4>
                <p className="text-sm text-gray-600">Create and edit legal documents</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium">Team Collaboration</h4>
                <p className="text-sm text-gray-600">Work together with your team</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <MessageCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-medium">Real-time Chat</h4>
                <p className="text-sm text-gray-600">Discuss documents in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Set up your account to accept the invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userInfo.password}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                placeholder="Create a secure password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={userInfo.acceptTerms}
                onChange={(e) => setUserInfo({ ...userInfo, acceptTerms: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                I agree to the{' '}
                <a href={tenant.branding?.termsUrl || `/tenant/${tenant.slug}/terms`} 
                   target="_blank" 
                   className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href={tenant.branding?.privacyUrl || `/tenant/${tenant.slug}/privacy`} 
                   target="_blank" 
                   className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={isAccepting || !userInfo.firstName || !userInfo.lastName || !userInfo.password || !userInfo.acceptTerms}
                className="flex-1"
              >
                {isAccepting ? (
                  'Accepting Invitation...'
                ) : (
                  <>
                    Accept Invitation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => window.close()}>
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Invitation</p>
                <p className="text-sm text-green-700">
                  This invitation is encrypted and expires in {getExpirationTime()}. 
                  Your data is protected with bank-level security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}