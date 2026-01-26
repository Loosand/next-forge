/**
 * [INPUT]: middlewareFn? - 可选的自定义中间件函数
 * [OUTPUT]: middleware - Next.js 中间件函数（处理路由保护和重定向）
 * [POS]: 位于 /packages/auth 的中间件导出，在 apps/app/middleware.ts 中被调用
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的路由保护逻辑、公开路由列表变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 修改公开路由时，必须确保不会影响现有的认证流程
 * 4. 新增重定向逻辑时，必须考虑与自定义 middlewareFn 的兼容性
 */

import { getSessionCookie } from "better-auth/cookies";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * 认证中间件工厂函数
 *
 * 功能说明：
 * - 检查用户会话状态（通过 session cookie）
 * - 保护需要认证的路由（未登录重定向到 /auth/sign-in）
 * - 防止已登录用户访问认证页面（重定向到首页）
 * - 支持自定义中间件逻辑的注入
 *
 * 公开路由（无需认证）：
 * - /auth/sign-in - 登录页
 * - /auth/sign-up - 注册页
 * - /auth/verify-email - 邮箱验证页
 * - /api/auth - Better Auth API 端点
 *
 * @param middlewareFn - 可选的自定义中间件函数，在路由保护逻辑之前执行
 * @returns Next.js 中间件函数
 */
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
