import { pgTable, serial, text } from "drizzle-orm/pg-core";

// ============================================
// Tables
// ============================================

export const page = pgTable("page", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
