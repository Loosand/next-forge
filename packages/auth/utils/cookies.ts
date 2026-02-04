/**
 * [INPUT]: NextRequest/NextResponse - Next.js 请求响应对象; cookies() - Next.js cookies API
 * [OUTPUT]: getTrackingCookies() - TRegistrationMeta | null; setTrackingCookies() - void; 常量导出
 * [POS]: 位于 /packages/auth/utils 的 Cookie 管理工具，在 middleware 和注册流程中使用
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的 Cookie 策略、追踪逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/utils/.folder.md 的描述是否依然准确
 * 3. 修改 COOKIE_OPTIONS 时，必须确保符合安全最佳实践和隐私政策
 * 4. 新增追踪字段时，必须同时更新 @repo/database/types 中的 TRegistrationMeta 类型
 */

import type { TRegistrationMeta } from "@repo/database/types";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Cookie 名称常量
 * 使用下划线前缀表示内部使用的 Cookie
 */
const TRACKING_COOKIE = "_tracking_data";

/**
 * Cookie 有效期：7 天
 * 足够覆盖大部分用户从访问到注册的时间窗口
 */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Cookie 安全配置
 * - httpOnly: 防止 JavaScript 访问（XSS 防护）
 * - secure: 生产环境强制 HTTPS（开发环境允许 HTTP）
 * - sameSite: "lax" 平衡安全性和功能性
 * - path: "/" 全站可用
 * - maxAge: 7 天有效期
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
} as const;

/**
 * 从 cookies 中获取追踪数据
 *
 * 在用户注册时调用，读取首次访问时记录的来源信息。
 * 用于分析用户来源渠道、落地页效果等。
 *
 * @returns RegistrationMeta 对象或 null（如果 Cookie 不存在或解析失败）
 */
async function getTrackingCookies(): Promise<TRegistrationMeta | null> {
  const cookieStore = await cookies();
  const trackingRaw = cookieStore.get(TRACKING_COOKIE)?.value;

  if (!trackingRaw) {
    return null;
  }

  try {
    return JSON.parse(trackingRaw) as TRegistrationMeta;
  } catch {
    // JSON 解析失败，返回 null（Cookie 可能被篡改或损坏）
    return null;
  }
}

/**
 * 设置追踪 Cookie（如果尚未设置）
 * 记录用户首次访问时的来源信息：referer、国家、落地页等
 */
function setTrackingCookies(
  request: NextRequest,
  response: NextResponse
): void {
  const existingCookie = request.cookies.get(TRACKING_COOKIE);
  if (existingCookie) return;

  const referer = request.headers.get("referer");

  let refererDomain: string | undefined;
  let isExternalReferer = false;
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      refererDomain = refererUrl.hostname;
      isExternalReferer = refererUrl.hostname !== request.nextUrl.hostname;
    } catch {
      // 无效的 URL，忽略
    }
  }

  // 只有在以下情况才设置追踪 Cookie：
  // 1. 有外部 referer（从其他网站点击过来）
  // 2. 或者没有 referer 但访问的是首页/落地页（直接访问、书签等）
  const shouldTrack =
    isExternalReferer || (!referer && request.nextUrl.pathname === "/");

  if (!shouldTrack) return;

  const trackingData = {
    referer: referer || undefined,
    referer_domain: refererDomain,
    referer_country: request.headers.get("x-vercel-ip-country") || undefined,
    landing_url: request.nextUrl.href,
  };

  response.cookies.set({
    ...COOKIE_OPTIONS,
    name: TRACKING_COOKIE,
    value: JSON.stringify(trackingData),
  });
}

export {
  TRACKING_COOKIE,
  COOKIE_MAX_AGE,
  COOKIE_OPTIONS,
  getTrackingCookies,
  setTrackingCookies,
};
