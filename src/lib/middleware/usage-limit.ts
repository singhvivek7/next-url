import { ApiError } from "@/lib/helper/async-handler";
import client from "@/lib/helper/db";

export const checkUrlLimit = async (userId: string) => {
    // 1. Get user's plan
    const user = await client.user.findUnique({
        where: { id: userId },
        select: { plan_details: true }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const limitsJson = (user.plan_details?.limits || { urls: 3, clicks: 1000 }) as { urls: number; clicks: number };
    const limit = limitsJson.urls;

    if (limit === -1) return true;

    // 2. Count current URLs
    const count = await client.url.count({
        where: { user_id: userId }
    });

    // 3. Check if limit reached
    if (count >= limit) {
        throw new ApiError(403, `Plan limit reached. You can only create ${limit} links on the ${user.plan_details?.name || "BASIC Plan"}. Please upgrade to create more.`);
    }

    return true;
};
