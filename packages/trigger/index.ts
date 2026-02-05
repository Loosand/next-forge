/**
 * [INPUT]: 无
 * [OUTPUT]: 导出 Trigger.dev 任务和工具函数
 * [POS]: 位于 /packages/trigger 的入口文件，统一导出所有任务供其他包调用
 *
 * [PROTOCOL]:
 * 1. 新增任务时，必须在此文件中添加导出
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 */

export { keys } from "./keys";
export {
  triggerNanoBanana,
  triggerNanoBananaEdit,
  triggerNanoBananaPro,
  triggerNanoBananaProEdit,
} from "./tasks/fal-models";
export { createTypedFalTrigger, falRunTask } from "./tasks/fal-run";
export { helloWorldTask } from "./tasks/hello-world";
export type { FalRunPayload, FalRunResult } from "./types/fal";
