// Global Multi-Region Deployment Management System
// Handles worldwide deployment, scaling, and disaster recovery

interface Region {
  id: string;
  name: string;
  code: string;
  continent: string;
  country: string[];
  timezone: string;
  dataCenter: {
    provider: 'aws' | 'gcp' | 'azure' | 'cloudflare';
    location: string;
    capacity: 'small' | 'medium' | 'large' | 'xlarge';
    specifications: {
      cpu: string;
      memory: string;
      storage: string;
      bandwidth: string;
    };
  };
  compliance: {
    regulations: string[];
    dataResidency: boolean;
    certifications: string[];
  };
  networking: {
    latency: number; // milliseconds to other regions
    throughput: number; // Mbps
    availability: number; // 99.x%
  };
  costProfile: {
    computeCostPerHour: number;
    storageCostPerGB: number;
    transferCostPerGB: number;
    currency: string;
  };
}

interface DeploymentConfiguration {
  id: string;
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  regions: string[];
  strategy: 'blue_green' | 'rolling' | 'canary' | 'regional_rollout';
  scaling: {
    autoScaling: boolean;
    minInstances: number;
    maxInstances: number;
    targetCPU: number;
    targetMemory: number;
  };
  loadBalancing: {
    algorithm: 'round_robin' | 'least_connections' | 'ip_hash' | 'geolocation';
    healthCheck: {
      path: string;
      interval: number;
      timeout: number;
      retries: number;
    };
  };
  caching: {
    enabled: boolean;
    ttl: number;
    strategy: 'aggressive' | 'standard' | 'conservative';
    regions: string[];
  };
  database: {
    strategy: 'single_master' | 'multi_master' | 'read_replicas' | 'sharded';
    backupStrategy: 'continuous' | 'daily' | 'weekly';
    replicationLag: number; // milliseconds
  };
}

interface DeploymentStatus {
  deploymentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
  progress: number; // 0-100
  startTime: string;
  endTime?: string;
  regionStatuses: Record<string, {
    status: 'pending' | 'deploying' | 'healthy' | 'unhealthy' | 'failed';
    instances: number;
    healthyInstances: number;
    lastHealthCheck: string;
    deploymentTime: number; // milliseconds
  }>;
  metrics: {
    totalRequests: number;
    errorRate: number;
    averageResponseTime: number;
    throughput: number;
  };
  issues: Array<{
    region: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

interface TrafficDistribution {
  strategy: 'geographic' | 'performance' | 'cost_optimized' | 'compliance_first';
  rules: Array<{
    condition: string;
    targetRegion: string;
    weight: number;
    priority: number;
  }>;
  fallbackRegion: string;
  geolocationMapping: Record<string, string>; // country code -> region
}

export class GlobalDeploymentManager {
  private static instance: GlobalDeploymentManager;
  private regions: Map<string, Region> = new Map();
  private deployments: Map<string, DeploymentConfiguration> = new Map();
  private deploymentStatuses: Map<string, DeploymentStatus> = new Map();
  private trafficDistribution: TrafficDistribution;

  constructor() {
    this.initializeRegions();
    this.setupTrafficDistribution();
    this.startHealthMonitoring();
  }

  static getInstance(): GlobalDeploymentManager {
    if (!GlobalDeploymentManager.instance) {
      GlobalDeploymentManager.instance = new GlobalDeploymentManager();
    }
    return GlobalDeploymentManager.instance;
  }

  // Initialize global regions
  private initializeRegions(): void {
    console.log('🌍 Initializing global deployment regions...');

    const regions: Region[] = [
      {
        id: 'us-east-1',
        name: 'US East (N. Virginia)',
        code: 'USE1',
        continent: 'North America',
        country: ['US'],
        timezone: 'America/New_York',
        dataCenter: {
          provider: 'aws',
          location: 'Ashburn, Virginia',
          capacity: 'xlarge',
          specifications: {
            cpu: '128 vCPUs',
            memory: '512 GB',
            storage: '10 TB NVMe SSD',
            bandwidth: '100 Gbps'
          }
        },
        compliance: {
          regulations: ['SOX', 'CCPA', 'HIPAA'],
          dataResidency: true,
          certifications: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP']
        },
        networking: {
          latency: 0, // Base region
          throughput: 100000,
          availability: 99.99
        },
        costProfile: {
          computeCostPerHour: 0.096,
          storageCostPerGB: 0.023,
          transferCostPerGB: 0.09,
          currency: 'USD'
        }
      },
      {
        id: 'eu-west-1',
        name: 'Europe (Ireland)',
        code: 'EUW1',
        continent: 'Europe',
        country: ['IE', 'GB', 'FR', 'DE', 'NL', 'BE'],
        timezone: 'Europe/Dublin',
        dataCenter: {
          provider: 'aws',
          location: 'Dublin, Ireland',
          capacity: 'large',
          specifications: {
            cpu: '64 vCPUs',
            memory: '256 GB',
            storage: '5 TB NVMe SSD',
            bandwidth: '50 Gbps'
          }
        },
        compliance: {
          regulations: ['GDPR', 'ePrivacy Directive'],
          dataResidency: true,
          certifications: ['ISO 27001', 'SOC 2 Type II']
        },
        networking: {
          latency: 89,
          throughput: 50000,
          availability: 99.95
        },
        costProfile: {
          computeCostPerHour: 0.104,
          storageCostPerGB: 0.025,
          transferCostPerGB: 0.087,
          currency: 'EUR'
        }
      },
      {
        id: 'ap-southeast-1',
        name: 'Asia Pacific (Singapore)',
        code: 'APS1',
        continent: 'Asia',
        country: ['SG', 'MY', 'TH', 'ID', 'VN', 'PH'],
        timezone: 'Asia/Singapore',
        dataCenter: {
          provider: 'aws',
          location: 'Singapore',
          capacity: 'medium',
          specifications: {
            cpu: '32 vCPUs',
            memory: '128 GB',
            storage: '2 TB NVMe SSD',
            bandwidth: '25 Gbps'
          }
        },
        compliance: {
          regulations: ['PDPA Singapore', 'Privacy Act'],
          dataResidency: true,
          certifications: ['ISO 27001']
        },
        networking: {
          latency: 178,
          throughput: 25000,
          availability: 99.9
        },
        costProfile: {
          computeCostPerHour: 0.112,
          storageCostPerGB: 0.028,
          transferCostPerGB: 0.12,
          currency: 'USD'
        }
      },
      {
        id: 'sa-east-1',
        name: 'South America (São Paulo)',
        code: 'SAE1',
        continent: 'South America',
        country: ['BR', 'AR', 'CL', 'PE', 'CO'],
        timezone: 'America/Sao_Paulo',
        dataCenter: {
          provider: 'aws',
          location: 'São Paulo, Brazil',
          capacity: 'small',
          specifications: {
            cpu: '16 vCPUs',
            memory: '64 GB',
            storage: '1 TB NVMe SSD',
            bandwidth: '10 Gbps'
          }
        },
        compliance: {
          regulations: ['LGPD', 'Marco Civil da Internet'],
          dataResidency: true,
          certifications: ['ISO 27001']
        },
        networking: {
          latency: 145,
          throughput: 10000,
          availability: 99.5
        },
        costProfile: {
          computeCostPerHour: 0.119,
          storageCostPerGB: 0.033,
          transferCostPerGB: 0.15,
          currency: 'USD'
        }
      },
      {
        id: 'ap-northeast-1',
        name: 'Asia Pacific (Tokyo)',
        code: 'APN1',
        continent: 'Asia',
        country: ['JP', 'KR'],
        timezone: 'Asia/Tokyo',
        dataCenter: {
          provider: 'aws',
          location: 'Tokyo, Japan',
          capacity: 'medium',
          specifications: {
            cpu: '32 vCPUs',
            memory: '128 GB',
            storage: '2 TB NVMe SSD',
            bandwidth: '25 Gbps'
          }
        },
        compliance: {
          regulations: ['Personal Information Protection Law'],
          dataResidency: true,
          certifications: ['ISO 27001', 'ISMS']
        },
        networking: {
          latency: 156,
          throughput: 25000,
          availability: 99.9
        },
        costProfile: {
          computeCostPerHour: 0.108,
          storageCostPerGB: 0.027,
          transferCostPerGB: 0.114,
          currency: 'JPY'
        }
      }
    ];

    regions.forEach(region => {
      this.regions.set(region.id, region);
    });

    console.log(`✅ Initialized ${regions.length} global regions`);
  }

  // Setup intelligent traffic distribution
  private setupTrafficDistribution(): void {
    this.trafficDistribution = {
      strategy: 'geographic',
      rules: [
        {
          condition: 'country in [US, CA, MX]',
          targetRegion: 'us-east-1',
          weight: 100,
          priority: 1
        },
        {
          condition: 'country in [GB, FR, DE, ES, IT, NL, BE, IE]',
          targetRegion: 'eu-west-1',
          weight: 100,
          priority: 1
        },
        {
          condition: 'country in [SG, MY, TH, ID, VN, PH]',
          targetRegion: 'ap-southeast-1',
          weight: 100,
          priority: 1
        },
        {
          condition: 'country in [BR, AR, CL, PE, CO]',
          targetRegion: 'sa-east-1',
          weight: 100,
          priority: 1
        },
        {
          condition: 'country in [JP, KR]',
          targetRegion: 'ap-northeast-1',
          weight: 100,
          priority: 1
        }
      ],
      fallbackRegion: 'us-east-1',
      geolocationMapping: {
        'US': 'us-east-1',
        'CA': 'us-east-1',
        'MX': 'us-east-1',
        'GB': 'eu-west-1',
        'FR': 'eu-west-1',
        'DE': 'eu-west-1',
        'ES': 'eu-west-1',
        'IT': 'eu-west-1',
        'SG': 'ap-southeast-1',
        'MY': 'ap-southeast-1',
        'TH': 'ap-southeast-1',
        'BR': 'sa-east-1',
        'AR': 'sa-east-1',
        'JP': 'ap-northeast-1',
        'KR': 'ap-northeast-1'
      }
    };

    console.log('🌐 Traffic distribution configured for global routing');
  }

  // Create global deployment
  async createGlobalDeployment(
    name: string,
    version: string,
    targetRegions: string[],
    strategy: DeploymentConfiguration['strategy'] = 'regional_rollout'
  ): Promise<DeploymentConfiguration> {
    console.log(`🚀 Creating global deployment: ${name} v${version}`);

    const deploymentId = this.generateDeploymentId();

    // Validate regions
    const invalidRegions = targetRegions.filter(region => !this.regions.has(region));
    if (invalidRegions.length > 0) {
      throw new Error(`Invalid regions: ${invalidRegions.join(', ')}`);
    }

    const deployment: DeploymentConfiguration = {
      id: deploymentId,
      name,
      version,
      environment: 'production',
      regions: targetRegions,
      strategy,
      scaling: {
        autoScaling: true,
        minInstances: 2,
        maxInstances: 20,
        targetCPU: 70,
        targetMemory: 80
      },
      loadBalancing: {
        algorithm: 'geolocation',
        healthCheck: {
          path: '/health',
          interval: 30,
          timeout: 5,
          retries: 3
        }
      },
      caching: {
        enabled: true,
        ttl: 3600,
        strategy: 'aggressive',
        regions: targetRegions
      },
      database: {
        strategy: 'read_replicas',
        backupStrategy: 'continuous',
        replicationLag: 100
      }
    };

    this.deployments.set(deploymentId, deployment);

    // Initialize deployment status
    const status: DeploymentStatus = {
      deploymentId,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString(),
      regionStatuses: {},
      metrics: {
        totalRequests: 0,
        errorRate: 0,
        averageResponseTime: 0,
        throughput: 0
      },
      issues: []
    };

    // Initialize region statuses
    targetRegions.forEach(regionId => {
      status.regionStatuses[regionId] = {
        status: 'pending',
        instances: 0,
        healthyInstances: 0,
        lastHealthCheck: new Date().toISOString(),
        deploymentTime: 0
      };
    });

    this.deploymentStatuses.set(deploymentId, status);

    console.log(`✅ Global deployment created: ${deploymentId}`);
    return deployment;
  }

  // Execute deployment across regions
  async executeDeployment(deploymentId: string): Promise<void> {
    console.log(`⚡ Executing deployment: ${deploymentId}`);

    const deployment = this.deployments.get(deploymentId);
    const status = this.deploymentStatuses.get(deploymentId);

    if (!deployment || !status) {
      throw new Error(`Deployment ${deploymentId} not found`);
    }

    status.status = 'in_progress';
    status.startTime = new Date().toISOString();

    try {
      switch (deployment.strategy) {
        case 'regional_rollout':
          await this.executeRegionalRollout(deployment, status);
          break;
        case 'blue_green':
          await this.executeBlueGreenDeployment(deployment, status);
          break;
        case 'canary':
          await this.executeCanaryDeployment(deployment, status);
          break;
        case 'rolling':
          await this.executeRollingDeployment(deployment, status);
          break;
      }

      status.status = 'completed';
      status.progress = 100;
      status.endTime = new Date().toISOString();

      console.log(`✅ Deployment completed successfully: ${deploymentId}`);
    } catch (error) {
      status.status = 'failed';
      status.issues.push({
        region: 'global',
        severity: 'critical',
        message: `Deployment failed: ${error}`,
        timestamp: new Date().toISOString()
      });

      console.log(`❌ Deployment failed: ${deploymentId}`);
      throw error;
    }
  }

  // Regional rollout strategy
  private async executeRegionalRollout(
    deployment: DeploymentConfiguration,
    status: DeploymentStatus
  ): Promise<void> {
    console.log('🌍 Executing regional rollout deployment...');

    // Deploy to regions in order of priority (latency/capacity)
    const sortedRegions = this.sortRegionsByPriority(deployment.regions);
    
    for (const regionId of sortedRegions) {
      console.log(`📍 Deploying to region: ${regionId}`);
      
      const regionStatus = status.regionStatuses[regionId];
      regionStatus.status = 'deploying';
      
      const startTime = Date.now();
      
      try {
        // Simulate deployment process
        await this.deployToRegion(regionId, deployment);
        
        regionStatus.status = 'healthy';
        regionStatus.instances = deployment.scaling.minInstances;
        regionStatus.healthyInstances = deployment.scaling.minInstances;
        regionStatus.deploymentTime = Date.now() - startTime;
        regionStatus.lastHealthCheck = new Date().toISOString();
        
        // Update overall progress
        const completedRegions = Object.values(status.regionStatuses)
          .filter(rs => rs.status === 'healthy').length;
        status.progress = (completedRegions / deployment.regions.length) * 100;
        
        console.log(`✅ Successfully deployed to ${regionId}`);
        
        // Wait before next region (progressive rollout)
        if (sortedRegions.indexOf(regionId) < sortedRegions.length - 1) {
          console.log('⏳ Waiting 5 minutes before next region...');
          await this.delay(5 * 60 * 1000); // 5 minutes
        }
        
      } catch (error) {
        regionStatus.status = 'failed';
        status.issues.push({
          region: regionId,
          severity: 'critical',
          message: `Regional deployment failed: ${error}`,
          timestamp: new Date().toISOString()
        });
        
        throw new Error(`Failed to deploy to region ${regionId}: ${error}`);
      }
    }
  }

  // Blue-green deployment strategy
  private async executeBlueGreenDeployment(
    deployment: DeploymentConfiguration,
    status: DeploymentStatus
  ): Promise<void> {
    console.log('🔵🟢 Executing blue-green deployment...');

    // Deploy green environment
    for (const regionId of deployment.regions) {
      const regionStatus = status.regionStatuses[regionId];
      regionStatus.status = 'deploying';
      
      // Deploy to green environment
      await this.deployToRegion(regionId, deployment, 'green');
      
      // Health check green environment
      const isHealthy = await this.performHealthCheck(regionId, 'green');
      
      if (isHealthy) {
        // Switch traffic to green
        await this.switchTraffic(regionId, 'green');
        
        // Clean up blue environment
        await this.cleanupEnvironment(regionId, 'blue');
        
        regionStatus.status = 'healthy';
        regionStatus.instances = deployment.scaling.minInstances;
        regionStatus.healthyInstances = deployment.scaling.minInstances;
      } else {
        regionStatus.status = 'failed';
        throw new Error(`Health check failed for region ${regionId}`);
      }
    }
  }

  // Canary deployment strategy
  private async executeCanaryDeployment(
    deployment: DeploymentConfiguration,
    status: DeploymentStatus
  ): Promise<void> {
    console.log('🐤 Executing canary deployment...');

    // Start with 5% traffic
    const canaryPercentages = [5, 25, 50, 100];
    
    for (const percentage of canaryPercentages) {
      console.log(`📊 Deploying canary at ${percentage}% traffic`);
      
      for (const regionId of deployment.regions) {
        await this.deployCanaryVersion(regionId, deployment, percentage);
      }
      
      // Monitor for 10 minutes
      await this.monitorCanaryDeployment(deployment, status, percentage);
      
      if (percentage < 100) {
        console.log(`⏳ Waiting 10 minutes before increasing to next percentage...`);
        await this.delay(10 * 60 * 1000); // 10 minutes
      }
    }
  }

  // Rolling deployment strategy
  private async executeRollingDeployment(
    deployment: DeploymentConfiguration,
    status: DeploymentStatus
  ): Promise<void> {
    console.log('🔄 Executing rolling deployment...');

    for (const regionId of deployment.regions) {
      const regionStatus = status.regionStatuses[regionId];
      regionStatus.status = 'deploying';
      
      // Rolling update with 25% batches
      const instances = deployment.scaling.minInstances;
      const batchSize = Math.max(1, Math.floor(instances * 0.25));
      
      for (let i = 0; i < instances; i += batchSize) {
        const batch = Math.min(batchSize, instances - i);
        console.log(`🔄 Updating batch ${i / batchSize + 1} in ${regionId} (${batch} instances)`);
        
        await this.updateInstanceBatch(regionId, deployment, batch);
        
        // Wait between batches
        if (i + batchSize < instances) {
          await this.delay(30 * 1000); // 30 seconds
        }
      }
      
      regionStatus.status = 'healthy';
      regionStatus.instances = instances;
      regionStatus.healthyInstances = instances;
    }
  }

  // Deploy to specific region
  private async deployToRegion(
    regionId: string,
    deployment: DeploymentConfiguration,
    environment: 'blue' | 'green' = 'blue'
  ): Promise<void> {
    const region = this.regions.get(regionId);
    if (!region) {
      throw new Error(`Region ${regionId} not found`);
    }

    console.log(`🏗️ Deploying ${deployment.name} v${deployment.version} to ${region.name} (${environment})`);

    // Simulate deployment steps
    const steps = [
      'Provisioning infrastructure',
      'Deploying application containers',
      'Configuring load balancers',
      'Setting up monitoring',
      'Running health checks'
    ];

    for (const step of steps) {
      console.log(`   ${step}...`);
      await this.delay(2000); // 2 seconds per step
    }

    console.log(`✅ Deployment to ${regionId} completed`);
  }

  // Perform health check
  private async performHealthCheck(
    regionId: string,
    environment: 'blue' | 'green' = 'blue'
  ): Promise<boolean> {
    console.log(`🏥 Performing health check for ${regionId} (${environment})`);
    
    // Simulate health check
    await this.delay(5000); // 5 seconds
    
    // 95% success rate simulation
    const isHealthy = Math.random() > 0.05;
    console.log(`${isHealthy ? '✅' : '❌'} Health check ${isHealthy ? 'passed' : 'failed'} for ${regionId}`);
    
    return isHealthy;
  }

  // Switch traffic between environments
  private async switchTraffic(regionId: string, targetEnvironment: 'blue' | 'green'): Promise<void> {
    console.log(`🔀 Switching traffic to ${targetEnvironment} environment in ${regionId}`);
    await this.delay(1000);
  }

  // Cleanup old environment
  private async cleanupEnvironment(regionId: string, environment: 'blue' | 'green'): Promise<void> {
    console.log(`🧹 Cleaning up ${environment} environment in ${regionId}`);
    await this.delay(2000);
  }

  // Deploy canary version
  private async deployCanaryVersion(
    regionId: string,
    deployment: DeploymentConfiguration,
    percentage: number
  ): Promise<void> {
    console.log(`🐤 Deploying canary version to ${regionId} at ${percentage}%`);
    await this.delay(3000);
  }

  // Monitor canary deployment
  private async monitorCanaryDeployment(
    deployment: DeploymentConfiguration,
    status: DeploymentStatus,
    percentage: number
  ): Promise<void> {
    console.log(`📊 Monitoring canary deployment at ${percentage}%...`);
    
    // Simulate monitoring for 10 minutes
    for (let i = 0; i < 10; i++) {
      await this.delay(60000); // 1 minute
      
      // Check metrics
      const errorRate = Math.random() * 0.02; // 0-2% error rate
      const responseTime = 150 + Math.random() * 100; // 150-250ms
      
      status.metrics.errorRate = errorRate;
      status.metrics.averageResponseTime = responseTime;
      
      console.log(`   Minute ${i + 1}: Error rate ${(errorRate * 100).toFixed(2)}%, Response time ${responseTime.toFixed(0)}ms`);
      
      // If error rate too high, rollback
      if (errorRate > 0.05) {
        console.log('❌ Error rate too high, rolling back...');
        await this.rollbackDeployment(deployment.id);
        throw new Error('Canary deployment rolled back due to high error rate');
      }
    }
    
    console.log('✅ Canary monitoring completed successfully');
  }

  // Update instance batch
  private async updateInstanceBatch(
    regionId: string,
    deployment: DeploymentConfiguration,
    batchSize: number
  ): Promise<void> {
    console.log(`🔄 Updating ${batchSize} instances in ${regionId}`);
    await this.delay(batchSize * 1000); // 1 second per instance
  }

  // Sort regions by deployment priority
  private sortRegionsByPriority(regionIds: string[]): string[] {
    return regionIds.sort((a, b) => {
      const regionA = this.regions.get(a);
      const regionB = this.regions.get(b);
      
      if (!regionA || !regionB) return 0;
      
      // Priority: capacity, then latency, then availability
      const scoreA = this.calculateRegionScore(regionA);
      const scoreB = this.calculateRegionScore(regionB);
      
      return scoreB - scoreA; // Higher score first
    });
  }

  // Calculate region deployment score
  private calculateRegionScore(region: Region): number {
    const capacityScore = {
      'small': 1,
      'medium': 2,
      'large': 3,
      'xlarge': 4
    }[region.dataCenter.capacity];
    
    const latencyScore = Math.max(0, 200 - region.networking.latency) / 200 * 100;
    const availabilityScore = region.networking.availability;
    
    return (capacityScore * 25) + (latencyScore * 0.3) + (availabilityScore * 0.45);
  }

  // Rollback deployment
  async rollbackDeployment(deploymentId: string): Promise<void> {
    console.log(`⏪ Rolling back deployment: ${deploymentId}`);

    const status = this.deploymentStatuses.get(deploymentId);
    if (!status) {
      throw new Error(`Deployment status ${deploymentId} not found`);
    }

    status.status = 'rolled_back';
    
    // Rollback each region
    for (const regionId of Object.keys(status.regionStatuses)) {
      console.log(`⏪ Rolling back region: ${regionId}`);
      await this.rollbackRegion(regionId);
      
      status.regionStatuses[regionId].status = 'healthy';
    }

    console.log(`✅ Rollback completed for deployment: ${deploymentId}`);
  }

  // Rollback specific region
  private async rollbackRegion(regionId: string): Promise<void> {
    console.log(`⏪ Rolling back region: ${regionId}`);
    
    // Simulate rollback process
    const steps = [
      'Switching traffic to previous version',
      'Stopping new version containers',
      'Restoring previous configuration',
      'Verifying rollback success'
    ];

    for (const step of steps) {
      console.log(`   ${step}...`);
      await this.delay(1500);
    }
  }

  // Start health monitoring
  private startHealthMonitoring(): void {
    console.log('❤️ Starting continuous health monitoring...');
    
    setInterval(async () => {
      await this.performGlobalHealthCheck();
    }, 30000); // Every 30 seconds
  }

  // Perform global health check
  private async performGlobalHealthCheck(): Promise<void> {
    for (const [deploymentId, status] of this.deploymentStatuses.entries()) {
      if (status.status === 'completed') {
        for (const regionId of Object.keys(status.regionStatuses)) {
          const regionStatus = status.regionStatuses[regionId];
          
          if (regionStatus.status === 'healthy') {
            const isHealthy = await this.performHealthCheck(regionId);
            
            if (!isHealthy) {
              regionStatus.status = 'unhealthy';
              status.issues.push({
                region: regionId,
                severity: 'high',
                message: 'Health check failed',
                timestamp: new Date().toISOString()
              });
            }
            
            regionStatus.lastHealthCheck = new Date().toISOString();
          }
        }
      }
    }
  }

  // Get optimal region for user
  getOptimalRegion(userCountry: string, userLat?: number, userLon?: number): string {
    // First try geolocation mapping
    const mappedRegion = this.trafficDistribution.geolocationMapping[userCountry];
    if (mappedRegion && this.regions.has(mappedRegion)) {
      return mappedRegion;
    }

    // If coordinates provided, calculate closest region
    if (userLat !== undefined && userLon !== undefined) {
      return this.findClosestRegion(userLat, userLon);
    }

    // Fallback to default region
    return this.trafficDistribution.fallbackRegion;
  }

  // Find closest region by geographic distance
  private findClosestRegion(lat: number, lon: number): string {
    const regionCoordinates: Record<string, [number, number]> = {
      'us-east-1': [39.0458, -77.5081],        // Virginia
      'eu-west-1': [53.3498, -6.2603],         // Dublin
      'ap-southeast-1': [1.3521, 103.8198],    // Singapore
      'sa-east-1': [-23.5505, -46.6333],       // São Paulo
      'ap-northeast-1': [35.6762, 139.6503]    // Tokyo
    };

    let closestRegion = 'us-east-1';
    let minDistance = Infinity;

    for (const [regionId, coords] of Object.entries(regionCoordinates)) {
      if (this.regions.has(regionId)) {
        const distance = this.calculateDistance(lat, lon, coords[0], coords[1]);
        if (distance < minDistance) {
          minDistance = distance;
          closestRegion = regionId;
        }
      }
    }

    return closestRegion;
  }

  // Calculate distance between coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get deployment metrics
  getDeploymentMetrics(): {
    totalDeployments: number;
    activeDeployments: number;
    totalRegions: number;
    averageDeploymentTime: number;
    successRate: number;
    globalAvailability: number;
    totalInstances: number;
    healthyInstances: number;
  } {
    const allStatuses = Array.from(this.deploymentStatuses.values());
    const completed = allStatuses.filter(s => s.status === 'completed');
    const failed = allStatuses.filter(s => s.status === 'failed');
    
    const avgDeploymentTime = completed.reduce((sum, status) => {
      if (status.endTime) {
        const duration = new Date(status.endTime).getTime() - new Date(status.startTime).getTime();
        return sum + duration;
      }
      return sum;
    }, 0) / (completed.length || 1);

    const successRate = allStatuses.length > 0 ? 
      (completed.length / (completed.length + failed.length)) * 100 : 100;

    // Calculate instance counts
    let totalInstances = 0;
    let healthyInstances = 0;
    
    allStatuses.forEach(status => {
      Object.values(status.regionStatuses).forEach(regionStatus => {
        totalInstances += regionStatus.instances;
        healthyInstances += regionStatus.healthyInstances;
      });
    });

    const globalAvailability = totalInstances > 0 ? 
      (healthyInstances / totalInstances) * 100 : 100;

    return {
      totalDeployments: allStatuses.length,
      activeDeployments: allStatuses.filter(s => s.status === 'in_progress').length,
      totalRegions: this.regions.size,
      averageDeploymentTime: Math.round(avgDeploymentTime / (1000 * 60)), // minutes
      successRate: Math.round(successRate * 100) / 100,
      globalAvailability: Math.round(globalAvailability * 100) / 100,
      totalInstances,
      healthyInstances
    };
  }

  // Utility methods
  private generateDeploymentId(): string {
    return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all regions
  getAllRegions(): Region[] {
    return Array.from(this.regions.values());
  }

  // Get deployment status
  getDeploymentStatus(deploymentId: string): DeploymentStatus | undefined {
    return this.deploymentStatuses.get(deploymentId);
  }

  // Get all deployments
  getAllDeployments(): DeploymentConfiguration[] {
    return Array.from(this.deployments.values());
  }
}

// Export singleton instance
export const globalDeploymentManager = GlobalDeploymentManager.getInstance();