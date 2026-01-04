import { LRUCache } from 'lru-cache';

const globalForCache = global as unknown as { cache: LRUCache<string, any> | undefined };

// Configure LRU Cache
export const cache =
    globalForCache.cache ||
    new LRUCache<string, any>({
        max: 10000, // Maximum number of items
        ttl: 1000 * 60 * 60 * 24 * 3, // 3 days TTL
        allowStale: false,
        updateAgeOnGet: true,
    });

if (process.env.NODE_ENV !== 'production') globalForCache.cache = cache;
