import type { RegistrationMeta } from "@repo/database/types";
import { cookies } from "next/headers";

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
async function getTrackingData(): Promise<RegistrationMeta | null> {
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

export { TRACKING_COOKIE, COOKIE_MAX_AGE, COOKIE_OPTIONS, getTrackingData };
