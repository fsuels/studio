# White-Label Portal System

A comprehensive multi-tenant white-label solution for the 123LegalDoc platform, enabling law firms, consultants, and businesses to offer branded legal document services to their clients.

## 🎯 Business Value

- **10x Revenue Potential**: Law firms pay $500-2000/month vs $35/document
- **Market Differentiation**: Unique offering in legal doc space
- **Professional Service Market**: Access B2B customers beyond individual consumers
- **Recurring Revenue**: Monthly subscriptions vs one-time purchases

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Custom Domain  │    │   Subdomain      │    │  Main Platform  │
│  lawfirm.com    │───▶│ firm.123legal... │───▶│ 123legaldoc.com │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Tenant Portal  │    │  Tenant Portal   │    │  Main App       │
│  Custom Branding│    │  Custom Branding │    │  Direct Users   │
│  White-Label    │    │  Subdomain       │    │  No Tenancy     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Features Implemented

### ✅ Core Infrastructure

- **Multi-tenant architecture** with complete data isolation
- **Dynamic routing** for `[tenant]` routes
- **Middleware** for tenant resolution and routing
- **Database schema** for tenants, users, domains, and audit trails

### ✅ Branding & Theming

- **Custom branding** (logo, colors, fonts, CSS)
- **Theme system** with CSS variables and Tailwind overrides
- **Branded components** (buttons, layouts, headers, footers)
- **White-label mode** (hide/show "Powered by 123LegalDoc")

### ✅ Custom Domains

- **Cloudflare integration** for custom domain management
- **Automatic SSL** certificate provisioning
- **DNS management** with verification
- **Domain analytics** and cache purging

### ✅ User Management & Invitations

- **JWT-based secure invitations** with expiration
- **Role-based permissions** (admin, manager, editor, viewer, guest)
- **Tenant user isolation** and access control
- **Audit trail** for all tenant activities

### ✅ Real-time Chat

- **Stream Chat integration** for tenant-specific rooms
- **Document collaboration** with chat sidebars
- **Role-based chat permissions**
- **Chat history export** for compliance

## 📁 File Structure

```
src/
├── types/
│   └── tenant.ts                 # Core tenant types and schemas
├── middleware/
│   └── tenant.ts                # Tenant resolution middleware
├── lib/
│   ├── tenant-invites.ts        # JWT invitation system
│   ├── tenant-branding.ts       # Branding and theming utilities
│   ├── cloudflare-domains.ts    # Custom domain management
│   └── stream-chat-tenant.ts    # Chat integration
├── contexts/
│   ├── TenantContext.tsx        # Tenant state management
│   └── TenantBrandingContext.tsx # Branding state management
├── components/tenant/
│   ├── TenantHeader.tsx         # Branded header component
│   ├── TenantFooter.tsx         # Branded footer component
│   ├── TenantDashboard.tsx      # Main tenant dashboard
│   ├── TenantInviteRoom.tsx     # Invitation acceptance flow
│   └── BrandedButton.tsx        # Automatically branded buttons
├── app/
│   ├── tenant/[slug]/           # Tenant-specific routes
│   │   ├── layout.tsx           # Tenant layout with branding
│   │   ├── page.tsx             # Tenant dashboard
│   │   └── room/[token]/        # Invitation acceptance
│   └── tenant-not-found/        # 404 for invalid tenants
└── middleware.ts                # Main Next.js middleware
```

## 🔧 Setup & Configuration

### 1. Environment Variables

```bash
# Tenant Invitations
TENANT_INVITE_JWT_SECRET=your-super-secret-invite-key

# Cloudflare (for custom domains)
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ZONE_ID=your-main-zone-id

# Stream Chat (for real-time chat)
STREAM_CHAT_API_KEY=your-stream-chat-api-key
STREAM_CHAT_API_SECRET=your-stream-chat-api-secret

# Next.js
NEXT_PUBLIC_SITE_URL=https://123legaldoc.com
```

### 2. Database Schema

Add these collections to your Firestore:

```typescript
// Collection: tenants
interface Tenant {
  id: string;
  slug: string;
  name: string;
  branding: TenantBranding;
  subscription: TenantSubscription;
  // ... see types/tenant.ts for full schema
}

// Collection: tenant_users
interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  // ... see types/tenant.ts for full schema
}

// Collection: tenant_invites
interface TenantInvite {
  id: string;
  tenantId: string;
  token: string;
  email: string;
  // ... see types/tenant.ts for full schema
}

// Collection: tenant_domains
interface TenantDomain {
  id: string;
  tenantId: string;
  domain: string;
  status: 'pending' | 'active' | 'failed';
  // ... see types/tenant.ts for full schema
}
```

### 3. Firebase Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenant data - only accessible by tenant members
    match /tenants/{tenantId} {
      allow read, write: if isTenantMember(tenantId);
    }

    match /tenant_users/{userId} {
      allow read, write: if isTenantAdmin(resource.data.tenantId);
    }

    match /tenant_invites/{inviteId} {
      allow read: if true; // Invites need to be publicly readable
      allow write: if isTenantAdmin(resource.data.tenantId);
    }

    function isTenantMember(tenantId) {
      return exists(/databases/$(database)/documents/tenant_users/$(request.auth.uid + '_' + tenantId));
    }

    function isTenantAdmin(tenantId) {
      let userDoc = get(/databases/$(database)/documents/tenant_users/$(request.auth.uid + '_' + tenantId));
      return userDoc.data.role in ['admin', 'manager'];
    }
  }
}
```

## 💼 Usage Examples

### Creating a New Tenant

```typescript
import { createTenant } from '@/lib/tenant-management';

const tenant = await createTenant({
  name: 'Acme Law Firm',
  slug: 'acme-law',
  ownerUserId: 'user123',
  contactEmail: 'admin@acmelaw.com',
  branding: {
    companyName: 'Acme Law Firm',
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    logoUrl: 'https://acmelaw.com/logo.png',
  },
  subscription: {
    plan: 'professional',
    status: 'active',
  },
});
```

### Inviting Users to a Tenant

```typescript
import { createTenantInvitation } from '@/lib/tenant-invites';

const { invitation, token } = await createTenantInvitation({
  tenantId: 'tenant123',
  email: 'lawyer@acmelaw.com',
  role: 'editor',
  permissions: ['documents.create', 'documents.view_all'],
  invitedBy: 'admin-user-id',
  inviteMessage: 'Welcome to our legal document portal!',
  expiresInHours: 72,
});

// Send invitation email with link:
const inviteUrl = `https://acme-law.123legaldoc.com/room/${token}`;
```

### Adding Custom Domain

```typescript
import { addTenantCustomDomain } from '@/lib/cloudflare-domains';

const domain = await addTenantCustomDomain('tenant123', 'docs.acmelaw.com');

// Provide setup instructions to tenant
const instructions = generateDomainSetupInstructions(
  'docs.acmelaw.com',
  domain.verificationToken,
);
```

### Using Branded Components

```tsx
import { BrandedButton } from '@/components/tenant/BrandedButton';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';

function TenantComponent() {
  const { getPrimaryColor, getCompanyName } = useTenantBranding();

  return (
    <div>
      <h1 style={{ color: getPrimaryColor() }}>
        Welcome to {getCompanyName()}
      </h1>
      <BrandedButton brandVariant="primary">Create Document</BrandedButton>
    </div>
  );
}
```

## 🎨 Customization Guide

### Branding Options

```typescript
interface TenantBranding {
  // Visual Identity
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string; // Main brand color
  secondaryColor: string; // Secondary brand color
  accentColor?: string; // Accent color
  fontFamily?: string; // Custom font
  customCss?: string; // Custom CSS overrides

  // Company Details
  companyName: string;
  tagline?: string;
  footerText?: string;

  // Legal Links
  termsUrl?: string;
  privacyUrl?: string;
  supportEmail?: string;
}
```

### Predefined Color Schemes

```typescript
import { PREDEFINED_COLOR_SCHEMES } from '@/lib/tenant-branding';

// Use predefined schemes for quick setup
const blueScheme = PREDEFINED_COLOR_SCHEMES.blue;
const greenScheme = PREDEFINED_COLOR_SCHEMES.green;
```

### Custom CSS Examples

```css
/* Custom CSS for advanced branding */
.custom-tenant-styles {
  /* Custom button styles */
  .btn-primary {
    border-radius: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  /* Custom header styles */
  .tenant-header {
    background: linear-gradient(
      135deg,
      var(--brand-primary),
      var(--brand-secondary)
    );
  }

  /* Custom card styles */
  .card {
    border: 2px solid var(--brand-primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}
```

## 🔐 Security Features

### Multi-Tenant Data Isolation

- Row-level security in database queries
- Tenant context validation in all API routes
- Secure JWT tokens for invitations

### Access Control

- Role-based permissions system
- Tenant-specific user roles
- Audit trail for all actions

### Domain Security

- Automatic SSL certificate provisioning
- Domain ownership verification
- Cloudflare security features

## 📊 Analytics & Monitoring

### Tenant Analytics

```typescript
import { getTenantAnalytics } from '@/lib/tenant-analytics';

const analytics = await getTenantAnalytics('tenant123', {
  period: 'month',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
});

console.log(analytics.metrics);
// {
//   documentsCreated: 45,
//   activeUsers: 12,
//   userRetentionRate: 0.85,
//   avgDocumentCompletionTime: 1200
// }
```

### Audit Trail

```typescript
// All tenant actions are automatically logged
interface TenantAuditEvent {
  tenantId: string;
  userId: string;
  action: 'document.created' | 'user.invited' | 'settings.updated';
  description: string;
  metadata: Record<string, any>;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
}
```

## 🚀 Deployment Checklist

### Production Setup

- [ ] Set all environment variables
- [ ] Configure Cloudflare API access
- [ ] Set up Stream Chat account
- [ ] Configure Firebase security rules
- [ ] Set up monitoring and alerts
- [ ] Test invitation flow end-to-end
- [ ] Test custom domain setup
- [ ] Verify branding system works
- [ ] Test chat functionality

### Go-Live Steps

1. **Phase 1**: Internal testing with test tenant
2. **Phase 2**: Beta testing with 1-2 law firms
3. **Phase 3**: Gradual rollout to existing customers
4. **Phase 4**: Full launch with marketing campaign

## 🎯 Business Model & Pricing

### Recommended Pricing Tiers

```typescript
export const TENANT_PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    duration: '14 days',
    maxUsers: 3,
    maxDocuments: 10,
  },
  starter: {
    name: 'Starter',
    price: 299, // per month
    maxUsers: 25,
    maxDocuments: 500,
    features: ['subdomain', 'basic_branding', 'email_support'],
  },
  professional: {
    name: 'Professional',
    price: 799, // per month
    maxUsers: 100,
    maxDocuments: 2000,
    features: [
      'custom_domain',
      'advanced_branding',
      'api_access',
      'priority_support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 1999, // per month
    maxUsers: 'unlimited',
    maxDocuments: 'unlimited',
    features: ['everything', 'sso', 'custom_integrations', 'dedicated_support'],
  },
};
```

### Target Market Segments

- **Law Firms**: Offer document services to clients
- **HR Consultants**: Employment documents and contracts
- **Business Consultants**: Incorporation and partnership docs
- **Accounting Firms**: Add legal services to their offering
- **Real Estate Agencies**: Rental and purchase agreements

## 🔄 Migration Guide

### For Existing Users

1. Create tenant for existing power users
2. Migrate their documents to tenant context
3. Offer upgrade incentives
4. Provide migration assistance

### Data Migration Script

```typescript
// Example migration for existing users
async function migrateUserToTenant(
  userId: string,
  tenantConfig: Partial<Tenant>,
) {
  // 1. Create tenant
  const tenant = await createTenant(tenantConfig);

  // 2. Add user as admin
  await addUserToTenant(tenant.id, userId, 'admin');

  // 3. Migrate user's documents
  await migrateUserDocuments(userId, tenant.id);

  // 4. Set up default branding
  await setupDefaultBranding(tenant.id);
}
```

## 📈 Success Metrics

### KPIs to Track

- **Tenant Acquisition Rate**: New tenants per month
- **Revenue Per Tenant**: Average monthly revenue
- **User Adoption**: Users per tenant, activity levels
- **Retention**: Tenant churn rate, renewal rate
- **Usage**: Documents created per tenant
- **Support**: Ticket volume, resolution time

### Success Targets (6 months)

- 50+ active tenants
- $50K+ monthly recurring revenue
- 85%+ tenant retention rate
- 95%+ uptime for tenant portals
- <24h average support response time

---

## 🎉 Conclusion

The White-Label Portal system transforms 123LegalDoc from a B2C document generator into a B2B platform that empowers professional service providers to offer branded legal document services. This strategic pivot opens new revenue streams and positions the platform for enterprise-scale growth.

**Ready to launch!** 🚀
