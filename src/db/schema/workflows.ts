import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { InferInsertModel } from "drizzle-orm";

export const workflowTable = pgTable("workflows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id),
  description: varchar(),
  name: varchar().notNull(),
  definition: varchar(),
  status: varchar(),

  cron: varchar(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  lastRunAt: timestamp("last_run_at"),
  lastRunStatus: varchar("last_run_status"),
  lastRunId: integer("last_run_id"),
  nextRunAt: timestamp(),

  executionPlan: text(),
  creditsCost: integer().default(0),
});
export type Workflow = InferInsertModel<typeof workflowTable>;
