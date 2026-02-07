import type { FalModelId } from "@repo/fal/types";

export type ModelCategory = "image" | "video";

export type ModelDef = {
  id: FalModelId;
  name: string;
  description: string;
  category: ModelCategory;
  featured?: boolean;
  premium?: boolean;
};

export const DEFAULT_MODEL_ID: FalModelId = "fal-ai/z-image/turbo";

export const IMAGE_MODELS: ModelDef[] = [
  {
    id: "fal-ai/nano-banana-pro",
    name: "Nano Banana Pro",
    description: "Google's flagship generation model",
    category: "image",
    featured: true,
  },
  {
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Google's standard generation model",
    category: "image",
    premium: true,
  },
  {
    id: "fal-ai/bytedance/seedream/v4/edit",
    name: "Seedream 4.0",
    description: "ByteDance's advanced image editing model",
    category: "image",
    premium: true,
  },
  {
    id: "fal-ai/z-image/turbo",
    name: "Z Image",
    description: "Instant lifelike portraits",
    category: "image",
  },
  {
    id: "fal-ai/gpt-image-1.5",
    name: "GPT Image 1.5",
    description: "Instant lifelike portraits",
    category: "image",
  },
  {
    id: "fal-ai/flux-2-pro",
    name: "FLUX.2 Pro",
    description: "Speed-optimized detail",
    category: "image",
  },
  {
    id: "fal-ai/flux-2-flex",
    name: "FLUX.2 Flex",
    description: "Next-gen image generation",
    category: "image",
  },
  {
    id: "fal-ai/gpt-image-1/text-to-image",
    name: "GPT Image",
    description: "Versatile text-to-image AI",
    category: "image",
  },
];

export const FEATURED_MODELS = IMAGE_MODELS.filter((m) => m.featured);
export const ALL_MODELS = IMAGE_MODELS.filter((m) => !m.featured);
