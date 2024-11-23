import { InferInsertModel } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
export const role_enum = pgEnum("roles_enum", ["ADMIN", "MEMBER", "USER"]);
export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Roles = InferInsertModel<typeof rolesTable>;
