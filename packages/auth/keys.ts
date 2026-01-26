/**
 * [INPUT]: process.env - 环境变量
 * [OUTPUT]: keys() - Zod 验证后的环境变量对象
 * [POS]: 位于 /packages/auth 的环境变量配置，确保认证所需的环境变量存在且有效
 *
 * [PROTOCOL]:
 * 1. 一旦本文件新增或修改环境变量，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 新增环境变量时，必须同时更新项目根目录的 .env.example
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * 身份验证包的环境变量配置
 *
 * 服务端变量：
 * - BETTER_AUTH_SECRET: 用于签名会话 token 的密钥（最少 16 字符）
 * - BETTER_AUTH_URL: 应用的基础 URL（生产环境必需，用于回调和邮件链接）
 * - NODE_ENV: 运行环境（development/production）
 *
 * 客户端变量：无（所有认证相关配置都在服务端）
 */
export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string().min(16),
      BETTER_AUTH_URL: z.string().url().optional(),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    client: {},
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
