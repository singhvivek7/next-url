import { NextRequest, NextResponse } from "next/server";

import { asyncHandler, throwBadRequest } from "@/lib/helper/async-handler";
import { cache } from "@/lib/helper/cache";
import client from "@/lib/helper/db";
import { getTokenData } from "@/lib/helper/jwt";
import { generateUniqueShortUrl } from "@/lib/helper/short-url";
import { shortUrlSchema } from "@/lib/helper/validation";
import { cacheUrlData } from "@/lib/services/url.service";

const isUrlExists = async (url: string) => {
  if (cache.has(`url:${url}`)) return true;

  const count = await client.url.count({
    where: {
      short_url: url,
    },
  });

  return count > 0;
};

import { IJwtPayload } from "@/app/types/auth.type";
import { checkUrlLimit } from "@/lib/middleware/usage-limit";

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { success, data } = shortUrlSchema.safeParse(body);

  let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Handle multiple IPs in x-forwarded-for (e.g. "client, proxy1, proxy2")
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  let finalUserId: string | undefined;
  let userPlan: string | undefined;

  // Try to get token data, but don't fail if user is not authenticated
  let tokenData: IJwtPayload | null;
  try {
    tokenData = getTokenData(req);
  } catch {
    // User is not authenticated, will be treated as anonymous
    tokenData = null;
  }

  if (tokenData) {
    finalUserId = tokenData.user_id;
    await checkUrlLimit(tokenData.user_id);

    // // Fetch user's plan to determine expiry
    // const user = await client.user.findUnique({
    //   where: { id: tokenData.user_id },
    //   select: { plan: true }
    // });

    userPlan = tokenData?.plan;

    // Set 30-day expiry for BASIC plan users
    if (userPlan === "BASIC") {
      body.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    // IP-based limit check for anonymous users
    const anonymousCount = await client.url.count({
      where: {
        user_id: null,
        creator_ip: ip,
      },
    });

    if (anonymousCount >= 3) {
      return throwBadRequest(
        "Free limit reached. Please login to create more links."
      );
    }

    // For anonymous users, expire in 3 days
    body.expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    body.creator_ip = ip;
  }

  if (!success) {
    return throwBadRequest("Invalid url");
  }

  const short_url = await generateUniqueShortUrl({
    length: 6,
    ensureUnique: async (url: string) => !(await isUrlExists(url)),
  });

  const newUrl = await client.url.create({
    data: {
      short_url,
      original_url: data.url,
      ...(finalUserId && { user_id: finalUserId }),
      ...(!finalUserId && { user_id: null }), // Explicitly set null for anonymous
      ...(body.expires_at && { expires_at: body.expires_at }),
      ...(!finalUserId && { creator_ip: ip }), // Only store IP for anonymous or if needed (logic below kept consistent with intent)
    },
  });

  // Cache immediately for fast resolution
  await cacheUrlData(short_url, {
    id: newUrl.id,
    original_url: newUrl.original_url,
    expires_at: newUrl.expires_at ? newUrl.expires_at.toISOString() : null, // Store string in cache usually or handle in service
    is_active: newUrl.is_active,
    user_id: newUrl.user_id
  });

  return NextResponse.json({
    status: "success",
    message: "Short url created successfully",
    data: {
      short_url,
      original_url: data.url,
    },
  });
});
