import "server-only";

import { database } from "@repo/database";
import * as schema from "@repo/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { keys } from "./keys";
import { trackRegistrationUser } from "./utils/track-registration-user";

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
  trustedOrigins: env.BETTER_AUTH_URL
    ? [
        env.BETTER_AUTH_URL,
        "http://192.168.*.*:3000", // 局域网访问
      ]
    : [],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 14,
    },
    // just use a custom cookie name in development to avoid conflicts with other local projects
    ...(env.NODE_ENV === "development" && {
      cookieName: "next-forge.session",
    }),
  },
  databaseHooks: {
    user: {
      create: {
        // biome-ignore lint/suspicious/useAwait: trackRegistrationUser is async
        after: async (createdUser) => {
          // biome-ignore lint/complexity/noVoid: must void
          void trackRegistrationUser(createdUser.id).catch((error) => {
            console.log(
              "[Database Hook After] Failed to save registration tracking:",
              error
            );
          });
        },
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
  hooks: {
    before: async () => {},
    after: async () => {},
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
