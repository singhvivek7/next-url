import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
    device: string;      // mobile, tablet, desktop
    browser: string;     // Chrome, Firefox, Safari, etc.
    os: string;          // Windows, macOS, iOS, Android, etc.
    deviceModel?: string; // iPhone, Samsung Galaxy, etc.
}

export interface LocationInfo {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    isp?: string;
    org?: string;
    asn?: string;
}

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        deviceModel: result.device.model || undefined,
    };
}

/**
 * Get location from IP address using ipapi.co (free tier: 1000 requests/day)
 * Alternative: ip-api.com (free, no key needed, 45 requests/minute)
 */
export async function getLocationFromIP(ip: string): Promise<LocationInfo> {
    // Skip for localhost/private IPs
    if (!ip || ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '127.0.0.1') {
        return {};
    }

    try {
        // Using ip-api.com (free, no API key needed)
        // Fields: status, country, city, regionName, timezone, isp, org, as
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,timezone,isp,org,as`, {
            signal: AbortSignal.timeout(2000), // 2 second timeout
        });

        if (!response.ok) {
            return {};
        }

        const data = await response.json();

        if (data.status === 'success') {
            return {
                country: data.country,
                city: data.city,
                region: data.regionName,
                timezone: data.timezone,
                isp: data.isp,
                org: data.org,
                asn: data.as,
            };
        }

        return {};
    } catch (error) {
        // Silently fail - location is optional
        return {};
    }
}

/**
 * Alternative: Get location from Cloudflare headers (if using Cloudflare)
 * These headers are automatically added by Cloudflare
 */
export function getLocationFromCloudflare(headers: Headers): LocationInfo {
    return {
        country: headers.get('cf-ipcountry') || undefined,
        city: headers.get('cf-ipcity') || undefined,
        region: headers.get('cf-region') || undefined,
        timezone: headers.get('cf-timezone') || undefined,
    };
}

/**
 * Get comprehensive analytics data
 */
export async function getAnalyticsData(
    userAgent: string,
    ip: string,
    headers?: Headers
): Promise<DeviceInfo & LocationInfo> {
    // Parse device info
    const deviceInfo = parseUserAgent(userAgent);

    // Try Cloudflare headers first (instant, no API call)
    if (headers) {
        const cfLocation = getLocationFromCloudflare(headers);
        if (cfLocation.country) {
            return { ...deviceInfo, ...cfLocation };
        }
    }

    // Fallback to IP geolocation API
    const locationInfo = await getLocationFromIP(ip);

    return { ...deviceInfo, ...locationInfo };
}
