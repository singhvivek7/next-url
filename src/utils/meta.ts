import { siteConfig } from "@/config/site";
import { Metadata } from "next";

type Page = "homepage" | "about" | "contact" | "privacy" | "terms";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url;
const siteName = siteConfig.name;
const siteDescription = `${siteConfig.description} - Real-time analytics, edge caching, and 99.99% uptime.`;

const meta: Record<Page, Metadata> = {
  homepage: {
    title: {
      default: `${siteName} - ${siteConfig.description}`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: [
      "url shortener",
      "link management",
      "analytics",
      "custom domains",
      "link tracking",
      "qr codes",
      "branded links",
      "marketing tools",
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${siteName} - ${siteConfig.description}`,
      description: siteDescription,
      siteName: siteName,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${siteName} - URL Shortener`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${siteConfig.description}`,
      description: siteDescription,
      images: ["/og-image.png"],
      creator: "@nextlink",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
  },
  about: {
    title: `About - ${siteConfig.name}`,
    description: "Learn more about NextLink and our mission to build better link infrastructure.",
    openGraph: {
      title: `About - ${siteConfig.name}`,
      description: "Learn more about NextLink and our mission to build better link infrastructure.",
      url: `${baseUrl}/about`,
      type: "website",
    },
  },
  contact: {
    title: `Contact - ${siteConfig.name}`,
    description: "Get in touch with the NextLink team.",
    openGraph: {
      title: `Contact - ${siteConfig.name}`,
      description: "Get in touch with the NextLink team.",
      url: `${baseUrl}/contact`,
      type: "website",
    },
  },
  privacy: {
    title: `Privacy Policy - ${siteConfig.name}`,
    description: "Privacy Policy of NextLink - How we handle your data.",
    openGraph: {
      title: `Privacy Policy - ${siteConfig.name}`,
      description: "Privacy Policy of NextLink - How we handle your data.",
      url: `${baseUrl}/privacy`,
      type: "website",
    },
  },
  terms: {
    title: `Terms and Conditions - ${siteConfig.name}`,
    description: "Terms and Conditions of NextLink service.",
    openGraph: {
      title: `Terms and Conditions - ${siteConfig.name}`,
      description: "Terms and Conditions of NextLink service.",
      url: `${baseUrl}/terms`,
      type: "website",
    },
  },
};

export default meta;

