/**
 * [INPUT]: 各模型的类型化输入
 * [OUTPUT]: FalRunResult<模型输出类型>
 * [POS]: 位于 /packages/trigger/tasks 的预定义 fal.ai 模型触发器，提供类型安全的触发函数
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 * 3. 新增模型时，必须同时在 index.ts 中添加导出
 */

import type {
  NanoBananaEditInput,
  NanoBananaEditOutput,
  NanoBananaInput,
  NanoBananaOutput,
  NanoBananaProEditInput,
  NanoBananaProEditOutput,
  NanoBananaProInput,
  NanoBananaProOutput,
} from "@fal-ai/client/endpoints";
import { createTypedFalTrigger } from "./fal-run";

// Nano Banana 系列模型
export const triggerNanoBanana = createTypedFalTrigger<
  "fal-ai/nano-banana",
  NanoBananaInput,
  NanoBananaOutput
>("fal-ai/nano-banana");

export const triggerNanoBananaEdit = createTypedFalTrigger<
  "fal-ai/nano-banana/edit",
  NanoBananaEditInput,
  NanoBananaEditOutput
>("fal-ai/nano-banana/edit");

export const triggerNanoBananaPro = createTypedFalTrigger<
  "fal-ai/nano-banana-pro",
  NanoBananaProInput,
  NanoBananaProOutput
>("fal-ai/nano-banana-pro");

export const triggerNanoBananaProEdit = createTypedFalTrigger<
  "fal-ai/nano-banana-pro/edit",
  NanoBananaProEditInput,
  NanoBananaProEditOutput
>("fal-ai/nano-banana-pro/edit");
