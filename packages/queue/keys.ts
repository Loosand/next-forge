import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      REDIS_URL: z.string().url().optional(),
      REDIS_HOST: z.string().optional().default("localhost"),
      REDIS_PORT: z.coerce.number().optional().default(6379),
      REDIS_PASSWORD: z.string().optional(),
    },
    runtimeEnv: {
      REDIS_URL: process.env.REDIS_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    },
  });
