import { getSessionCookie } from "better-auth/cookies";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TRACKING_COOKIE } from "./utils/cookies";

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

    // 📊 日志：追踪所有请求的 referer 信息
    const referer = request.headers.get("referer");
    const userAgent = request.headers.get("user-agent");
    const country = request.headers.get("x-vercel-ip-country");
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for");

    const existingTrackingCookie = request.cookies.get(TRACKING_COOKIE);

    console.log("🔍 [Proxy] Request Info:", {
      pathname,
      referer: referer || "(direct)",
      country,
      ip,
      userAgent: userAgent?.substring(0, 50),
      hasTrackingCookie: !!existingTrackingCookie,
      trackingCookieValue: existingTrackingCookie?.value,
    });

    // Public routes that don't require authentication
    const publicRoutes = [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/verify-email",
      "/api/auth",
    ];
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
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Redirect to home if authenticated and trying to access auth pages
    if (sessionCookie && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  };
}
