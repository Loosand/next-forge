"use server";

import { database, eq, user } from "@repo/database";
import type { RegistrationMeta } from "@repo/database/types";
import { getTrackingData } from "./cookies";

/**
 * 保存用户注册时的追踪信息
 * 从 Cookie 中读取 referer 追踪数据并保存到数据库
 *
 * @param userId - 用户ID
 */
async function trackRegistrationUser(userId: string): Promise<void> {
  try {
    const trackingData = await getTrackingData();

    if (trackingData) {
      const registrationMeta: RegistrationMeta = {
        referer: trackingData.referer,
        referer_domain: trackingData.referer_domain,
        referer_country: trackingData.referer_country,
        landing_url: trackingData.landing_url,
      };

      const registrationSource = determineRegistrationSource(trackingData);

      await database
        .update(user)
        .set({
          registrationMeta,
          registrationSource,
        })
        .where(eq(user.id, userId));
    }
  } catch (_error) {}
}

/**
 * 根据追踪数据判断注册来源
 * 这个可以先跑一段时间，看看数据情况，再细分
 * 前期数据不会丢失，会被保存至 metadata 中
 */
function determineRegistrationSource(
  trackingData: RegistrationMeta
): string | null {
  // 未能识别具体来源
  return null;
}

export { trackRegistrationUser };
