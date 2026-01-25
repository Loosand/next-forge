import { getSessionCookie } from "better-auth/cookies";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { setTrackingCookie } from "./utils/save-tracking-cookies";

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
    const publicRoutes = ["/sign-in", "/sign-up", "/api/auth"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (middlewareFn) {
      const customResponse = await middlewareFn(
        { req: request, authorized },
        request,
        event
      );
      if (customResponse?.headers?.get("Location")) {
        return customResponse;
      }
    }

    // 创建响应对象
    let response: NextResponse;

    // Redirect to sign-in only if not authenticated and not on a public route
    if (!(sessionCookie || isPublicRoute)) {
      response = NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // Redirect to home if authenticated and trying to access auth pages
    else if (sessionCookie && isPublicRoute) {
      response = NextResponse.redirect(new URL("/", request.url));
    }
    // 正常访问
    else {
      response = NextResponse.next();
    }

    // 设置追踪 Cookie（如果需要）
    setTrackingCookie(request, response);

    return response;
  };
}
