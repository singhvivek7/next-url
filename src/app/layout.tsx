import "./globals.css";

import { Suspense } from "react";

import { ConfigStyleProvider } from "@/components/config-style-provider";
import { Loader } from "@/components/landing/loader";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { QueryProvider } from "@/providers/query-provider";
import { fontPrimary, fontSecondary } from "@/utils/fonts";
import meta from "@/utils/meta";

export const metadata = meta.homepage;

export default ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: env.NEXT_PUBLIC_APP_BASE_URL || siteConfig.url,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontPrimary.className} ${fontPrimary.variable} ${fontSecondary.variable} antialiased scroll-smooth`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConfigStyleProvider>
          <Suspense fallback={<Loader />}>
            <QueryProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </QueryProvider>
          </Suspense>
        </ConfigStyleProvider>
      </body>
    </html>
  );
};
