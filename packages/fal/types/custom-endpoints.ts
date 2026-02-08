/**
 * [INPUT]: 自定义 fal 模型端点类型定义
 * [OUTPUT]: 通过 declaration merging 扩展 @fal-ai/client 的 EndpointTypeMap
 * [POS]: 用于补充官方包尚未收录的新模型 ID、Input、Output 类型
 *
 * [PROTOCOL]:
 * 1. 新增模型时，在 CustomEndpointTypeMap 中添加对应的 input/output
 * 2. 同步更新 packages/fal/types/index.ts 中的 FalModelId 类型
 *
 * [示例]: 以 gpt-image-1.5 为例，参数与 gpt-image-1 基本一致
 */

import type { ImageFile } from "@fal-ai/client/endpoints";

// ── Custom Input / Output types ──

export type GptImage15Input = {
  /**
   * The prompt for image generation
   */
  prompt: string;
  /**
   * Aspect ratio for the generated image Default value: `"1024x1024"`
   */
  image_size?: "1024x1024" | "1536x1024" | "1024x1536";
  /**
   * Background for the generated image Default value: `"auto"`
   */
  background?: "auto" | "transparent" | "opaque";
  /**
   * Quality for the generated image Default value: `"high"`
   */
  quality?: "low" | "medium" | "high";
  /**
   * Number of images to generate Default value: `1`
   */
  num_images?: number;
  /**
   * Output format for the images Default value: `"png"`
   */
  output_format?: "jpeg" | "png" | "webp";
  /**
   * If `True`, the media will be returned as a data URI and the output data won't be available in the request history.
   */
  sync_mode?: boolean;
};

export type GptImage15Output = {
  /**
   * The generated images.
   */
  images: ImageFile[];
};

export type GptImage15EditInput = {
  /**
   * The prompt for image generation
   */
  prompt: string;
  /**
   * The URLs of the images to use as a reference for the generation.
   */
  image_urls: string[];
  /**
   * Aspect ratio for the generated image Default value: `"auto"`
   */
  image_size?: "auto" | "1024x1024" | "1536x1024" | "1024x1536";
  /**
   * Background for the generated image Default value: `"auto"`
   */
  background?: "auto" | "transparent" | "opaque";
  /**
   * Quality for the generated image Default value: `"high"`
   */
  quality?: "low" | "medium" | "high";
  /**
   * Input fidelity for the generated image Default value: `"high"`
   */
  input_fidelity?: "low" | "high";
  /**
   * Number of images to generate Default value: `1`
   */
  num_images?: number;
  /**
   * Output format for the images Default value: `"png"`
   */
  output_format?: "jpeg" | "png" | "webp";
  /**
   * If `True`, the media will be returned as a data URI and the output data won't be available in the request history.
   */
  sync_mode?: boolean;
  /**
   * The URL of the mask image to use for the generation. This indicates what part of the image to edit.
   */
  mask_image_url?: string;
};

export type GptImage15EditOutput = {
  /**
   * The generated images.
   */
  images: ImageFile[];
};

// ── Extend EndpointTypeMap ──

export type CustomEndpointTypeMap = {
  "fal-ai/gpt-image-1.5": {
    input: GptImage15Input;
    output: GptImage15Output;
  };
  "fal-ai/gpt-image-1.5/edit": {
    input: GptImage15EditInput;
    output: GptImage15EditOutput;
  };
};
