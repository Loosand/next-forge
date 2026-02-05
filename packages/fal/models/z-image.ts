import { fal } from "@fal-ai/client";
import type {
  ZImageTurboInput,
  ZImageTurboOutput,
} from "@fal-ai/client/endpoints";

export type ZImageTurboOptions = {
  input: ZImageTurboInput;
  logs?: boolean;
  onQueueUpdate?: (status: { status: string }) => void;
};

export async function zImageTurbo(
  options: ZImageTurboOptions
): Promise<ZImageTurboOutput> {
  const result = await fal.subscribe("fal-ai/z-image/turbo", {
    input: options.input,
    logs: options.logs,
    onQueueUpdate: options.onQueueUpdate,
  });
  return result.data;
}
