/**
 * [INPUT]: (Request | actionName: string) - HTTP 请求对象或 Server Action 名称
 * [OUTPUT]: RequestLogger - 请求日志器，提供 set/error/emit 方法
 * [POS]: 位于 /packages/logger 的核心导出，作为全项目 Wide Events 日志入口
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的 evlog 配置、日志方法或导出变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/logger/.folder.md 的描述是否依然准确
 * 3. 新增导出时，必须同时更新 README.md 的 API 参考
 *
 * @repo/logger - Wide Events Logging
 *
 * 基于 evlog 的 wide events 日志模式。
 * 每个请求输出一条包含所有上下文的结构化日志。
 */

import {
  createError as createEvlogError,
  createRequestLogger as createEvlogRequestLogger,
  log as evlog,
  initLogger,
  parseError as parseEvlogError,
} from "evlog";

// 初始化标记
let initialized = false;

/**
 * 初始化 evlog（在应用启动时调用一次）
 */
export function initEvlog(options?: {
  service?: string;
  environment?: string;
  version?: string;
  pretty?: boolean;
}) {
  if (initialized) return;

  initLogger({
    env: {
      service: options?.service || "next-forge-app",
      environment:
        options?.environment || process.env.NODE_ENV || "development",
      version: options?.version,
    },
    pretty: options?.pretty ?? process.env.NODE_ENV !== "production",
  });

  initialized = true;
}

/**
 * 为 API Route 创建请求日志器
 *
 * @example
 * ```ts
 * // app/api/checkout/route.ts
 * import { createRequestLogger } from "@repo/logger";
 *
 * export async function POST(request: Request) {
 *   const log = createRequestLogger(request);
 *
 *   log.set({ user: { id: "123" } });
 *   log.set({ cart: { items: 3 } });
 *
 *   // ... 处理逻辑 ...
 *
 *   log.emit(); // 输出一条包含所有上下文的日志
 *   return Response.json({ success: true });
 * }
 * ```
 */
export function createRequestLogger(request: Request) {
  // 确保已初始化
  initEvlog();

  const url = new URL(request.url);
  const logger = createEvlogRequestLogger({
    method: request.method,
    path: url.pathname,
  });

  // 添加查询参数作为上下文
  const query = Object.fromEntries(url.searchParams);
  if (Object.keys(query).length > 0) {
    logger.set({ query });
  }

  return logger;
}

/**
 * 为 Server Action 创建日志器
 *
 * @example
 * ```ts
 * // app/actions/checkout.ts
 * "use server";
 * import { createActionLogger } from "@repo/logger";
 *
 * export async function checkout(formData: FormData) {
 *   const log = createActionLogger("checkout");
 *
 *   log.set({ user: { id: "123" } });
 *
 *   try {
 *     // ... 处理逻辑 ...
 *     log.emit();
 *     return { success: true };
 *   } catch (error) {
 *     log.error(error, { step: "payment" });
 *     log.emit();
 *     throw error;
 *   }
 * }
 * ```
 */
export function createActionLogger(actionName: string) {
  // 确保已初始化
  initEvlog();

  const logger = createEvlogRequestLogger({
    method: "ACTION",
    path: `/${actionName}`,
  });

  // 添加 action 元数据
  logger.set({ action: actionName, type: "server-action" });

  return logger;
}

/**
 * 创建结构化错误
 *
 * @example
 * ```ts
 * throw createError({
 *   message: "Payment failed",
 *   status: 402,
 *   why: "Card declined",
 *   fix: "Try a different payment method",
 * });
 * ```
 */
export const createError = createEvlogError;

/**
 * 解析错误为结构化格式
 *
 * @example
 * ```ts
 * try {
 *   await checkout();
 * } catch (err) {
 *   const error = parseError(err);
 *   console.log(error.message, error.why, error.fix);
 * }
 * ```
 */
export const parseError = parseEvlogError;

/**
 * 简单日志 API
 *
 * @example
 * ```ts
 * log.info("startup", "Server started");
 * log.error("db", "Connection failed");
 * ```
 */
export const log = evlog;

// 重新导出类型
export type { RequestLogger } from "evlog";
