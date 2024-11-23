import { relations } from "drizzle-orm/relations";
import { authMethods, userRoles, usersTable } from "./user";
import { organizationsTable } from "./org";
import { rolesTable } from "./roles";
import { workflowTable } from "./workflows";

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
