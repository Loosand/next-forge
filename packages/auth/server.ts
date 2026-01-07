import "server-only";

import { database } from "@repo/database";
import * as schema from "@repo/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { keys } from "./keys";

const env = keys();

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: env.BETTER_AUTH_URL ? [env.BETTER_AUTH_URL] : [],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        after: async () => {},
      },
      update: {
        after: async () => {},
      },
    },
    session: {
      create: {
        after: async () => {},
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
