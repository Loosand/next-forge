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
import { env } from "@/env";

export const config = {
  // 告诉 Next.js 哪些路由需要跑中间件
  // 这里会在所有路由上跑，除了静态资源（图片、CSS等）和 Posthog 统计接口
  matcher: ["/((?!_next/static|_next/image|ingest|favicon.ico).*)"],
};

// 安全响应头配置
// 如果配了 feature flags，就带上工具栏；没配就用普通的安全配置
const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Arcjet 安全检查中间件
const arcjetMiddleware = async (request: NextRequest) => {
  // 如果没配置 Arcjet key，直接跳过
  if (!env.ARCJET_KEY) {
    return;
  }

  try {
    // 调用 Arcjet 检查请求是否安全
    await secure(
      [
        // 允许这些类型的机器人通过：
        "CATEGORY:SEARCH_ENGINE", // 搜索引擎爬虫（百度、谷歌等）
        "CATEGORY:PREVIEW", // 预览链接（微信、Twitter等生成预览图）
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

// 用 Nemo 把多个中间件组合起来
const composedMiddleware = createNEMO(
  {},
  {
    // 这些中间件会依次执行：先国际化，再安全检查
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

// Web 应用的主中间件入口
// 这个网站是公开的，所以没有登录验证
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  // 第一步：添加安全响应头
  const headersResponse = securityHeaders();

  // 第二步：执行组合中间件（国际化 + Arcjet 安全检查）
  const middlewareResponse = await composedMiddleware(request, event);

  // 如果组合中间件有返回（比如被拦截了），就用它的返回；否则用安全头的返回
  return middlewareResponse || headersResponse;
}
