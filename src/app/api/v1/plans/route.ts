import { NextResponse } from "next/server";

import client from "@/lib/helper/db";


export async function GET() {
    try {
        const plans = await client.plan.findMany({
            where: {
                is_active: true
            },
            select: {
                id: true,
                type: true,
                name: true,
                description: true,
                price: true,
                currency: true,
                features: true,
                limits: true
            },
            orderBy: {
                created_at: 'asc'
            }
        });

        return NextResponse.json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error("Error fetching plans:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch plans"
            },
            { status: 500 }
        );
    }
}
