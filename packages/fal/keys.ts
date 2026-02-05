import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      FAL_KEY: z.string().min(1),
    },
    runtimeEnv: {
      FAL_KEY: process.env.FAL_KEY,
    },
  });
