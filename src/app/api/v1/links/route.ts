import { NextRequest, NextResponse } from "next/server";

import { asyncHandler } from "@/lib/helper/async-handler";
import client from "@/lib/helper/db";
import { getTokenData } from "@/lib/helper/jwt";

export const GET = asyncHandler(async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const decodedToken = getTokenData(req);

    const where: any = {};
    if (decodedToken.role !== 'SUPER_ADMIN') {
        where.user_id = decodedToken.user_id;
    }

    const [links, total] = await Promise.all([
        client.url.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                user_id: true,
                clicks: true,
                expires_at: true,
                is_active: true,
                original_url: true,
                short_url: true,
                created_at: true,
                updated_at: true
            }
        }),
        client.url.count({
            where
        })
    ])

    return NextResponse.json({
        message: 'success',
        data: links,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
});