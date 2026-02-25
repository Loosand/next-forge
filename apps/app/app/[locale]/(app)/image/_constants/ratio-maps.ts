/**
 * 比例映射常量。
 * 表单层统一用比例字符串（"1:1"、"4:3"），这些映射负责把比例翻译成各 API 实际需要的值。
 */

// ── 尺寸方案相关类型 ──

/**
 * 尺寸方案。表单层统一用比例字符串（"1:1"、"4:3"），
 * ratioMap 负责把比例翻译成 API 实际需要的值。
 */
export type SizeScheme = {
  field: string; // API 字段名，如 "image_size" 或 "aspect_ratio"
  ratioMap: Record<string, string>; // 比例 → API 值，如 "1:1" → "square_hd"
  default: string; // 默认比例，如 "1:1"
};

/** 额外的 select 类型参数，比如 nano-banana-pro 的 resolution */
export type SelectParam = {
  type: "select";
  field: string; // API 字段名
  label: string; // UI 上显示的标签
  options: { label: string; value: string }[];
  default: string;
};

/** 运行时的模型参数结构。所有 API 字段名都在这里声明，action 层零硬编码。 */
export type ModelParams = {
  prompt: { field: string }; // prompt 对应的 API 字段名，通常是 "prompt"
  size: SizeScheme;
  count?: { field: string; max: number }; // 不存在表示该模型不支持多图；field 通常是 "num_images"
  extras?: SelectParam[]; // 模型独有的额外参数
};

// ── 比例映射常量 ──

/**
 * fal 标准预设映射，适用于 z-image、flux、seedream 等。
 * 比例字符串 → image_size 预设值
 */
export const FAL_STANDARD_RATIO_MAP: Record<
  string,
  | "square_hd"
  | "landscape_4_3"
  | "portrait_4_3"
  | "landscape_16_9"
  | "portrait_16_9"
> = {
  "1:1": "square_hd",
  "4:3": "landscape_4_3",
  "3:4": "portrait_4_3",
  "16:9": "landscape_16_9",
  "9:16": "portrait_16_9",
};

/**
 * nano-banana 系列的映射，API 本身就接受比例字符串，直接透传。
 * 完整支持：21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16
 */
export const RATIO_PASSTHROUGH_MAP: Record<
  string,
  | "21:9"
  | "16:9"
  | "3:2"
  | "4:3"
  | "5:4"
  | "1:1"
  | "4:5"
  | "3:4"
  | "2:3"
  | "9:16"
> = {
  "21:9": "21:9",
  "16:9": "16:9",
  "3:2": "3:2",
  "4:3": "4:3",
  "5:4": "5:4",
  "1:1": "1:1",
  "4:5": "4:5",
  "3:4": "3:4",
  "2:3": "2:3",
  "9:16": "9:16",
};

/**
 * GPT Image 系列的映射。
 * API 接受像素尺寸，这里把等比的比例字符串映射过去。
 */
export const GPT_RATIO_MAP: Record<
  string,
  "1024x1024" | "1536x1024" | "1024x1536"
> = {
  "1:1": "1024x1024",
  "3:2": "1536x1024",
  "2:3": "1024x1536",
};
