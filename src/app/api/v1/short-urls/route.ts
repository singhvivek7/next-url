import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/app/constant/auth.constant";
import { env } from "@/config/env";
import { asyncHandler, throwBadRequest } from "@/lib/helper/async-handler";
import { cache } from "@/lib/helper/cache";
import client from "@/lib/helper/db";
import { verifyJwt } from "@/lib/helper/jwt";
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

import { decryptData } from "@/lib/helper/storage";
import { checkUrlLimit } from "@/lib/middleware/usage-limit";

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { success, data } = shortUrlSchema.safeParse(body);

  const encryptedToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Handle multiple IPs in x-forwarded-for (e.g. "client, proxy1, proxy2")
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  let finalUserId: string | undefined;
  const token = encryptedToken ? decryptData(encryptedToken, env.JWT_SECRET as string) : null;

  if (token) {
    const { user_id } = verifyJwt(token);
    finalUserId = user_id;
    await checkUrlLimit(user_id);
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
