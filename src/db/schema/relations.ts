import { relations } from "drizzle-orm/relations";
import { authMethods, UserBalance, userRoles, usersTable } from "./user";
import { organizationsTable } from "./org";
import { rolesTable } from "./roles";
import { workflowTable } from "./workflows";
import {
  ExecutionLogs,
  ExecutionPhase,
  workflowExecutionTable,
} from "./executions";

export const userWorkflowRelation = relations(workflowTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [workflowTable.userId],
    references: [usersTable.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRoles.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [userRoles.organizationId],
    references: [organizationsTable.id],
  }),
  role: one(rolesTable, {
    fields: [userRoles.roleId],
    references: [rolesTable.id],
  }),
}));

export const authMethodsRelations = relations(authMethods, ({ one }) => ({
  user: one(usersTable, {
    fields: [authMethods.userId],
    references: [usersTable.id],
  }),
}));

export const executionPhaseRelations = relations(ExecutionPhase, ({ one }) => ({
  execution: one(workflowExecutionTable, {
    fields: [ExecutionPhase.executionId],
    references: [workflowExecutionTable.id],
  }),
}));

export const workflowExecutionRelations = relations(
  workflowExecutionTable,
  ({ one, many }) => ({
    phases: many(ExecutionPhase), // Define the relationship to ExecutionPhase
  })
);

export const executionLogsRelations = relations(ExecutionLogs, ({ one }) => ({
  phase: one(ExecutionPhase, {
    fields: [ExecutionLogs.executionPhaseId],
    references: [ExecutionPhase.id],
  }),
}));
export const phaseToExecution = relations(ExecutionPhase, ({ one, many }) => ({
  logs: many(ExecutionLogs),
}));

export const balanceTOUser = relations(usersTable, ({ one }) => ({
  balance: one(UserBalance),
}));
