import { InferInsertModel } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull().unique(),
  // userId: integer("user_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Organizations = InferInsertModel<typeof organizationsTable>;
