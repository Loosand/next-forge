import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import languine from "./languine.json" with { type: "json" };

// 所有支持的语言列表（从配置文件读取）
const locales = [languine.locale.source, ...languine.locale.targets];

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale: "en",
  // URL 策略：默认语言（英文）不显示前缀
  // 比如：英文是 example.com/，而不是 example.com/en/
  // 其他语言会显示：example.com/zh/、example.com/es/ 等
  urlMappingStrategy: "rewriteDefault",
  // 自定义函数：从用户请求中检测最合适的语言
  resolveLocaleFromRequest: (request: NextRequest) => {
    // 把请求头转成普通对象
    const headers = Object.fromEntries(request.headers.entries());
    // 创建协商器，用来解析 Accept-Language 头
    const negotiator = new Negotiator({ headers });
    // 获取用户浏览器偏好的语言列表（按优先级排序）
    const acceptedLanguages = negotiator.languages();

    // 过滤掉无效的语言值，比如 '*'（表示任意语言）或空字符串
    const validLanguages = acceptedLanguages.filter(
      (lang) => lang && lang !== "*" && lang.trim() !== ""
    );

    // 如果没有有效的语言偏好，就用默认的英文
    if (validLanguages.length === 0) {
      return "en";
    }

    try {
      // 从用户偏好的语言列表中，找出我们支持的最匹配的语言
      // 比如用户偏好 ['zh-CN', 'en']，我们支持 ['en', 'zh']，就匹配到 'zh'
      const matchedLocale = matchLocale(validLanguages, locales, "en");
      return matchedLocale;
    } catch (_error) {
      // 如果匹配失败（比如语言格式不对），就用英文兜底
      return "en";
    }
  },
});

/**
 * 导出国际化中间件，在 Next.js middleware.ts 中使用
 * 这个中间件会自动根据用户浏览器语言重定向到对应的语言版本
 */
export const internationalizationMiddleware = (request: NextRequest) =>
  I18nMiddleware(request);

/**
 * 中间件匹配规则：哪些路径需要经过国际化处理
 * 排除了：
 *   - /api/* (API 路由不需要多语言)
 *   - /_next/static/* (静态文件)
 *   - /_next/image/* (图片优化)
 *   - /favicon.ico (网站图标)
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// 参考文档（如果你想深入了解）：
// Next.js 官方国际化文档：
// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// Next.js 国际化路由示例：
// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
// next-international 库：
// https://github.com/QuiiBz/next-international
// next-international 中间件配置文档：
// https://next-international.vercel.app/docs/app-middleware-configuration
