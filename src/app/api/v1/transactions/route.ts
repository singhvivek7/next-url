import { NextRequest } from "next/server";

import { asyncHandler, successResponse } from "@/lib/helper/async-handler";
import client from "@/lib/helper/db";
import { getTokenData } from "@/lib/helper/jwt";

export const GET = asyncHandler(async (req: NextRequest) => {
    const token = getTokenData(req);

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        client.transaction.findMany({
            where: { user_id: token.user_id },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit
        }),
        client.transaction.count({ where: { user_id: token.user_id } })
    ]);

    return successResponse(transactions, "Transactions fetched successfully", 200, {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    });
});
