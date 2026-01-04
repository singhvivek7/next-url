import { NextRequest } from "next/server"

import { asyncHandler, AsyncParams, successResponse, throwNotFound } from "@/lib/helper/async-handler"
import client from "@/lib/helper/db"
import { getTokenData } from "@/lib/helper/jwt"

export const DELETE = asyncHandler(async (request: NextRequest, asyncParams: AsyncParams) => {
    const params = await asyncParams.params;
    const id = params.id || "";
    const tokenData = getTokenData(request);
    await client.url.delete({
        where: {
            id,
            user_id: tokenData.user_id
        }
    })
    return successResponse({ message: "Link deleted successfully" }, "Link deleted successfully");
})

export const PATCH = asyncHandler(async (request: NextRequest, asyncParams: AsyncParams) => {
    const params = await asyncParams.params;
    const id = params.id || "";
    const body = await request.json()
    const tokenData = getTokenData(request)
    const link = await client.url.count({
        where: {
            id,
            user_id: tokenData.user_id
        }
    })
    if (link < 1) {
        throw throwNotFound("Link not found");
    }
    await client.url.update({
        where: {
            id,
            user_id: tokenData.user_id
        },
        data: {
            is_active: body.is_active
        }
    })
    return successResponse({ message: "Link updated successfully" }, "Link updated successfully");
})

export const GET = asyncHandler(async (request: NextRequest, asyncParams: AsyncParams) => {
    const params = await asyncParams.params;
    const id = params.id || "";

    const searchParams = request.nextUrl.searchParams;
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    const endDate = endParam ? new Date(endParam) : new Date();
    // Default 7 days window if not specified
    const startDate = startParam ? new Date(startParam) : new Date(new Date().setDate(endDate.getDate() - 7));

    const tokenData = getTokenData(request);

    const link = await client.url.findUnique({
        where: {
            id,
            ...(tokenData.role === "SUPER_ADMIN" ? {} : { user_id: tokenData.user_id })
        },
        select: {
            _count: {
                select: { clicks: true }
            },
            clicks: {
                take: 50,
                orderBy: {
                    created_at: "desc"
                }
            },
            creator_ip: true,
            description: true,
            title: true,
            created_at: true,
            expires_at: true,
            id: true,
            is_active: true,
            original_url: true,
            short_url: true,
            updated_at: true,
            user_id: true
        }
    });

    if (!link) {
        throw throwNotFound("Link not found");
    }

    // Run aggregation pipeline on clicks collection
    const pipeline = [
        {
            $match: {
                url_id: { $oid: id },
                created_at: {
                    $gte: { $date: startDate.toISOString() },
                    $lte: { $date: endDate.toISOString() }
                }
            }
        },
        {
            $facet: {
                graph: [
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } }
                ],
                locations: [
                    {
                        $group: {
                            _id: "$country",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 }
                ],
                devices: [
                    {
                        $group: {
                            _id: "$device",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 }
                ],
                os: [
                    {
                        $group: {
                            _id: "$os",
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 }
                ]
            }
        }
    ];

    const aggregationResult = (await client.click.aggregateRaw({ pipeline })) as unknown as any[];
    const result = aggregationResult[0] || { graph: [], locations: [], devices: [], os: [] };

    // Fill missing dates
    const graphMap = new Map((result.graph || []).map((item: any) => [item._id, item.count]));
    const graph = [];
    const current = new Date(startDate);

    // Normalize comparison by stripping time for safety in loop
    const endDateTime = endDate.getTime();

    while (current.getTime() <= endDateTime) {
        const dateStr = current.toISOString().split('T')[0];
        graph.push({
            date: dateStr,
            count: graphMap.get(dateStr) || 0
        });
        current.setDate(current.getDate() + 1);
    }

    return successResponse({
        ...link,
        graph,
        total_clicks: (link as any)._count.clicks,
        locations: result.locations || [],
        devices: result.devices || [],
        os: result.os || []
    }, "Link fetched successfully");
})
