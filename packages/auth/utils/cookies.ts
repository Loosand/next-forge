import type { RegistrationMeta } from "@repo/database/types";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Cookie 名称常量
 */
const TRACKING_COOKIE = "_tracking_data";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Cookie 配置
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
 */
async function getTrackingCookies(): Promise<RegistrationMeta | null> {
  const cookieStore = await cookies();
  const trackingRaw = cookieStore.get(TRACKING_COOKIE)?.value;

  if (!trackingRaw) {
    return null;
  }

  try {
    return JSON.parse(trackingRaw) as RegistrationMeta;
  } catch {
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
