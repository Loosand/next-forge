import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ASSET_TYPE, TASK_STATUS } from "../types";
import { user } from "./auth";

// ============================================
// Enums
// ============================================

// 提取值为 pgEnum
export const taskStatusEnum = pgEnum("task_status", TASK_STATUS);

export const mediaTypeEnum = pgEnum("media_type", ASSET_TYPE);

// ============================================
// Tables
// ============================================

export const page = pgTable("page", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const task = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  triggerRunId: text("trigger_run_id"),
  model: varchar("model", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  payload: jsonb("payload").notNull(),
  response: jsonb("response"),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const asset = pgTable("asset", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => task.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mediaType: varchar("media_type", { length: 20 }).notNull(),
  metadata: jsonb("metadata"),
  storageKey: text("storage_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// Relations
// ============================================

export const taskRelations = relations(task, ({ one, many }) => ({
  /** 运行记录所属的用户 */
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),

  /** 任务运行产生的资产 */
  assets: many(asset),
}));

export const assetRelations = relations(asset, ({ one }) => ({
  /** 资产所属的用户 */
  user: one(user, {
    fields: [asset.userId],
    references: [user.id],
  }),

  /** 资产关联的任务运行 */
  taskRun: one(task, {
    fields: [asset.taskId],
    references: [task.id],
  }),
}));
