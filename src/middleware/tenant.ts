import { NextRequest, NextResponse } from 'next/server';
import { Tenant } from '@/types/tenant';

// Tenant resolution and routing middleware
export async function tenantMiddleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Skip middleware for static files, API routes (except tenant API), and internal Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Parse the hostname to determine tenant context
  const tenantContext = await resolveTenantFromHostname(hostname);

  if (tenantContext.type === 'tenant') {
    return handleTenantRequest(request, tenantContext.tenant);
  } else if (tenantContext.type === 'subdomain') {
    return handleSubdomainRequest(request, tenantContext.slug);
  }

  // Default: continue to main application
  return NextResponse.next();
}

type TenantContext =
  | { type: 'main' }
  | { type: 'tenant'; tenant: Tenant }
  | { type: 'subdomain'; slug: string };


async function resolveTenantFromHostname(
  hostname: string,
): Promise<TenantContext> {
  // Handle localhost and development
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    return { type: 'main' };
  }

  // Production domain patterns
  const mainDomains = ['123legaldoc.com', 'www.123legaldoc.com'];

  if (mainDomains.includes(hostname)) {
    return { type: 'main' };
  }

  // Check for custom domains first
  const tenant = await getTenantByCustomDomain(hostname);
  if (tenant) {
    return { type: 'tenant', tenant };
  }

  // Check for subdomains: {tenant}.123legaldoc.com
  const subdomainMatch = hostname.match(/^([a-zA-Z0-9-]+)\.123legaldoc\.com$/);
  if (subdomainMatch) {
    const slug = subdomainMatch[1];

    // Skip www and other reserved subdomains
    const reservedSubdomains = [
      'www',
      'api',
      'admin',
      'app',
      'mail',
      'ftp',
      'cdn',
    ];
    if (!reservedSubdomains.includes(slug)) {
      const tenantBySlug = await getTenantBySlug(slug);
      if (tenantBySlug) {
        return { type: 'tenant', tenant: tenantBySlug };
      } else {
        return { type: 'subdomain', slug };
      }
    }
  }

  return { type: 'main' };
}

async function handleTenantRequest(
  request: NextRequest,
  tenant: Tenant,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Check if tenant is active
  if (tenant.status !== 'active' && tenant.status !== 'trial') {
    return new NextResponse('Tenant not available', { status: 503 });
  }

  // Rewrite URL to tenant route
  const url = request.nextUrl.clone();
  url.pathname = `/tenant/${tenant.slug}${pathname}`;

  const response = NextResponse.rewrite(url);

  // Add tenant context headers
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-tenant-name', tenant.name);
  response.headers.set('x-tenant-plan', tenant.subscription.plan);

  return response;
}

async function handleSubdomainRequest(
  request: NextRequest,
  slug: string,
): Promise<NextResponse> {
  // Subdomain exists but no tenant found - show tenant not found page
  const url = request.nextUrl.clone();
  url.pathname = `/tenant-not-found`;
  url.searchParams.set('slug', slug);

  return NextResponse.rewrite(url);
}

// Mock functions - these would connect to your database
async function getTenantByCustomDomain(_domain: string): Promise<Tenant | null> {
  // TODO: Implement Firebase query
  // Query Firestore for tenant with matching custom domain
  try {
    // const db = getFirestore();
    // const domainsRef = collection(db, 'tenant_domains');
    // const q = query(domainsRef, where('domain', '==', domain), where('status', '==', 'active'));
    // const snapshot = await getDocs(q);

    // if (!snapshot.empty) {
    //   const domainDoc = snapshot.docs[0].data() as TenantDomain;
    //   const tenantDoc = await getDoc(doc(db, 'tenants', domainDoc.tenantId));
    //   return tenantDoc.exists() ? tenantDoc.data() as Tenant : null;
    // }

    return null;
  } catch (error) {
    console.error('Error fetching tenant by custom domain:', error);
    return null;
  }
}

async function getTenantBySlug(_slug: string): Promise<Tenant | null> {
  // TODO: Implement Firebase query
  // Query Firestore for tenant with matching slug
  try {
    // const db = getFirestore();
    // const tenantsRef = collection(db, 'tenants');
    // const q = query(tenantsRef, where('slug', '==', slug));
    // const snapshot = await getDocs(q);

    // if (!snapshot.empty) {
    //   return snapshot.docs[0].data() as Tenant;
    // }

    return null;
  } catch (error) {
    console.error('Error fetching tenant by slug:', error);
    return null;
  }
}

// Utility function to get tenant context in server components
export async function getTenantFromHeaders(
  headers: Headers,
): Promise<Tenant | null> {
  const tenantId = headers.get('x-tenant-id');
  const tenantSlug = headers.get('x-tenant-slug');
  const tenantName = headers.get('x-tenant-name');
  const tenantPlan = headers.get('x-tenant-plan');

  if (!tenantId || !tenantSlug) {
    return null;
  }

  // For now, construct minimal tenant from headers
  // In production, you might want to fetch full tenant data
  const plan =
    tenantPlan === 'trial' ||
    tenantPlan === 'starter' ||
    tenantPlan === 'professional' ||
    tenantPlan === 'enterprise'
      ? tenantPlan
      : 'trial';

  return {
    id: tenantId,
    slug: tenantSlug,
    name: tenantName || tenantSlug,
    subscription: { plan } as unknown as Tenant['subscription'],
  } as Tenant;
}

// Client-side tenant context hook
export function useTenant() {
  // This would be implemented with React context
  // For now, return null
  return null;
}
