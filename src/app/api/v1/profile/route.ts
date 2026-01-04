import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/app/constant/auth.constant";
import { asyncHandler, successResponse, throwUnauthorized } from "@/lib/helper/async-handler";
import client from "@/lib/helper/db";
import { getTokenData } from "@/lib/helper/jwt";

export const GET = asyncHandler(async (request: NextRequest) => {
    const decodedToken = getTokenData(request);
    const user = await client.user.findFirst({
        where: {
            id: decodedToken.user_id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            username: true,
            avatar: true,
            plan: true,
            plan_id: true,
            plan_details: true,
            created_at: true,
            updated_at: true,
        }
    })
    if (!user) {
        (await cookies()).delete(AUTH_COOKIE_NAME);
        throwUnauthorized();
    }
    return successResponse(user, "User profile fetched successfully");
})