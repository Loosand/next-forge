import { getSessionCookie } from "better-auth/cookies";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function authMiddleware(
  middlewareFn?: (
    auth: { req: NextRequest; authorized: boolean },
    request: NextRequest,
    event: NextFetchEvent
  ) => Promise<Response> | Response
) {
  return async function middleware(
    request: NextRequest,
    event: NextFetchEvent
  ) {
    const sessionCookie = getSessionCookie(request);
    const authorized = Boolean(sessionCookie);
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/sign-in", "/sign-up"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (middlewareFn) {
      const response = await middlewareFn(
        { req: request, authorized },
        request,
        event
      );
      if (response?.headers?.get("Location")) {
        return response;
      }
    }

    // Redirect to sign-in only if not authenticated and not on a public route
    if (!(sessionCookie || isPublicRoute)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect to home if authenticated and trying to access auth pages
    if (sessionCookie && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  };
}
