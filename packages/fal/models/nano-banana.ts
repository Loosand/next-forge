import { fal } from "@fal-ai/client";
import type {
  NanoBananaEditInput,
  NanoBananaEditOutput,
  NanoBananaInput,
  NanoBananaOutput,
  NanoBananaProEditInput,
  NanoBananaProEditOutput,
  NanoBananaProInput,
  NanoBananaProOutput,
} from "@fal-ai/client/endpoints";
import type { FalModelId } from "@/types";

export type {
  NanoBananaInput,
  NanoBananaOutput,
} from "@fal-ai/client/endpoints";

const ENDPOINT_ID: FalModelId = "fal-ai/nano-banana";

export type NanoBananaOptions = {
  input: NanoBananaInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function nanoBanana(
  options: NanoBananaOptions
): Promise<NanoBananaOutput> {
  const result = await fal.subscribe(ENDPOINT_ID, {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}

export type NanoBananaEditOptions = {
  input: NanoBananaEditInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function nanoBananaEdit(
  options: NanoBananaOptions
): Promise<NanoBananaEditOutput> {
  const result = await fal.subscribe(ENDPOINT_ID, {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}

export type NanoBananaProOptions = {
  input: NanoBananaProInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function nanoBananaPro(
  options: NanoBananaOptions
): Promise<NanoBananaProOutput> {
  const result = await fal.subscribe(ENDPOINT_ID, {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}

export type NanoBananaProEditOptions = {
  input: NanoBananaProEditInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function nanoBananaProEdit(
  options: NanoBananaOptions
): Promise<NanoBananaProEditOutput> {
  const result = await fal.subscribe(ENDPOINT_ID, {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}
