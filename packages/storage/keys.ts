import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () => {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const defaultEndpoint = accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : undefined;

  return createEnv({
    server: {
      CLOUDFLARE_R2_ACCOUNT_ID: z.string(),
      CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
      CLOUDFLARE_R2_BUCKET: z.string(),
      CLOUDFLARE_R2_ENDPOINT: z
        .string()
        .optional()
        .default(defaultEndpoint ?? ""),
    },
    client: {
      NEXT_PUBLIC_CLOUDFLARE_R2_URL: z.string().optional(),
    },
    runtimeEnv: {
      CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
      CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      CLOUDFLARE_R2_SECRET_ACCESS_KEY:
        process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      CLOUDFLARE_R2_BUCKET: process.env.CLOUDFLARE_R2_BUCKET,
      CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
      NEXT_PUBLIC_CLOUDFLARE_R2_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL,
    },
  });
};
