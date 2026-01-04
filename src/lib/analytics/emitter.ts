import EventEmitter from 'events';

class AnalyticsEmitter extends EventEmitter { }

const globalForAnalytics = global as unknown as { analyticsEmitter: AnalyticsEmitter };

export const analyticsEmitter = globalForAnalytics.analyticsEmitter || new AnalyticsEmitter();

// Store singleton in global for both dev and production to prevent multiple instances
if (!globalForAnalytics.analyticsEmitter) {
    globalForAnalytics.analyticsEmitter = analyticsEmitter;
}
