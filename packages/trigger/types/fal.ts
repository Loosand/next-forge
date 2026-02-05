/**
 * [INPUT]: 无
 * [OUTPUT]: FalRunPayload, FalRunResult 类型定义
 * [POS]: 位于 /packages/trigger/types 的类型定义文件，为 fal-run 任务提供类型支持
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 */

import type { QueueStatus, Result } from "@fal-ai/client";
import type { FalModelId } from "@repo/fal/types";

// Re-export fal standard types for convenience
export type { QueueStatus, Result } from "@fal-ai/client";

/**
 * fal-run 任务的输入负载
 */
export type FalRunPayload<TInput = Record<string, unknown>> = {
  /** fal.ai 端点 ID，例如 "fal-ai/nano-banana" */
  endpointId: FalModelId;
  /** 端点输入参数 */
  input: TInput;
  /** 可选配置 */
  config?: {
    /** 轮询间隔（毫秒），默认 2000 */
    pollInterval?: number;
    /** 是否包含日志，默认 true */
    logs?: boolean;
  };
  /** 调用方元数据，用于追踪和关联 */
  metadata?: Record<string, unknown>;
};

/**
 * fal-run 任务的返回结果
 */
export type FalRunResult<TOutput = unknown> =
  | {
      success: true;
      /** fal.ai 标准结果（包含 data 和 requestId） */
      result: Result<TOutput>;
      /** 执行过程中的队列状态日志（使用 fal 标准 QueueStatus） */
      queueLogs: QueueStatus[];
      /** 调用方传入的元数据 */
      metadata?: Record<string, unknown>;
    }
  | {
      success: false;
      error: string;
      /** 执行过程中的队列状态日志 */
      queueLogs: QueueStatus[];
      /** 调用方传入的元数据 */
      metadata?: Record<string, unknown>;
    };
