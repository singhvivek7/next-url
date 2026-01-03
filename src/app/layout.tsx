import "./globals.css";

import { ConfigStyleProvider } from "@/components/config-style-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
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
    url: process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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
          {children}
          <Toaster position="bottom-right" richColors />
        </ConfigStyleProvider>
      </body>
    </html>
  );
};
