/**
 * [INPUT]: (环境变量) - BETTER_AUTH_SECRET, BETTER_AUTH_URL, NODE_ENV
 * [OUTPUT]: auth - Better Auth 服务端实例; Session/User - 会话和用户类型
 * [POS]: 位于 /packages/auth 的核心导出，作为服务端身份验证的单一真相来源
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的认证策略、插件配置、数据库钩子变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 新增认证方法时，必须同时更新 client.ts 中的客户端配置和类型导出
 * 4. 修改 session 配置时，必须确保 proxy.ts 中的会话检查逻辑一致
 */

/** biome-ignore-all lint/style/noNestedTernary: better-auth plugins */
import "server-only";

import { render } from "@react-email/components";
import { database } from "@repo/database";
import * as schema from "@repo/database/schema";
import { resend } from "@repo/email";
import { keys as emailKeys } from "@repo/email/keys";
import { OTPTemplate } from "@repo/email/templates/otp";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { keys } from "./keys";
import { saveTrackingData } from "./utils/save-tracking-data";

const env = keys();
const email = emailKeys();

/**
 * Better Auth 服务端实例
 *
 * 配置说明：
 * - database: 使用 Drizzle 适配器连接 PostgreSQL
 * - emailAndPassword: 启用邮箱密码登录，要求邮箱验证
 * - emailOTP: OTP 验证插件（6 位数字，5 分钟有效期）
 * - session: 会话缓存配置（30 天有效期）
 * - databaseHooks: 用户创建后的追踪数据保存
 */
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
    requireEmailVerification: true,
  },
  _plugins: [
    nextCookies(),
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email: userEmail, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Sign in to your account"
            : type === "email-verification"
              ? "Verify your email address"
              : "Reset your password";

        const html = await render(OTPTemplate({ otp, type }));

        await resend.emails.send({
          from: email.RESEND_FROM,
          to: userEmail,
          subject,
          html,
        });
      },
    }),
  ],
  get plugins() {
    return this._plugins;
  },
  set plugins(value) {
    this._plugins = value;
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30,
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
          void saveTrackingData(createdUser.id).catch((error) => {
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
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
