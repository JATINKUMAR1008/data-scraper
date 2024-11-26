import { integer, pgTable, text, time, timestamp } from "drizzle-orm/pg-core";
import { workflowTable } from "./workflows";
import { usersTable } from "./user";
import { create } from "domain";
import { start } from "repl";
import { InferInsertModel } from "drizzle-orm";

export const workflowExecutionTable = pgTable("workflow-execution", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workflowId: integer().references(() => workflowTable.id),
  userId: integer().references(() => usersTable.id),
  trigger: text(),
  status: text(),
  definition: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at"),
  creditsConsumed: integer(),
});

export const ExecutionPhase = pgTable("execution-phase", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  executionId: integer().references(() => workflowExecutionTable.id),
  userId: integer().references(() => usersTable.id),
  number: integer(),
  status: text(),
  name: text(),
  node: text(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  inputs: text(),
  outputs: text(),
  creditsConsumed: integer(),
});

export const ExecutionLogs = pgTable("execution-logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  logLevel: text(),
  message: text(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  executionPhaseId: integer().references(() => ExecutionPhase.id),
});

export type WorkFlowExecution = InferInsertModel<
  typeof workflowExecutionTable
> & { id: number };
export type ExecutionPhase = InferInsertModel<typeof ExecutionPhase> & {
  id: number;
};
export type ExecutionLog = InferInsertModel<typeof ExecutionLogs> & {
  id: number;
};
