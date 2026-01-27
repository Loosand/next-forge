/**
 * [INPUT]: process.env - 环境变量
 * [OUTPUT]: keys() - Zod 验证后的环境变量对象
 * [POS]: 位于 /packages/trigger 的环境变量配置，确保 Trigger.dev 所需的环境变量存在且有效
 *
 * [PROTOCOL]:
 * 1. 一旦本文件新增或修改环境变量，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 * 3. 新增环境变量时，必须同时更新项目根目录的 .env.example
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Trigger.dev 包的环境变量配置
 *
 * 服务端变量：
 * - TRIGGER_SECRET_KEY: Trigger.dev 的 API 密钥（以 tr_dev_ 或 tr_prod_ 开头）
 *
 * 客户端变量：无（所有 Trigger.dev 配置都在服务端）
 */
export const keys = () =>
  createEnv({
    server: {
      TRIGGER_SECRET_KEY: z
        .string()
        .startsWith("tr_")
        .describe("Trigger.dev API key"),
    },
    client: {},
    runtimeEnv: {
      TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
    },
  });
