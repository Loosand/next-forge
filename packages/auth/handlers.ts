/**
 * [INPUT]: auth - Better Auth 服务端实例（来自 ./server.ts）
 * [OUTPUT]: POST, GET - Next.js API 路由处理器
 * [POS]: 位于 /packages/auth 的路由处理器导出，在 apps/app/app/api/auth/[...all]/route.ts 中被使用
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的导出方法变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 不要修改此文件，所有认证配置都在 server.ts 中完成
 */

import "server-only";

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "./server";

/**
 * Next.js API 路由处理器
 *
 * 使用 Better Auth 的 toNextJsHandler 将 auth 实例转换为 Next.js 路由处理器。
 * 这些处理器会自动处理所有认证相关的 API 请求：
 * - POST /api/auth/sign-in - 登录
 * - POST /api/auth/sign-up - 注册
 * - POST /api/auth/sign-out - 退出
 * - GET /api/auth/session - 获取会话
 * - POST /api/auth/email-otp/send - 发送 OTP
 * - POST /api/auth/email-otp/verify - 验证 OTP
 * - ... 等其他 Better Auth 端点
 *
 * 在 apps/app/app/api/auth/[...all]/route.ts 中使用：
 * ```typescript
 * export { GET, POST } from "@repo/auth/handlers";
 * ```
 */
export const { POST, GET } = toNextJsHandler(auth);
