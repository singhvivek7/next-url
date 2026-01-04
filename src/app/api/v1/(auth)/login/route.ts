// /api/v1/login

import { NextRequest } from "next/server";

import { IJwtPayload } from "@/app/types/auth.type";
import {
  asyncHandler,
  successResponse,
  throwBadRequest,
  throwValidationError,
} from "@/lib/helper/async-handler";
import { compare } from "@/lib/helper/bcrypt";
import client from "@/lib/helper/db";
import { signJwt } from "@/lib/helper/jwt";
import { loginSchema } from "@/lib/helper/validation";

export const POST = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();

  // Validate request
  const { success, data } = loginSchema.safeParse(body);

  if (!success) {
    return throwValidationError("Invalid request");
  }

  // Check if user already exists
  const user = await client.user.findFirst({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      password: true,
      role: true,
      plan: true,
    },
  });

  if (!user) {
    throw throwBadRequest("Email or password is incorrect");
  }

  // Hash password
  const isMatched = await compare(data.password, user.password);

  if (!isMatched) {
    throw throwBadRequest("Email or password is incorrect");
  }

  // create token
  const payload: IJwtPayload = {
    user_id: user.id,
    role: user.role,
    plan: user.plan,
  };

  const token = signJwt(payload);

  return successResponse(
    {
      user_id: user.id,
      token,
    },
    "Login successful",
    200
  );
});
