import { authMiddleware } from "@repo/auth/proxy";
import { setTrackingCookies } from "@repo/auth/utils/cookies";
import languine from "@repo/internationalization/languine.json" with {
  type: "json",
};
import { internationalizationMiddleware } from "@repo/internationalization/proxy";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "./env";

// 从配置文件读取所有支持的语言列表
const locales = [languine.locale.source, ...languine.locale.targets];

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件
    "/((?!_next/static|_next/image|ingest|favicon.ico).*)",
    // API 路由始终运行中间件
    "/(api|trpc)(.*)",
  ],
};

// 安全响应头配置
// 如果配了 feature flags 密钥，就带上工具栏；否则用普通的安全配置
const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Arcjet 安全检查中间件
// 用来过滤恶意机器人，但允许搜索引擎爬虫、预览链接等正常访问
const arcjetMiddleware = async (request: NextRequest) => {
  // 如果没配置 Arcjet key，直接跳过检查
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    // 调用 Arcjet 检查请求是否安全
    // 允许这些类型的机器人通过：
    await secure(
      [
        "CATEGORY:SEARCH_ENGINE", // 搜索引擎爬虫（百度、谷歌等）
        "CATEGORY:PREVIEW", // 预览链接（微信、Twitter 等生成预览图）
        "CATEGORY:MONITOR", // 网站监控服务（uptime 检测等）
      ],
      request
    );
  } catch (error) {
    // 检测到恶意请求，返回 403 禁止访问
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// 用 NEMO 把多个中间件组合起来
// 这样可以按顺序执行：先国际化，再安全检查
const composedMiddleware = createNEMO(
  {},
  {
    // 在主逻辑之前运行这些中间件
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

// 应用的主中间件入口
// 组合了国际化、安全检查和登录验证三大功能
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  const pathname = request.nextUrl.pathname;

  // 第一步：添加安全响应头
  const headersResponse = securityHeaders();

  // 跳过 SEO 文件(robots.txt, sitemap.xml)的中间件处理
  // 这些文件由 Next.js 自动生成,不需要 i18n 或 auth 处理
  if (pathname.endsWith(".txt") || pathname.endsWith(".xml")) {
    return headersResponse;
  }

  // 跳过 API 路由的国际化处理
  // API 路由不需要多语言支持，直接返回安全响应头
  if (pathname.startsWith("/api/") || pathname.startsWith("/trpc/")) {
    // 仍然运行 Arcjet 安全检查
    const arcjetResponse = await arcjetMiddleware(request);
    if (arcjetResponse) {
      return arcjetResponse;
    }
    return headersResponse;
  }

  // 第二步：运行组合中间件（国际化 + Arcjet 安全检查）
  // 仅对非 API 路由运行
  const composedResponse = await composedMiddleware(request, event);

  // 如果国际化或安全检查返回了响应（比如重定向或拦截），就用它
  if (composedResponse) {
    return composedResponse;
  }

  // 第三步：定义公开路由（营销页面、登录注册页面）
  // 公开路由不需要登录验证，包括营销页面、登录注册等
  const publicRoutes = [
    "/", // 首页
    "/contact", // 联系页面
    "/pricing", // 定价页面
    "/auth/sign-in", // 登录页面
    "/auth/sign-up", // 注册页面
  ];

  // 检查当前路径是否为公开路由
  // 1. 去掉开头的语言前缀（比如 /zh/blog → /blog）
  // 2. 检查是否匹配公开路由列表
  // 动态构建语言前缀的正则表达式（从配置文件读取）
  const localePattern = new RegExp(`^\\/(${locales.join("|")})(/|$)`);
  const pathnameWithoutLocale = pathname.replace(localePattern, "/");
  const isPublicRoute =
    pathname.startsWith("/api/") || // API 路由始终公开
    publicRoutes.some((route) => {
      if (route === "/") {
        // 首页精确匹配（/ 或 /zh/ 等）
        return pathnameWithoutLocale === "/" || pathname === "/";
      }
      // 其他路由匹配开头（比如 /blog 匹配 /blog、/blog/xxx 等）
      return pathnameWithoutLocale.startsWith(route);
    });

  // 如果是公开路由，跳过登录验证，直接返回
  if (isPublicRoute) {
    setTrackingCookies(request, NextResponse.next());
    return headersResponse;
  }

  // 第四步：对受保护的路由（应用页面）应用登录验证
  // 比如 /app、/app/search 等页面，需要先登录才能访问
  const authWrapped = authMiddleware(async () => headersResponse);

  return authWrapped(request, event);
}
