// utils/asyncHandler.ts
import { NextRequest, NextResponse } from "next/server";

export interface AsyncParams {
  params: Promise<any>
}

// Type for async route handlers
type AsyncRouteHandler = (req: NextRequest, params: AsyncParams) => Promise<NextResponse>;

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Custom Success response
export const successResponse = (
  data: any,
  message: string = "Success",
  status: number = 200,
  meta?: any
) => {
  return NextResponse.json(
    {
      status: "success",
      message,
      data,
      meta,
    },
    { status }
  );
};

// AsyncHandler function
export const asyncHandler = (fn: AsyncRouteHandler) => {
  return async (req: NextRequest, params: AsyncParams): Promise<NextResponse> => {
    try {
      return await fn(req, params);
    } catch (error: any) {
      // Handle custom API errors
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            status: "error",
            message: error.message,
          },
          { status: error.statusCode }
        );
      }

      // Handle Prisma errors
      if (error.code) {
        switch (error.code) {
          case "P2002":
            return NextResponse.json(
              {
                status: "error",
                message: "A record with this data already exists",
              },
              { status: 409 }
            );
          case "P2025":
            return NextResponse.json(
              {
                status: "error",
                message: "Record not found",
              },
              { status: 404 }
            );
          case "P2003":
            return NextResponse.json(
              {
                status: "error",
                message: "Foreign key constraint failed",
              },
              { status: 400 }
            );
          default:
            return NextResponse.json(
              {
                status: "error",
                message: "Database error occurred",
              },
              { status: 500 }
            );
        }
      }

      // Handle validation errors (if using zod or similar)
      if (error.name === "ZodError") {
        return NextResponse.json(
          {
            status: "error",
            message: "Validation failed",
            errors: error.errors,
          },
          { status: 400 }
        );
      }

      // Handle generic errors
      return NextResponse.json(
        {
          status: "error",
          message: error.message || error.description || "Internal server error",
        },
        { status: error.status || 500 }
      );
    }
  };
};

// Helper functions for common HTTP errors
export const throwBadRequest = (message: string = "Bad request") => {
  throw new ApiError(400, message);
};

export const throwUnauthorized = (message: string = "Unauthorized") => {
  throw new ApiError(401, message);
};

export const throwForbidden = (message: string = "Forbidden") => {
  throw new ApiError(403, message);
};

export const throwNotFound = (message: string = "Not found") => {
  throw new ApiError(404, message);
};

export const throwConflict = (message: string = "Conflict") => {
  throw new ApiError(409, message);
};

export const throwValidationError = (message: string = "Validation failed") => {
  throw new ApiError(422, message);
};

export const throwInternalError = (
  message: string = "Internal server error"
) => {
  throw new ApiError(500, message);
};

export const throwError = (status: number = 500, message: string = "Internal server error") => {
  throw new ApiError(status, message);
};
