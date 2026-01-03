import { defaultPalette } from '@/config/color-palettes'
import { siteConfig } from '@/config/site'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = `${siteConfig.name} - ${siteConfig.description}`
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    const primary = defaultPalette.cssVars.primary
    const secondary = defaultPalette.cssVars.secondary

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#000000',
                }}
            >
                {/* Gradient Background */}
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${primary} 100%)`,
                        opacity: 0.15,
                    }}
                />

                {/* Animated Circles */}
                <div
                    style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${primary}4D 0%, transparent 70%)`,
                        top: '-200px',
                        left: '-100px',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${secondary}4D 0%, transparent 70%)`,
                        bottom: '-150px',
                        right: '-100px',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Grid Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `linear-gradient(${primary}1A 1px, transparent 1px), linear-gradient(90deg, ${primary}1A 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        opacity: 0.3,
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        padding: '80px',
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    {/* Logo/Brand */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '96px',
                                fontWeight: 800,
                                background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, #EC4899 100%)`,
                                backgroundClip: 'text',
                                color: 'transparent',
                                letterSpacing: '-0.05em',
                            }}
                        >
                            {siteConfig.name}
                        </div>
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: '36px',
                            color: '#E2E8F0',
                            fontWeight: 500,
                            textAlign: 'center',
                            marginBottom: '30px',
                            maxWidth: '900px',
                        }}
                    >
                        {siteConfig.description}
                    </div>

                    {/* Features */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '40px',
                            marginTop: '20px',
                        }}
                    >
                        {['Real-time Analytics', 'Edge Caching', '99.99% Uptime'].map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px 28px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                                        boxShadow: `0 0 12px ${primary}99`,
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '22px',
                                        color: '#CBD5E1',
                                        fontWeight: 500,
                                    }}
                                >
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Accent */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 50%, #EC4899 100%)`,
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    )
}
