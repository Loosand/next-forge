import type { FalEndpointTypeMap, FalModelId } from "@repo/fal/types";
import {
  FAL_STANDARD_RATIO_MAP,
  GPT_RATIO_MAP,
  type ModelParams,
  RATIO_PASSTHROUGH_MAP,
  type SelectParam,
} from "./ratio-maps";

// 从 ratio-maps 重新导出类型和常量，下游组件可以直接从 models 引入
export type { ModelParams, SelectParam, SizeScheme } from "./ratio-maps";
export {
  FAL_STANDARD_RATIO_MAP,
  GPT_RATIO_MAP,
  RATIO_PASSTHROUGH_MAP,
} from "./ratio-maps";

export type ModelCategory = "image" | "video";

// ── 类型工具：从 fal 端点的 Input 类型中提取编译期约束 ──

/** 根据模型 ID 拿到它在 fal 端点中声明的 Input 类型 */
type InputOf<T extends FalModelId> = FalEndpointTypeMap[T]["input"];

/** 从联合类型中只保留 string 成员，过滤掉 ImageSize 等对象类型 */
type StringOnly<T> = T extends string ? T : never;

/**
 * 推导模型的尺寸字段名：
 * - Input 里有 image_size  → "image_size"
 * - Input 里有 aspect_ratio → "aspect_ratio"
 * - 都没有就退化成 string
 */
type SizeFieldOf<T extends FalModelId> = "image_size" extends keyof InputOf<T>
  ? "image_size"
  : "aspect_ratio" extends keyof InputOf<T>
    ? "aspect_ratio"
    : string;

/**
 * 推导模型尺寸字段可接受的字符串字面量联合。
 * 例如 z-image → "square_hd" | "landscape_4_3" | ...
 * 例如 gpt-image-1.5 → "1024x1024" | "1536x1024" | "1024x1536"
 */
type SizeValuesOf<T extends FalModelId> =
  SizeFieldOf<T> extends keyof InputOf<T>
    ? StringOnly<NonNullable<InputOf<T>[SizeFieldOf<T>]>>
    : string;

// ── 编译期类型安全的模型定义 ──

/**
 * 带完整类型约束的模型定义，由 defineModel 在定义时使用。
 *
 * 约束：
 * 1. size.field 必须匹配该模型 Input 里实际的字段名
 * 2. size.ratioMap 的值必须是该字段能接受的字面量
 * 3. 如果 Input 里没有 num_images，则不允许传 count
 */
type TypedModelDef<T extends FalModelId> = {
  id: T;
  name: string;
  description: string;
  category: ModelCategory;
  featured?: boolean;
  premium?: boolean;
  params: {
    prompt: { field: "prompt" };
    size: {
      field: SizeFieldOf<T>;
      ratioMap: Record<string, SizeValuesOf<T>>;
      default: string;
    };
    extras?: SelectParam[];
  } & ("num_images" extends keyof InputOf<T>
    ? { count?: { field: "num_images"; max: number } }
    : { count?: undefined });
};

/**
 * 定义模型的辅助函数。
 * 编译时校验参数是否与 fal 端点类型一致，通过后擦除泛型返回 ModelDef。
 * 写错字段名、填了不存在的 API 值、给不支持的模型加 count，都会编译报错。
 */
function defineModel<T extends FalModelId>(def: TypedModelDef<T>): ModelDef {
  return def as ModelDef;
}

// ── 模型定义 ──

/** 运行时的模型定义类型（泛型已擦除，下游组件直接用这个） */
export type ModelDef = {
  id: FalModelId;
  name: string;
  description: string;
  category: ModelCategory;
  featured?: boolean; // 是否在首页推荐展示
  premium?: boolean; // 是否为付费模型
  params: ModelParams;
};

export const DEFAULT_MODEL_ID: FalModelId = "fal-ai/z-image/turbo";

export const IMAGE_MODELS: ModelDef[] = [
  // nano-banana-pro: aspect_ratio 透传 + resolution 额外参数
  defineModel({
    id: "fal-ai/nano-banana-pro",
    name: "Nano Banana Pro",
    description: "Google's flagship generation model",
    category: "image",
    featured: true,
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "aspect_ratio",
        ratioMap: RATIO_PASSTHROUGH_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
      extras: [
        {
          type: "select",
          field: "resolution",
          label: "Resolution",
          options: [
            { label: "1K", value: "1K" },
            { label: "2K", value: "2K" },
            { label: "4K", value: "4K" },
          ],
          default: "1K",
        },
      ],
    },
  }),
  // nano-banana: 同 pro 但没有 resolution
  defineModel({
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Google's standard generation model",
    category: "image",
    premium: true,
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "aspect_ratio",
        ratioMap: RATIO_PASSTHROUGH_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
    },
  }),
  // seedream: image_size + 标准预设
  defineModel({
    id: "fal-ai/bytedance/seedream/v4/edit",
    name: "Seedream 4.0",
    description: "ByteDance's advanced image editing model",
    category: "image",
    premium: true,
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: FAL_STANDARD_RATIO_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
    },
  }),
  // z-image: image_size + 标准预设
  defineModel({
    id: "fal-ai/z-image/turbo",
    name: "Z Image",
    description: "Instant lifelike portraits",
    category: "image",
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: FAL_STANDARD_RATIO_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
    },
  }),
  // gpt-image-1.5: image_size + 像素尺寸，比例映射为 1:1 / 3:2 / 2:3
  defineModel({
    id: "fal-ai/gpt-image-1.5",
    name: "GPT Image 1.5",
    description: "Instant lifelike portraits",
    category: "image",
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: GPT_RATIO_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
    },
  }),
  // flux-2-pro: image_size + 标准预设，不支持 num_images（只能生成 1 张）
  defineModel({
    id: "fal-ai/flux-2-pro",
    name: "FLUX.2 Pro",
    description: "Speed-optimized detail",
    category: "image",
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: FAL_STANDARD_RATIO_MAP,
        default: "1:1",
      },
      // 没有 count — flux-2-pro 的 Input 里没有 num_images，写了会编译报错
    },
  }),
  // flux-2-flex: 同 flux-2-pro，也不支持 num_images
  defineModel({
    id: "fal-ai/flux-2-flex",
    name: "FLUX.2 Flex",
    description: "Next-gen image generation",
    category: "image",
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: FAL_STANDARD_RATIO_MAP,
        default: "1:1",
      },
    },
  }),
  // gpt-image-1: 同 gpt-image-1.5 的映射
  defineModel({
    id: "fal-ai/gpt-image-1/text-to-image",
    name: "GPT Image",
    description: "Versatile text-to-image AI",
    category: "image",
    params: {
      prompt: { field: "prompt" },
      size: {
        field: "image_size",
        ratioMap: GPT_RATIO_MAP,
        default: "1:1",
      },
      count: { field: "num_images", max: 4 },
    },
  }),
];

/** 首页推荐模型（featured: true） */
export const FEATURED_MODELS = IMAGE_MODELS.filter((m) => m.featured);
/** 其余所有模型 */
export const ALL_MODELS = IMAGE_MODELS.filter((m) => !m.featured);
