/**
 * 数据库 Schema 统一导出
 *
 * 拆分说明：
 * - auth.ts: 认证相关（user, session, account, verification, subscription）
 * - business.ts: 业务相关（taskRuns, assets, creditTransactions, shortLink）
 * - types.ts: 类型定义（RegistrationMeta, TaskConfig, AssetMetadata 等）
 */

// ============================================
// 类型定义导出
// ============================================

export type { TRegistrationMeta } from "../types";

// ============================================
// Schema 导出
// ============================================

export * from "./auth";
export * from "./business";

// ============================================
// 跨模块 Relations
// ============================================

import { relations } from "drizzle-orm";
import { user } from "./auth";
import { task } from "./business";

export const userRelationsExtended = relations(user, ({ many }) => ({
  sessions: many(user),
  accounts: many(user),
  subscriptions: many(user),
  taskRuns: many(task),
}));
