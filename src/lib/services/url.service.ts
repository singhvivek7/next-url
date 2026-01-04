import { cache } from "@/lib/helper/cache";
import client from "@/lib/helper/db";

export interface ShortUrlData {
    id: string;
    original_url: string;
    expires_at: Date | string | null;
    is_active: boolean;
    user_id?: string | null;
}

/**
 * Get short URL data with caching strategy (LRU Cache)
 * 1. Cache First
 * 2. DB Fallback
 * 3. Cache Update
 */
export async function getShortUrlData(code: string): Promise<ShortUrlData | null> {
    // 1. Try Cache (Sync)
    try {
        const cached = cache.get(`url:${code}`) as ShortUrlData | undefined;
        if (cached) {
            // Check expiry
            if (cached.expires_at && new Date(cached.expires_at) < new Date()) {
                cache.delete(`url:${code}`);
                return null;
            }
            return cached;
        }
    } catch {
        // Ignore
    }

    // 2. Try DB
    const url = await client.url.findUnique({
        where: { short_url: code },
        select: {
            id: true,
            original_url: true,
            expires_at: true,
            is_active: true,
            user_id: true
        }
    });

    if (!url) return null;

    // Check logical expiry/active
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        return null;
    }

    if (!url.is_active) {
        return null;
    }

    // 3. Populate Cache
    // Store object directly (LRU supports objects)
    cache.set(`url:${code}`, url);

    return url;
}

/**
 * Cache a URL manually (e.g. after creation)
 */
export async function cacheUrlData(code: string, data: Partial<ShortUrlData>) {
    cache.set(`url:${code}`, data);
}

/**
 * Remove URL from cache (e.g. after update/delete)
 */
export async function invalidateUrlCache(code: string) {
    cache.delete(`url:${code}`);
}
