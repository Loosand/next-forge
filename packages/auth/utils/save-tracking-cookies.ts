import type { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, TRACKING_COOKIE } from "./cookies";

/**
 * 设置追踪 Cookie（如果尚未设置）
 * 记录用户首次访问时的来源信息：referer、国家、落地页等
 */
function setTrackingCookie(request: NextRequest, response: NextResponse): void {
  // 如果已有追踪 Cookie，不再重复设置
  const existingCookie = request.cookies.get(TRACKING_COOKIE);
  if (existingCookie) return;

  const referer = request.headers.get("referer");

  // 解析 referer domain（如果存在）
  let refererDomain: string | undefined;
  let isExternalReferer = false;
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      refererDomain = refererUrl.hostname;
      // 判断是否外部来源（hostname 不同）
      isExternalReferer = refererUrl.hostname !== request.nextUrl.hostname;
    } catch {
      // 无效的 URL，忽略
    }
  }

  // 只有在以下情况才设置追踪 Cookie：
  // 1. 有外部 referer（从其他网站点击过来）
  // 2. 或者没有 referer 但访问的是首页/落地页（直接访问、书签等）
  const shouldTrack = isExternalReferer || (!referer && request.nextUrl.pathname === '/');

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

export { setTrackingCookie };
