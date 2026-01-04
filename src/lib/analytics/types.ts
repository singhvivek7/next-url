/**
 * Analytics Types
 * Used by the simplified direct-write tracker
 */

export interface TrackClickPayload {
    shortUrl: string;
    originalUrl?: string;
    ip?: string;
    userAgent?: string;
    referer?: string;
    language?: string;
    country?: string;
    city?: string;
    device?: string;
    os?: string;
    browser?: string;
}

export interface ClickRecord {
    id: string;
    url_id: string;
    ip_address?: string;
    user_agent?: string;
    referer?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
    created_at: Date;
}
