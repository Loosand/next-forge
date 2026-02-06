"use server";

import type { NanoBananaInput } from "@repo/fal/types";
import { triggerNanoBanana } from "@repo/trigger";

export async function triggerNanoBananaAction(input: NanoBananaInput) {
  const handle = await triggerNanoBanana({
    input,
    metadata: {
      source: "fal-test-page",
      timestamp: new Date().toISOString(),
    },
  });

  return { runId: handle.id };
}
