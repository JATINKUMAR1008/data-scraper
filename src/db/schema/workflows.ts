import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { InferInsertModel } from "drizzle-orm";

export const workflowTable = pgTable("workflows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id),
  description: varchar(),
  name: varchar().notNull(),
  definition: varchar(),
  status: varchar(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type Workflow = InferInsertModel<typeof workflowTable>
