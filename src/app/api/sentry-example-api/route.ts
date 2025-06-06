// src/app/api/sentry-example-api/route.ts

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

class ExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "ExampleAPIError";
  }
}

export function GET() {
  // Throwing a custom error for demonstration (no external SDK involved)
  throw new ExampleAPIError("This error is raised on the backend by the example API route.");
  // If you wanted to return a normal response instead of throwing:
  // return NextResponse.json({ data: "Testing error handling without Sentry..." });
}
