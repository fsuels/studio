// src/lib/collaboration/redis-config.ts
import Redis from 'ioredis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  retryDelayOnFailover: number;
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
}

const getRedisConfig = (): RedisConfig => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    host:
      process.env.REDIS_HOST ||
      (isProduction ? 'your-redis-cloud-host' : 'localhost'),
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
  };
};

export const createRedisConnection = (): Redis => {
  const config = getRedisConfig();

  const redis = new Redis({
    ...config,
    lazyConnect: true,
    retryDelayOnFailover: config.retryDelayOnFailover,
    enableReadyCheck: config.enableReadyCheck,
    maxRetriesPerRequest: config.maxRetriesPerRequest,
  });

  redis.on('error', (error) => {
    console.error('Redis connection error:', error);
  });

  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });

  redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
  });

  return redis;
};

export const createRedisCluster = (): Redis.Cluster | null => {
  const clusterHosts = process.env.REDIS_CLUSTER_HOSTS;

  if (!clusterHosts) {
    return null;
  }

  const hosts = clusterHosts.split(',').map((host) => {
    const [hostname, port] = host.split(':');
    return { host: hostname, port: parseInt(port || '6379') };
  });

  return new Redis.Cluster(hosts, {
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
    },
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
  });
};

// Presence-specific Redis operations
export class PresenceRedisService {
  private redis: Redis | Redis.Cluster;

  constructor(redisConnection?: Redis | Redis.Cluster) {
    this.redis = redisConnection || createRedisConnection();
  }

  async setUserPresence(
    userId: string,
    documentId: string,
    presence: any,
  ): Promise<void> {
    const key = `presence:${documentId}:${userId}`;
    const ttl = 30; // 30 seconds TTL

    await this.redis.setex(
      key,
      ttl,
      JSON.stringify({
        ...presence,
        lastSeen: Date.now(),
        userId,
        documentId,
      }),
    );
  }

  async getUserPresence(
    userId: string,
    documentId: string,
  ): Promise<any | null> {
    const key = `presence:${documentId}:${userId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async getDocumentPresence(documentId: string): Promise<any[]> {
    const pattern = `presence:${documentId}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length === 0) return [];

    const presenceData = await this.redis.mget(...keys);
    return presenceData
      .filter((data) => data !== null)
      .map((data) => JSON.parse(data!));
  }

  async removeUserPresence(userId: string, documentId: string): Promise<void> {
    const key = `presence:${documentId}:${userId}`;
    await this.redis.del(key);
  }

  async extendPresence(userId: string, documentId: string): Promise<void> {
    const key = `presence:${documentId}:${userId}`;
    await this.redis.expire(key, 30);
  }

  async broadcastToDocument(documentId: string, message: any): Promise<void> {
    const channel = `doc:${documentId}`;
    await this.redis.publish(channel, JSON.stringify(message));
  }

  async subscribeToDocument(
    documentId: string,
    callback: (message: any) => void,
  ): Promise<void> {
    const subscriber = this.redis.duplicate();
    const channel = `doc:${documentId}`;

    await subscriber.subscribe(channel);
    subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing Redis message:', error);
        }
      }
    });
  }

  async getCursorPositions(documentId: string): Promise<any[]> {
    const pattern = `cursor:${documentId}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length === 0) return [];

    const cursors = await this.redis.mget(...keys);
    return cursors
      .filter((cursor) => cursor !== null)
      .map((cursor) => JSON.parse(cursor!));
  }

  async setCursorPosition(
    userId: string,
    documentId: string,
    position: any,
  ): Promise<void> {
    const key = `cursor:${documentId}:${userId}`;
    const ttl = 10; // 10 seconds TTL for cursor positions

    await this.redis.setex(
      key,
      ttl,
      JSON.stringify({
        userId,
        documentId,
        position,
        timestamp: Date.now(),
      }),
    );
  }

  async removeCursorPosition(
    userId: string,
    documentId: string,
  ): Promise<void> {
    const key = `cursor:${documentId}:${userId}`;
    await this.redis.del(key);
  }

  disconnect(): void {
    this.redis.disconnect();
  }
}

export default PresenceRedisService;
