import { log } from "@repo/observability/log";
import { NextResponse } from "next/server";

/**
 * Auth webhook endpoint
 *
 * Better Auth handles user lifecycle events (create, update, delete) internally
 * through database hooks configured in @repo/auth/server.ts.
 *
 * This endpoint can be used for external webhook integrations if needed.
 * For analytics tracking, see the databaseHooks configuration in the auth package.
 */
export const POST = async (request: Request): Promise<Response> => {
  try {
    const payload = await request.json();

    log.info("Auth webhook received", { payload });

    // Handle any custom webhook logic here if needed
    // Better Auth lifecycle events are handled via databaseHooks in auth config

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    log.error("Error processing auth webhook:", { error });
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 400 }
    );
  }
};
