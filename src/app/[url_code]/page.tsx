import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { handleGetShortUrl } from "@/actions/short-url";
import { trackClick } from "@/lib/analytics/tracker";
import { generateRedirectLink } from "@/lib/helper/short-url";

export default async function GetUrlPage({
  params,
}: {
  params: Promise<{ url_code: string }>;
}) {
  const { url_code } = await params;
  let redirectLink = "/";

  if (url_code) {
    try {
      const { data } = await handleGetShortUrl(url_code);
      redirectLink = generateRedirectLink(data.original_url);

      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") || headersList.get("cf-connecting-ip") || "unknown";
      const userAgent = headersList.get("user-agent") || "unknown";
      const referer = headersList.get("referer") || "unknown";
      const language = headersList.get("accept-language")?.split(',')[0] || undefined;

      // Track click (fire-and-forget, won't block redirect)
      trackClick({
        shortUrl: url_code,
        originalUrl: data.original_url,
        ip,
        userAgent,
        referer,
        language,
      });

    } catch (err: any) {
      console.log("Error fetching short url", err);
    }
  }

  return redirect(redirectLink, RedirectType.replace);
}
