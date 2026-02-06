/**
 * [INPUT]: 无
 * [OUTPUT]: Trigger.dev 配置对象
 * [POS]: 位于 packages/trigger 目录，作为 Trigger.dev v4 的配置文件
 *
 * [PROTOCOL]:
 * 1. 一旦本文件配置变更，必须同步更新此 Header
 * 2. 新增任务目录时，必须在 dirs 数组中添加路径
 * 3. 任务文件统一放在 tasks/ 目录下
 */

import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_tpthokekueinijtowhel",
  runtime: "bun",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  build: {
    // `server-only` 包通过 exports.react-server 条件解析到空模块。
    // Trigger 任务运行在服务端，加此条件让 esbuild 正确解析。
    conditions: ["react-server"],
  },
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10_000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./tasks"],
});
