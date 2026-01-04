import client from "@/lib/helper/db";

import { analyticsEmitter } from "./emitter";
import { ANALYTICS_EVENTS, TrackViewPayload } from "./types";

// Initialize analytics listener
function initializeAnalyticsListener() {
    // Use a symbol to track if listener is registered
    const LISTENER_KEY = Symbol.for('analytics_listener_registered');
    const globalAny = global as any;

    if (!globalAny[LISTENER_KEY]) {
        analyticsEmitter.on(ANALYTICS_EVENTS.TRACK_VIEW, async (payload: TrackViewPayload) => {
            try {
                console.log(`[Analytics] View tracked for ${payload.shortUrl} IP=${payload.ip || 'unknown'}`);
                console.log(`[Analytics] Payload:`, JSON.stringify(payload, null, 2));

                // Find the URL first to get its ID with timeout
                console.log(`[Analytics] Looking up URL: ${payload.shortUrl}`);

                const urlPromise = client.url.findUnique({
                    where: { short_url: payload.shortUrl },
                    select: { id: true }
                });

                // Add 5 second timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Database query timeout')), 5000)
                );

                const url = await Promise.race([urlPromise, timeoutPromise]) as { id: string } | null;

                if (!url) {
                    console.error(`[Analytics] URL not found: ${payload.shortUrl}`);
                    return;
                }

                console.log(`[Analytics] Found URL with ID: ${url.id}`);

                // Record the click with timeout
                console.log(`[Analytics] Creating click record...`);

                const clickPromise = client.click.create({
                    data: {
                        url_id: url.id,
                        ip_address: payload.ip,
                        user_agent: payload.userAgent,
                        referer: payload.referer
                    }
                });

                const click = await Promise.race([clickPromise, timeoutPromise]) as any;

                console.log(`[Analytics] Click recorded successfully for ${payload.shortUrl} with ID: ${click.id}`);

            } catch (error) {
                console.error("[Analytics] Error processing view event:", error);
                console.error("[Analytics] Error details:", {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    payload
                });
            }
        });

        globalAny[LISTENER_KEY] = true;
        console.log("[Analytics] Listener registered successfully");
    }
}

// Initialize immediately when module is loaded
initializeAnalyticsListener();

export const trackLinkView = (payload: TrackViewPayload) => {
    console.log(`[Analytics] Emitting track view event for ${payload.shortUrl}`);
    analyticsEmitter.emit(ANALYTICS_EVENTS.TRACK_VIEW, payload);
};
