import EventEmitter from 'eventemitter3';

import client from "@/lib/helper/db";
import { loggers } from "@/lib/logger";

import type { TrackClickPayload } from "./types";

const logger = loggers.analytics;

/**
 * Analytics Event Types
 */
type AnalyticsEvents = {
    'click:track': (payload: TrackClickPayload) => void;
    'click:tracked': (data: { shortUrl: string; clickId: string }) => void;
    'click:error': (data: { shortUrl: string; error: Error }) => void;
};

/**
 * Analytics Event Emitter
 * Handles all analytics events in the background
 */
class AnalyticsEmitter extends EventEmitter<AnalyticsEvents> {
    private static instance: AnalyticsEmitter;

    private constructor() {
        super();
        this.setupListeners();
    }

    static getInstance(): AnalyticsEmitter {
        if (!AnalyticsEmitter.instance) {
            AnalyticsEmitter.instance = new AnalyticsEmitter();
        }
        return AnalyticsEmitter.instance;
    }

    private setupListeners(): void {
        // Main click tracking listener
        this.on('click:track', async (payload) => {
            try {
                await this.processClick(payload);
            } catch (error) {
                this.emit('click:error', {
                    shortUrl: payload.shortUrl,
                    error: error instanceof Error ? error : new Error(String(error))
                });
            }
        });

        // Success listener for logging
        this.on('click:tracked', ({ shortUrl, clickId }) => {
            logger.info({ shortUrl, clickId }, 'Click tracked successfully');
        });

        // Error listener for logging
        this.on('click:error', ({ shortUrl, error }) => {
            logger.error({ err: error, shortUrl }, 'Failed to track click');
        });
    }

    private async processClick(payload: TrackClickPayload): Promise<void> {
        logger.info({
            shortUrl: payload.shortUrl,
            ip: payload.ip
        }, 'Processing click event');

        // Find the URL
        const url = await client.url.findUnique({
            where: { short_url: payload.shortUrl },
            select: { id: true }
        });

        if (!url) {
            logger.warn({ shortUrl: payload.shortUrl }, 'URL not found for tracking');
            return;
        }

        // Extract referer domain
        let refererDomain: string | undefined = undefined;
        if (payload.referer) {
            try {
                const refererUrl = new URL(payload.referer);
                refererDomain = refererUrl.hostname;
            } catch {
                // Ignore invalid URLs
            }
        }

        // Parse device info and get location (if available)
        let deviceInfo: Record<string, string | undefined> = {};
        if (payload.userAgent) {
            const { parseUserAgent, getLocationFromIP } = await import('./device-parser');
            const parsed = parseUserAgent(payload.userAgent);
            deviceInfo = {
                device: parsed.device,
                browser: parsed.browser,
                os: parsed.os,
            };

            // Get location (with timeout, won't block)
            if (payload.ip && payload.ip !== 'unknown') {
                try {
                    const location = await getLocationFromIP(payload.ip);
                    if (location.country) {
                        deviceInfo = { ...deviceInfo, ...location };
                    }
                } catch {
                    // Location is optional, continue without it
                    logger.debug('Failed to get location, continuing without it');
                }
            }
        }

        // Create click record
        const click = await client.click.create({
            data: {
                url_id: url.id,
                ip_address: payload.ip,
                user_agent: payload.userAgent,
                referer: payload.referer,
                // Basic fields
                country: deviceInfo.country,
                city: deviceInfo.city,
                region: deviceInfo.region,
                timezone: deviceInfo.timezone,
                device: deviceInfo.device,
                browser: deviceInfo.browser,
                os: deviceInfo.os,

                // Advanced metadata in separate collection
                metadata: {
                    create: {
                        referer_domain: refererDomain,
                        language: payload.language,
                        is_bot: payload.userAgent?.toLowerCase().includes('bot') ||
                            payload.userAgent?.toLowerCase().includes('crawler') || false,
                        isp: deviceInfo.isp,
                        org: deviceInfo.org,
                        asn: deviceInfo.asn,
                    }
                }
            }
        });

        this.emit('click:tracked', {
            shortUrl: payload.shortUrl,
            clickId: click.id
        });
    }
}

// Singleton instance
const analyticsEmitter = AnalyticsEmitter.getInstance();

/**
 * Track a click event - Emits event for background processing
 * This is a fire-and-forget operation that won't block the response
 */
export function trackClick(payload: TrackClickPayload): void {
    analyticsEmitter.emit('click:track', payload);
}

/**
 * Track a click with retry logic
 */
export function trackClickWithRetry(
    payload: TrackClickPayload,
    maxRetries = 3
): void {
    let attempts = 0;

    const attemptTrack = async (): Promise<void> => {
        try {
            const url = await client.url.findUnique({
                where: { short_url: payload.shortUrl },
                select: { id: true }
            });

            if (!url) {
                logger.warn({ shortUrl: payload.shortUrl }, 'URL not found');
                return;
            }

            await client.click.create({
                data: {
                    url_id: url.id,
                    ip_address: payload.ip,
                    user_agent: payload.userAgent,
                    referer: payload.referer
                }
            });

            logger.info({ shortUrl: payload.shortUrl }, 'Click tracked');
        } catch (error) {
            attempts++;
            if (attempts < maxRetries) {
                logger.warn({
                    shortUrl: payload.shortUrl,
                    attempt: attempts
                }, 'Retrying click tracking');

                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 100));
                return attemptTrack();
            }

            logger.error({
                err: error,
                shortUrl: payload.shortUrl,
                attempts
            }, 'Failed to track click after retries');
        }
    };

    // Run in background via event loop
    setImmediate(attemptTrack);
}

/**
 * Batch track multiple clicks (useful for bulk operations)
 */
export async function trackClicksBatch(payloads: TrackClickPayload[]): Promise<void> {
    try {
        const results = await Promise.allSettled(
            payloads.map(payload => {
                trackClickWithRetry(payload, 1);
                return Promise.resolve();
            })
        );

        const failed = results.filter(r => r.status === 'rejected').length;
        if (failed > 0) {
            logger.warn({ total: payloads.length, failed }, 'Some clicks failed to track');
        }
    } catch (error) {
        logger.error({ err: error }, 'Batch tracking failed');
    }
}

/**
 * Subscribe to analytics events (useful for monitoring/testing)
 */
export function onClickTracked(callback: (data: { shortUrl: string; clickId: string }) => void): () => void {
    analyticsEmitter.on('click:tracked', callback);
    return () => analyticsEmitter.off('click:tracked', callback);
}

export function onClickError(callback: (data: { shortUrl: string; error: Error }) => void): () => void {
    analyticsEmitter.on('click:error', callback);
    return () => analyticsEmitter.off('click:error', callback);
}

// Export the emitter for advanced usage
export { analyticsEmitter };
