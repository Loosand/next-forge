import type { EndpointTypeMap } from "@fal-ai/client/endpoints";

export type FalModelId = keyof EndpointTypeMap;

export type FalModelIds = (keyof EndpointTypeMap)[];

export * from "@fal-ai/client/endpoints";
