// Cloudflare API integration for custom domain management
import { TenantDomain } from '@/types/tenant';

interface CloudflareConfig {
  apiToken: string;
  accountId: string;
  zoneId: string; // Main zone ID for 123legaldoc.com
}

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  nameServers: string[];
}

interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

interface CloudflareSSLSettings {
  id: string;
  value: string;
  modified_on: string;
  editable: boolean;
}

class CloudflareDomainsManager {
  private config: CloudflareConfig;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(config: CloudflareConfig) {
    this.config = config;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(
        `Cloudflare API error: ${data.errors?.map((e: any) => e.message).join(', ')}`,
      );
    }

    return data.result;
  }

  // Add custom domain to Cloudflare
  async addCustomDomain(
    domain: string,
    tenantId: string,
  ): Promise<TenantDomain> {
    try {
      // First, check if domain already exists
      const existingZone = await this.findZone(domain);

      if (existingZone) {
        throw new Error(`Domain ${domain} already exists in Cloudflare`);
      }

      // Create new zone for the custom domain
      const zone = await this.createZone(domain);

      // Add DNS records to point to our infrastructure
      await this.createDNSRecords(zone.id, domain);

      // Configure SSL settings
      await this.configureSSL(zone.id);

      // Create domain record in our database
      const tenantDomain: TenantDomain = {
        id: `domain_${Date.now()}`,
        domain,
        isPrimary: false,
        isCustom: true,
        status: 'pending',
        sslStatus: 'pending',
        cloudflareZoneId: zone.id,
        verificationToken: this.generateVerificationToken(),
        createdAt: new Date().toISOString(),
      };

      return tenantDomain;
    } catch (error) {
      console.error('Error adding custom domain:', error);
      throw error;
    }
  }

  // Create a new Cloudflare zone
  private async createZone(domain: string): Promise<CloudflareZone> {
    return await this.makeRequest('/zones', {
      method: 'POST',
      body: JSON.stringify({
        name: domain,
        account: {
          id: this.config.accountId,
        },
        jump_start: true, // Auto-scan DNS records
      }),
    });
  }

  // Find existing zone by domain
  private async findZone(domain: string): Promise<CloudflareZone | null> {
    try {
      const zones = await this.makeRequest(`/zones?name=${domain}`);
      return zones.length > 0 ? zones[0] : null;
    } catch (error) {
      return null;
    }
  }

  // Create DNS records for the custom domain
  private async createDNSRecords(
    zoneId: string,
    domain: string,
  ): Promise<void> {
    const records = [
      // Root domain CNAME to our main domain
      {
        type: 'CNAME',
        name: '@',
        content: '123legaldoc.com',
        ttl: 300,
        proxied: true,
      },
      // WWW subdomain
      {
        type: 'CNAME',
        name: 'www',
        content: domain,
        ttl: 300,
        proxied: true,
      },
      // API subdomain for tenant API endpoints
      {
        type: 'CNAME',
        name: 'api',
        content: 'api.123legaldoc.com',
        ttl: 300,
        proxied: true,
      },
    ];

    for (const record of records) {
      await this.makeRequest(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        body: JSON.stringify(record),
      });
    }
  }

  // Configure SSL settings for the zone
  private async configureSSL(zoneId: string): Promise<void> {
    const sslSettings = [
      // Enable Always Use HTTPS
      {
        setting: 'always_use_https',
        value: 'on',
      },
      // Set SSL mode to Full (Strict)
      {
        setting: 'ssl',
        value: 'strict',
      },
      // Enable HSTS
      {
        setting: 'security_header',
        value: {
          strict_transport_security: {
            enabled: true,
            max_age: 31536000,
            include_subdomains: true,
            nosniff: true,
          },
        },
      },
      // Enable automatic HTTPS rewrites
      {
        setting: 'automatic_https_rewrites',
        value: 'on',
      },
    ];

    for (const setting of sslSettings) {
      try {
        await this.makeRequest(`/zones/${zoneId}/settings/${setting.setting}`, {
          method: 'PATCH',
          body: JSON.stringify({ value: setting.value }),
        });
      } catch (error) {
        console.warn(`Failed to set SSL setting ${setting.setting}:`, error);
      }
    }
  }

  // Verify domain ownership
  async verifyDomainOwnership(
    domain: string,
    verificationToken: string,
  ): Promise<boolean> {
    try {
      // Check for TXT record with verification token
      const zone = await this.findZone(domain);
      if (!zone) {
        return false;
      }

      const dnsRecords = await this.makeRequest(
        `/zones/${zone.id}/dns_records?type=TXT&name=_123legaldoc-verification.${domain}`,
      );

      return dnsRecords.some(
        (record: CloudflareDNSRecord) => record.content === verificationToken,
      );
    } catch (error) {
      console.error('Error verifying domain ownership:', error);
      return false;
    }
  }

  // Check SSL certificate status
  async checkSSLStatus(
    domain: string,
  ): Promise<'pending' | 'active' | 'failed'> {
    try {
      const zone = await this.findZone(domain);
      if (!zone) {
        return 'failed';
      }

      const sslSettings = await this.makeRequest(
        `/zones/${zone.id}/ssl/certificate_packs`,
      );

      if (sslSettings.length === 0) {
        return 'pending';
      }

      const activeCert = sslSettings.find(
        (cert: any) => cert.status === 'active',
      );
      return activeCert ? 'active' : 'pending';
    } catch (error) {
      console.error('Error checking SSL status:', error);
      return 'failed';
    }
  }

  // Remove custom domain
  async removeCustomDomain(domain: string): Promise<boolean> {
    try {
      const zone = await this.findZone(domain);
      if (!zone) {
        return true; // Already removed
      }

      await this.makeRequest(`/zones/${zone.id}`, {
        method: 'DELETE',
      });

      return true;
    } catch (error) {
      console.error('Error removing custom domain:', error);
      return false;
    }
  }

  // Update DNS records for existing domain
  async updateDNSRecords(
    domain: string,
    records: Partial<CloudflareDNSRecord>[],
  ): Promise<void> {
    const zone = await this.findZone(domain);
    if (!zone) {
      throw new Error(`Zone not found for domain: ${domain}`);
    }

    for (const record of records) {
      if (record.id) {
        // Update existing record
        await this.makeRequest(`/zones/${zone.id}/dns_records/${record.id}`, {
          method: 'PUT',
          body: JSON.stringify(record),
        });
      } else {
        // Create new record
        await this.makeRequest(`/zones/${zone.id}/dns_records`, {
          method: 'POST',
          body: JSON.stringify(record),
        });
      }
    }
  }

  // Get domain analytics
  async getDomainAnalytics(domain: string, since: Date): Promise<any> {
    try {
      const zone = await this.findZone(domain);
      if (!zone) {
        return null;
      }

      return await this.makeRequest(
        `/zones/${zone.id}/analytics/dashboard?since=${since.toISOString()}`,
      );
    } catch (error) {
      console.error('Error getting domain analytics:', error);
      return null;
    }
  }

  // Purge cache for domain
  async purgeDomainCache(domain: string, urls?: string[]): Promise<boolean> {
    try {
      const zone = await this.findZone(domain);
      if (!zone) {
        return false;
      }

      const body = urls ? { files: urls } : { purge_everything: true };

      await this.makeRequest(`/zones/${zone.id}/purge_cache`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      return true;
    } catch (error) {
      console.error('Error purging domain cache:', error);
      return false;
    }
  }

  private generateVerificationToken(): string {
    return `123legaldoc-verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Initialize Cloudflare manager with environment variables
export function createCloudflareManager(): CloudflareDomainsManager {
  const config: CloudflareConfig = {
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    zoneId: process.env.CLOUDFLARE_ZONE_ID || '',
  };

  if (!config.apiToken || !config.accountId) {
    throw new Error(
      'Cloudflare configuration missing. Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables.',
    );
  }

  return new CloudflareDomainsManager(config);
}

// High-level domain management functions
export async function addTenantCustomDomain(
  tenantId: string,
  domain: string,
): Promise<TenantDomain> {
  const manager = createCloudflareManager();
  return await manager.addCustomDomain(domain, tenantId);
}

export async function verifyTenantDomain(
  domain: string,
  verificationToken: string,
): Promise<boolean> {
  const manager = createCloudflareManager();
  return await manager.verifyDomainOwnership(domain, verificationToken);
}

export async function checkTenantDomainSSL(
  domain: string,
): Promise<'pending' | 'active' | 'failed'> {
  const manager = createCloudflareManager();
  return await manager.checkSSLStatus(domain);
}

export async function removeTenantCustomDomain(
  domain: string,
): Promise<boolean> {
  const manager = createCloudflareManager();
  return await manager.removeCustomDomain(domain);
}

// Utility function to validate domain format
export function validateDomainFormat(domain: string): {
  valid: boolean;
  error?: string;
} {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;

  if (!domain) {
    return { valid: false, error: 'Domain is required' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Domain name is too long' };
  }

  if (!domainRegex.test(domain)) {
    return { valid: false, error: 'Invalid domain format' };
  }

  // Check for reserved domains
  const reservedDomains = [
    'localhost',
    '123legaldoc.com',
    'www.123legaldoc.com',
  ];
  if (reservedDomains.includes(domain.toLowerCase())) {
    return { valid: false, error: 'This domain is reserved' };
  }

  return { valid: true };
}

// Generate domain setup instructions
export function generateDomainSetupInstructions(
  domain: string,
  verificationToken: string,
): {
  nameServers: string[];
  verificationRecord: { type: string; name: string; value: string };
  steps: string[];
} {
  return {
    nameServers: ['ns1.123legaldoc.com', 'ns2.123legaldoc.com'],
    verificationRecord: {
      type: 'TXT',
      name: `_123legaldoc-verification.${domain}`,
      value: verificationToken,
    },
    steps: [
      "1. Add the verification TXT record to your domain's DNS settings",
      "2. Point your domain's nameservers to our nameservers",
      '3. Wait 24-48 hours for DNS propagation',
      "4. We'll automatically verify and activate your domain",
      '5. SSL certificate will be provisioned automatically',
    ],
  };
}
