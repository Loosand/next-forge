"use server";

import { database, eq, user } from "@repo/database";
import type { TRegistrationMeta } from "@repo/database/types";
import { getTrackingCookies } from "./cookies";
import { determineRegistrationSource } from "./determine-registration-source";

/**
 * 从 Cookie 中读取 referer 追踪数据并保存到数据库
 *
 * @param userId - 用户ID
 */
async function saveTrackingData(userId: string): Promise<void> {
  try {
    const trackingData = await getTrackingCookies();

    if (trackingData) {
      const registrationMeta: TRegistrationMeta = {
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

export { saveTrackingData };
