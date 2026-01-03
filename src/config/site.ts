export const siteConfig = {
    name: "NextLink",
    version: "v2.0",
    url: "https://next-link-v2.vercel.app",
    description: "The infrastructure for modern links.",
    logo: "/logo/light.svg", // Fallback
    logos: {
        light: "/logo/dark.svg",
        dark: "/logo/light.svg",
    },
    nav: [
        { name: "Product", href: "#product" },
        { name: "Solutions", href: "#solutions" },
        { name: "Enterprise", href: "#enterprise" },
        { name: "Pricing", href: "#pricing" },
    ],
    hero: {
        badge: "System Operational",
        titlePrefix: "Engineered for",
        rotatingWords: ["modern links.", "growth teams.", "global scale.", "smart routing.", "deep analytics."],
        description: "High-performance URL shortening for engineering teams. Real-time analytics, edge caching, and 99.99% uptime.",
        trustedBy: [
            "VERCEL",
            "STRIPE",
            "LINEAR",
            "NOTION",
            "RAYCAST",
        ]
    },
    features: [
        // Extracted from what we've seen or standard features if dynamic
    ],
    pricing: [
        {
            name: "Starter",
            price: "$0",
            period: "/mo",
            description: "For individuals and hobbyists just getting started.",
            features: ["1,000 links/mo", "Basic analytics", "Community support"],
            cta: "Start for free",
            highlighted: false
        },
        {
            name: "Pro",
            price: "$29",
            period: "/mo",
            description: "For growing teams that need more power and customization.",
            features: ["Unlimited links", "Advanced analytics", "Custom domains (5)", "Team seats (5)", "Priority support"],
            cta: "Get Started",
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "Custom contracts, SLAs, and dedicated infrastructure.",
            features: ["Unlimited everything", "SSO / SAML", "99.99% Uptime SLA", "Dedicated account manager", "Audit logs"],
            cta: "Contact Sales",
            highlighted: false
        }
    ],
    testimonials: [
        {
            quote: "NextLink transformed our marketing campaigns. The analytics are incredibly detailed, and the custom domains feature helped us maintain brand consistency.",
            author: "Sarah Chen",
            role: "Head of Marketing",
            company: "TechFlow",
        },
        {
            quote: "We switched from Bitly to NextLink and haven't looked back. The API is well-documented, and the team features make collaboration effortless.",
            author: "Marcus Rodriguez",
            role: "Engineering Lead",
            company: "StartupX",
        },
        {
            quote: "The smart targeting feature alone increased our conversion rates by 40%. It's not just a URL shortener—it's a growth tool.",
            author: "Emily Watson",
            role: "Growth Manager",
            company: "ScaleUp",
        },
    ],
    faq: [
        { q: "How is latency measured?", a: "Latency is measured from the moment a request hits our edge network to the first byte of the redirect response." },
        { q: "Can I bring my own domain?", a: "Yes, you can configure unlimited custom domains by updating your DNS records to point to our edge nodes." },
        { q: "What happens if I exceed my limit?", a: "We don't throttle traffic. If you exceed your plan limits, we'll reach out to discuss upgrading to a more suitable tier." },
        { q: "Is data encrypted?", a: "All data is encrypted at rest and in transit using industry-standard TLS 1.3 and AES-256 encryption." },
    ],
    cta: {
        title: "Build better links.",
        description: "Start free. Scale infinitely.",
        primaryButton: "Get Started",
        secondaryButton: "Contact Sales"
    },
    footer: {
        columns: [
            // Basic placeholder, will need to check footer.tsx content to be exact if needed, 
            // but usually simplistic footer data is enough.
        ]
    },
    theme: {
        cssVars: {
            background: "hsl(0 0% 2%)",
            foreground: "hsl(210 40% 98%)",
            card: "hsl(0 0% 100% / 0.03)",
            cardForeground: "hsl(210 40% 98%)",
            popover: "hsl(240 5% 4%)",
            popoverForeground: "hsl(210 40% 98%)",
            primary: "hsl(239 84% 67%)",
            primaryForeground: "hsl(0 0% 100%)",
            secondary: "hsl(271 91% 65%)",
            secondaryForeground: "hsl(0 0% 100%)",
            muted: "hsl(0 0% 100% / 0.05)",
            mutedForeground: "hsl(215 16% 47%)",
            accent: "hsl(239 84% 67% / 0.1)",
            accentForeground: "hsl(210 40% 98%)",
            destructive: "hsl(0 84% 60%)",
            destructiveForeground: "hsl(0 0% 100%)",
            border: "hsl(0 0% 100% / 0.1)",
            input: "hsl(0 0% 100% / 0.1)",
            ring: "hsl(239 84% 67%)",
            radius: "0.75rem"
        }
    }
};
