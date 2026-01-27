/**
 * [INPUT]: { name: string } - 可选的名称参数
 * [OUTPUT]: { message: string } - 问候消息
 * [POS]: 位于 /packages/trigger/tasks 的示例任务，展示 Trigger.dev 任务的基本结构
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 */

import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const helloWorldTask = task({
  id: "hello-world",
  maxDuration: 300, // 5 minutes
  run: async (payload: { name?: string }) => {
    const name = payload.name ?? "World";

    logger.info("Starting hello world task", { name });

    // 模拟一些异步工作
    await wait.for({ seconds: 1 });

    const message = `Hello, ${name}!`;

    logger.info("Task completed", { message });

    return { message };
  },
});
