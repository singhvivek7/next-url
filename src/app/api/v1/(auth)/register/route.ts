// /api/v1/register

import { NextRequest } from "next/server";

import {
  asyncHandler,
  successResponse,
  throwConflict,
  throwError,
  throwValidationError,
} from "@/lib/helper/async-handler";
import { hash } from "@/lib/helper/bcrypt";
import client from "@/lib/helper/db";
import { registerSchema } from "@/lib/helper/validation";

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();

  // Validate request
  const { success, data } = registerSchema.safeParse(body);

  if (!success) {
    return throwValidationError("Invalid request");
  }

  // Check if user already exists
  const existingUserCount = await client.user.count({
    where: {
      email: data.email,
    },
  });

  if (existingUserCount > 0) {
    return throwConflict("User already exists");
  }

  // Hash password
  const hashedPassword = await hash(data.password);
  data.password = hashedPassword;
  try {

    // Get or create Basic plan
    let basicPlan = await client.plan.findUnique({
      where: { type: "BASIC" }
    });

    if (!basicPlan) {
      basicPlan = await client.plan.create({
        data: {
          type: "BASIC",
          name: "Basic Plan",
          price: 0,
          features: ["Shorten links", "Basic analytics", "10 links limit"],
          limits: { urls: 10, clicks: 1000 }
        }
      });
    }

    // Create user
    const user = await client.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        plan_id: basicPlan.id,
      },
    });

    // Link matched history URLs to the new user
    if (body.history && Array.isArray(body.history) && body.history.length > 0) {
      await client.url.updateMany({
        where: {
          short_url: {
            in: body.history,
          },
          user_id: null, // Only claim anonymous URLs
        },
        data: {
          user_id: user.id,
        },
      });
    }

    return successResponse(
      {
        user_id: user.id,
      },
      "User registered successfully",
      201
    );
  } catch (err: any) {
    return throwError(err.status, err.message);
  }
});
