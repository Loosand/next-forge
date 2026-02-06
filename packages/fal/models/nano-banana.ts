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

export type NanoBananaOptions = {
  input: NanoBananaInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function nanoBanana(
  options: NanoBananaOptions
): Promise<NanoBananaOutput> {
  const result = await fal.subscribe("fal-ai/nano-banana", {
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
  options: NanoBananaEditOptions
): Promise<NanoBananaEditOutput> {
  const result = await fal.subscribe("fal-ai/nano-banana/edit", {
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
  options: NanoBananaProOptions
): Promise<NanoBananaProOutput> {
  const result = await fal.subscribe("fal-ai/nano-banana-pro", {
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
  options: NanoBananaProEditOptions
): Promise<NanoBananaProEditOutput> {
  const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}
