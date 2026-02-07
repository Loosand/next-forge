import type { EndpointTypeMap } from "@fal-ai/client/endpoints";
import type { CustomEndpointTypeMap } from "./custom-endpoints";

export type FalEndpointTypeMap = EndpointTypeMap & CustomEndpointTypeMap;

export type FalModelId = keyof FalEndpointTypeMap;

export type FalModelIds = FalModelId[];

export * from "@fal-ai/client/endpoints";
export * from "./custom-endpoints";
