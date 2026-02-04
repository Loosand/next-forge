import type { TRegistrationMeta } from "@repo/database/types";

/**
 * 根据追踪数据判断注册来源
 * 这个可以先跑一段时间，看看数据情况，再细分
 * 前期数据不会丢失，会被保存至 metadata 中
 */
function determineRegistrationSource(
  trackingData: TRegistrationMeta
): string | null {
  // 未能识别具体来源
  return null;
}

export { determineRegistrationSource };
