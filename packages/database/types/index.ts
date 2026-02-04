/**
 * 简化版注册元数据类型定义
 * 保留完整的 referer 信息和短链代码
 */
export type TRegistrationMeta = {
  referer?: string; // 完整的来源 URL
  referer_domain?: string; // 来源域名
  referer_country?: string; // 来源路径
  landing_url?: string; // 用户首次访问的完整 URL（包含查询参数，用于 gads 等追踪）
};
