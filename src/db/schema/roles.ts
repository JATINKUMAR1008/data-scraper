import { InferInsertModel } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Make sure the enum values match exactly with what's in the migration
// export const role_enum = pgEnum("role_enum", ["USER", "ADMIN", "MEMBER"]);

export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Roles = InferInsertModel<typeof rolesTable>;
